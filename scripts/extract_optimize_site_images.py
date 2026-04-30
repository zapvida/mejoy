#!/usr/bin/env python3
"""
Extract and aggressively optimize images from websites.

Pipeline:
1. Crawl sitemap + pages + linked CSS/JS and collect candidate image URLs.
2. Download valid images to originals/ with URL mapping and de-dup by hash.
3. Generate optimized variants (AVIF/WebP/JPEG/PNG where possible).
4. Select smallest file as best variant and write a summary report.
"""

import csv
import hashlib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

from PIL import Image, ImageOps, UnidentifiedImageError


USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
    ".gif",
    ".svg",
    ".bmp",
    ".tif",
    ".tiff",
    ".heic",
    ".heif",
    ".jxl",
    ".ico",
}

CONTENT_TYPE_TO_EXT = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/bmp": ".bmp",
    "image/tiff": ".tiff",
    "image/x-icon": ".ico",
    "image/vnd.microsoft.icon": ".ico",
    "image/heic": ".heic",
    "image/heif": ".heif",
}

NEXT_IMAGE_PARAM = "/_next/image"


@dataclass
class CrawlConfig:
    max_pages: int = 600
    max_assets: int = 800
    request_timeout: int = 25
    sleep_between_requests: float = 0.0


@dataclass
class CrawlResult:
    pages_crawled: int = 0
    assets_crawled: int = 0
    discovered_links: int = 0
    image_candidates: Set[str] = field(default_factory=set)


class LinkExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: List[str] = []
        self.assets: List[str] = []
        self.image_like: List[str] = []

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        attr_map = {k.lower(): (v or "") for k, v in attrs}

        if tag in {"a", "link"} and "href" in attr_map:
            href = attr_map["href"].strip()
            if href:
                self.links.append(href)

        if tag in {"script"} and "src" in attr_map:
            src = attr_map["src"].strip()
            if src:
                self.assets.append(src)

        if tag in {"img", "source", "video"}:
            for key in ("src", "data-src", "poster"):
                val = attr_map.get(key, "").strip()
                if val:
                    self.image_like.append(val)

            srcset = attr_map.get("srcset", "").strip()
            if srcset:
                for part in srcset.split(","):
                    candidate = part.strip().split(" ")[0].strip()
                    if candidate:
                        self.image_like.append(candidate)

        if tag == "meta":
            property_name = attr_map.get("property", "") or attr_map.get("name", "")
            if property_name.lower() in {
                "og:image",
                "og:image:url",
                "twitter:image",
                "twitter:image:src",
            }:
                content = attr_map.get("content", "").strip()
                if content:
                    self.image_like.append(content)

    def error(self, message: str) -> None:
        _ = message


class SiteCrawler:
    def __init__(self, base_url: str, output_dir: Path, config: CrawlConfig) -> None:
        self.base_url = self._normalize_base(base_url)
        self.base_parsed = urllib.parse.urlparse(self.base_url)
        self.host = self.base_parsed.netloc
        self.scheme = self.base_parsed.scheme
        self.output_dir = output_dir
        self.config = config

        self.visited_pages: Set[str] = set()
        self.visited_assets: Set[str] = set()

    @staticmethod
    def _normalize_base(url: str) -> str:
        parsed = urllib.parse.urlparse(url)
        if not parsed.scheme:
            url = "https://" + url
            parsed = urllib.parse.urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"

    def _request(self, url: str, expect_binary: bool = False) -> Tuple[int, Dict[str, str], bytes]:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.9,pt-BR;q=0.8",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=self.config.request_timeout) as resp:
                status = getattr(resp, "status", 200)
                headers = {k.lower(): v for k, v in resp.getheaders()}
                body = resp.read()
                if self.config.sleep_between_requests > 0:
                    time.sleep(self.config.sleep_between_requests)
                return status, headers, body
        except urllib.error.HTTPError as e:
            try:
                body = e.read()
            except Exception:
                body = b""
            headers = {k.lower(): v for k, v in e.headers.items()} if e.headers else {}
            return e.code, headers, body
        except Exception:
            return 0, {}, b""

    def _is_same_site(self, url: str) -> bool:
        parsed = urllib.parse.urlparse(url)
        return parsed.netloc == self.host and parsed.scheme in {"http", "https"}

    def _canonicalize_for_crawl(self, url: str) -> str:
        parsed = urllib.parse.urlparse(url)
        path = parsed.path or "/"
        path = re.sub(r"/{2,}", "/", path)
        if path != "/" and path.endswith("/"):
            path = path[:-1]
        canonical = parsed._replace(path=path, params="", query="", fragment="")
        return urllib.parse.urlunparse(canonical)

    def _make_absolute(self, maybe_relative: str, current_url: str) -> Optional[str]:
        candidate = maybe_relative.strip()
        if not candidate:
            return None
        if candidate.startswith("data:"):
            return None
        if candidate.startswith("javascript:"):
            return None
        if candidate.startswith("mailto:") or candidate.startswith("tel:"):
            return None

        absolute = urllib.parse.urljoin(current_url, candidate)
        parsed = urllib.parse.urlparse(absolute)
        if parsed.scheme not in {"http", "https"}:
            return None

        fragmentless = parsed._replace(fragment="")
        return urllib.parse.urlunparse(fragmentless)

    def _looks_like_page(self, url: str) -> bool:
        if self._looks_like_image(url):
            return False
        parsed = urllib.parse.urlparse(url)
        path = parsed.path.lower()
        blocked_ext = (
            ".pdf",
            ".zip",
            ".rar",
            ".7z",
            ".mp4",
            ".mp3",
            ".json",
            ".xml",
            ".csv",
            ".txt",
            ".js",
            ".css",
            ".map",
        )
        if any(path.endswith(ext) for ext in blocked_ext):
            return False
        if path.startswith("/api/"):
            return False
        return True

    def _looks_like_image(self, url: str) -> bool:
        parsed = urllib.parse.urlparse(url)
        path = parsed.path.lower()
        for ext in IMAGE_EXTENSIONS:
            if path.endswith(ext):
                return True
        if NEXT_IMAGE_PARAM in path:
            return True
        query = parsed.query.lower()
        if any(tok in query for tok in ["format=", "fm=", "fit=", "q="]):
            if any(tok in path for tok in ["image", "img", "media", "cdn"]):
                return True
        return False

    def _extract_urls_from_text(self, text: str, base_url: str) -> Set[str]:
        found: Set[str] = set()

        # Generic URL-like tokens (absolute)
        absolute_matches = re.findall(r"https?://[^\s\"'<>]+", text, flags=re.IGNORECASE)
        for m in absolute_matches:
            clean = m.rstrip(",);:\\")
            if self._looks_like_image(clean):
                found.add(clean)

        # Relative URL-like image paths
        relative_matches = re.findall(
            r"(?:['\"(]|^)(/[^\s\"')]+?\.(?:jpe?g|png|webp|avif|gif|svg|bmp|tiff?|ico))(?:[?][^\s\"')]+)?",
            text,
            flags=re.IGNORECASE,
        )
        for rel in relative_matches:
            abs_url = self._make_absolute(rel, base_url)
            if abs_url:
                found.add(abs_url)

        # CSS url(...)
        css_matches = re.findall(r"url\(([^)]+)\)", text, flags=re.IGNORECASE)
        for raw in css_matches:
            val = raw.strip().strip("\"'")
            abs_url = self._make_absolute(val, base_url)
            if abs_url and self._looks_like_image(abs_url):
                found.add(abs_url)

        # Next.js optimizer URLs
        next_img_matches = re.findall(r"/_next/image\?[^\s\"')]+", text, flags=re.IGNORECASE)
        for rel in next_img_matches:
            abs_url = self._make_absolute(rel, base_url)
            if abs_url:
                found.add(abs_url)

        return found

    def _decode_next_image(self, url: str) -> str:
        parsed = urllib.parse.urlparse(url)
        if NEXT_IMAGE_PARAM not in parsed.path:
            return url
        qs = urllib.parse.parse_qs(parsed.query)
        raw = qs.get("url", [""])[0]
        if not raw:
            return url
        decoded = urllib.parse.unquote(raw)
        if decoded.startswith("http://") or decoded.startswith("https://"):
            return decoded
        abs_url = urllib.parse.urljoin(self.base_url + "/", decoded)
        return abs_url

    def _discover_from_page(self, page_url: str, body: bytes) -> Tuple[Set[str], Set[str], Set[str]]:
        text = body.decode("utf-8", errors="ignore")
        parser = LinkExtractor()
        try:
            parser.feed(text)
        except Exception:
            pass

        links: Set[str] = set()
        assets: Set[str] = set()
        images: Set[str] = set()

        for href in parser.links:
            abs_url = self._make_absolute(href, page_url)
            if not abs_url:
                continue
            if self._is_same_site(abs_url):
                canonical = self._canonicalize_for_crawl(abs_url)
                if self._looks_like_page(canonical):
                    links.add(canonical)
            if self._looks_like_image(abs_url):
                images.add(abs_url)

        for src in parser.assets:
            abs_url = self._make_absolute(src, page_url)
            if abs_url and self._is_same_site(abs_url):
                assets.add(abs_url)

        for img in parser.image_like:
            abs_url = self._make_absolute(img, page_url)
            if abs_url:
                images.add(abs_url)

        for discovered in self._extract_urls_from_text(text, page_url):
            images.add(discovered)

        return links, assets, images

    def _extract_sitemaps_from_robots(self) -> List[str]:
        robots_url = self.base_url.rstrip("/") + "/robots.txt"
        status, _, body = self._request(robots_url)
        if status != 200 or not body:
            return []
        text = body.decode("utf-8", errors="ignore")
        sitemaps = []
        for line in text.splitlines():
            line = line.strip()
            if not line.lower().startswith("sitemap:"):
                continue
            url = line.split(":", 1)[1].strip()
            if url:
                sitemaps.append(url)
        return sitemaps

    def _extract_urls_from_sitemap_xml(self, xml_bytes: bytes) -> Tuple[List[str], List[str], List[str]]:
        pages: List[str] = []
        sitemap_links: List[str] = []
        images: List[str] = []
        try:
            root = ET.fromstring(xml_bytes)
        except ET.ParseError:
            return pages, sitemap_links, images

        ns = {
            "sm": "http://www.sitemaps.org/schemas/sitemap/0.9",
            "img": "http://www.google.com/schemas/sitemap-image/1.1",
        }

        # sitemapindex
        for loc in root.findall(".//sm:sitemap/sm:loc", ns):
            if loc.text:
                sitemap_links.append(loc.text.strip())

        # urlset pages
        for loc in root.findall(".//sm:url/sm:loc", ns):
            if loc.text:
                pages.append(loc.text.strip())

        # image sitemap extensions
        for loc in root.findall(".//img:image/img:loc", ns):
            if loc.text:
                images.append(loc.text.strip())

        # fallback without namespace
        if not pages and not sitemap_links and not images:
            for el in root.iter():
                tag = el.tag.lower()
                if tag.endswith("loc") and el.text:
                    val = el.text.strip()
                    if "sitemap" in val.lower() and val.lower().endswith(".xml"):
                        sitemap_links.append(val)
                    else:
                        pages.append(val)

        return pages, sitemap_links, images

    def discover_seed_pages(self) -> Tuple[Set[str], Set[str]]:
        pages: Set[str] = {self.base_url.rstrip("/") + "/"}
        images: Set[str] = set()

        default_sitemaps = {
            self.base_url.rstrip("/") + "/sitemap.xml",
            self.base_url.rstrip("/") + "/sitemap_index.xml",
            self.base_url.rstrip("/") + "/sitemap-index.xml",
        }
        default_sitemaps.update(self._extract_sitemaps_from_robots())

        visited_sitemap: Set[str] = set()
        queue: List[str] = list(default_sitemaps)

        while queue:
            sm = queue.pop(0)
            if sm in visited_sitemap:
                continue
            visited_sitemap.add(sm)
            status, _, body = self._request(sm)
            if status != 200 or not body:
                continue
            page_urls, nested_sitemaps, image_urls = self._extract_urls_from_sitemap_xml(body)
            for p in page_urls:
                abs_p = self._make_absolute(p, self.base_url + "/")
                if abs_p and self._is_same_site(abs_p):
                    canonical = self._canonicalize_for_crawl(abs_p)
                    if self._looks_like_page(canonical):
                        pages.add(canonical)
            for i in image_urls:
                abs_i = self._make_absolute(i, self.base_url + "/")
                if abs_i:
                    images.add(abs_i)
            for n in nested_sitemaps:
                abs_n = self._make_absolute(n, self.base_url + "/")
                if abs_n and abs_n not in visited_sitemap:
                    queue.append(abs_n)

        return pages, images

    def crawl(self) -> CrawlResult:
        result = CrawlResult()

        seed_pages, seed_images = self.discover_seed_pages()
        result.image_candidates.update(seed_images)

        page_queue: List[str] = list(seed_pages)
        asset_queue: List[str] = []

        while page_queue and result.pages_crawled < self.config.max_pages:
            page_url = page_queue.pop(0)
            page_url = self._canonicalize_for_crawl(page_url)
            if page_url in self.visited_pages:
                continue
            self.visited_pages.add(page_url)

            status, headers, body = self._request(page_url)
            content_type = headers.get("content-type", "")
            if status != 200 or "text/html" not in content_type.lower():
                continue

            result.pages_crawled += 1
            if result.pages_crawled % 50 == 0:
                print(
                    f"[crawl] {self.host} pages={result.pages_crawled} "
                    f"queue={len(page_queue)} assets_queue={len(asset_queue)} "
                    f"candidates={len(result.image_candidates)}",
                    flush=True,
                )
            links, assets, images = self._discover_from_page(page_url, body)
            result.image_candidates.update(images)
            result.discovered_links += len(links)

            for link in links:
                if link not in self.visited_pages and len(page_queue) < self.config.max_pages * 3:
                    page_queue.append(link)

            for asset in assets:
                if asset not in self.visited_assets and len(asset_queue) < self.config.max_assets * 3:
                    asset_queue.append(asset)

        while asset_queue and result.assets_crawled < self.config.max_assets:
            asset_url = asset_queue.pop(0)
            if asset_url in self.visited_assets:
                continue
            self.visited_assets.add(asset_url)

            status, headers, body = self._request(asset_url)
            content_type = headers.get("content-type", "").lower()
            if status != 200:
                continue
            if (
                "javascript" not in content_type
                and "text/css" not in content_type
                and not asset_url.lower().endswith((".js", ".css", ".mjs"))
            ):
                continue

            result.assets_crawled += 1
            if result.assets_crawled % 100 == 0:
                print(
                    f"[assets] {self.host} assets={result.assets_crawled} "
                    f"queue={len(asset_queue)} candidates={len(result.image_candidates)}",
                    flush=True,
                )
            text = body.decode("utf-8", errors="ignore")
            discovered = self._extract_urls_from_text(text, asset_url)
            for url in discovered:
                result.image_candidates.add(url)

        # decode next/image wrappers
        normalized: Set[str] = set()
        for url in result.image_candidates:
            normalized.add(url)
            decoded = self._decode_next_image(url)
            normalized.add(decoded)

        result.image_candidates = {u for u in normalized if u.startswith("http")}
        return result


class Downloader:
    def __init__(self, output_dir: Path, timeout: int = 30):
        self.output_dir = output_dir
        self.timeout = timeout
        self.originals_dir = output_dir / "originals"
        self.originals_dir.mkdir(parents=True, exist_ok=True)

        self.by_hash: Dict[str, str] = {}
        self.url_to_file: Dict[str, str] = {}
        self.failed: List[Tuple[str, str]] = []

    @staticmethod
    def _safe_name(text: str, max_len: int = 80) -> str:
        cleaned = re.sub(r"[^a-zA-Z0-9._-]+", "_", text)
        cleaned = cleaned.strip("._-") or "file"
        return cleaned[:max_len]

    def _guess_extension(self, url: str, content_type: str, body: bytes) -> str:
        parsed = urllib.parse.urlparse(url)
        path_ext = Path(parsed.path).suffix.lower()
        if path_ext in IMAGE_EXTENSIONS:
            return path_ext

        ctype = content_type.split(";")[0].strip().lower()
        if ctype in CONTENT_TYPE_TO_EXT:
            return CONTENT_TYPE_TO_EXT[ctype]

        sig = body[:16]
        if sig.startswith(b"\x89PNG\r\n\x1a\n"):
            return ".png"
        if sig.startswith(b"\xff\xd8"):
            return ".jpg"
        if sig.startswith(b"GIF87a") or sig.startswith(b"GIF89a"):
            return ".gif"
        if sig[:4] == b"RIFF" and b"WEBP" in sig:
            return ".webp"
        if sig.startswith(b"<svg") or b"<svg" in body[:256].lower():
            return ".svg"
        return ".bin"

    def _request_binary(self, url: str) -> Tuple[int, Dict[str, str], bytes]:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
                "Referer": url,
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                status = getattr(resp, "status", 200)
                headers = {k.lower(): v for k, v in resp.getheaders()}
                body = resp.read()
                return status, headers, body
        except urllib.error.HTTPError as e:
            try:
                body = e.read()
            except Exception:
                body = b""
            headers = {k.lower(): v for k, v in e.headers.items()} if e.headers else {}
            return e.code, headers, body
        except Exception:
            return 0, {}, b""

    def download(self, urls: Set[str]) -> None:
        ordered_urls = sorted(urls)
        for idx, url in enumerate(ordered_urls, start=1):
            if idx % 100 == 0:
                print(
                    f"[download] attempted={idx}/{len(ordered_urls)} "
                    f"unique={len(self.by_hash)} failed={len(self.failed)}",
                    flush=True,
                )
            status, headers, body = self._request_binary(url)
            if status != 200 or not body:
                self.failed.append((url, f"status={status}"))
                continue

            content_type = headers.get("content-type", "").lower()
            if "image" not in content_type and not any(url.lower().split("?")[0].endswith(ext) for ext in IMAGE_EXTENSIONS):
                self.failed.append((url, f"not-image content-type={content_type or 'unknown'}"))
                continue

            file_hash = hashlib.sha256(body).hexdigest()
            if file_hash in self.by_hash:
                self.url_to_file[url] = self.by_hash[file_hash]
                continue

            parsed = urllib.parse.urlparse(url)
            stem = Path(parsed.path).stem or "image"
            stem = self._safe_name(stem)
            ext = self._guess_extension(url, content_type, body)

            unique_base = f"{idx:05d}_{stem}_{file_hash[:12]}"
            rel_path = str(Path("originals") / f"{unique_base}{ext}")
            abs_path = self.output_dir / rel_path
            abs_path.parent.mkdir(parents=True, exist_ok=True)

            with abs_path.open("wb") as f:
                f.write(body)

            self.by_hash[file_hash] = rel_path
            self.url_to_file[url] = rel_path


class Optimizer:
    def __init__(self, output_dir: Path):
        self.output_dir = output_dir
        self.originals_dir = output_dir / "originals"
        self.optimized_dir = output_dir / "optimized"
        self.best_dir = output_dir / "best"
        self.optimized_dir.mkdir(parents=True, exist_ok=True)
        self.best_dir.mkdir(parents=True, exist_ok=True)

        self.records: List[Dict[str, object]] = []

    @staticmethod
    def _copy_file(src: Path, dst: Path) -> None:
        dst.parent.mkdir(parents=True, exist_ok=True)
        with src.open("rb") as fin, dst.open("wb") as fout:
            fout.write(fin.read())

    @staticmethod
    def _optimize_svg_bytes(data: bytes) -> bytes:
        try:
            text = data.decode("utf-8", errors="ignore")
        except Exception:
            return data
        text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
        text = re.sub(r">\s+<", "><", text)
        text = re.sub(r"\s{2,}", " ", text)
        return text.strip().encode("utf-8")

    def _save_avif(self, img: Image.Image, out_path: Path) -> bool:
        try:
            out_path.parent.mkdir(parents=True, exist_ok=True)
            img.save(
                out_path,
                format="AVIF",
                quality=48,
                speed=8,
                optimize=True,
            )
            return True
        except Exception:
            return False

    def _save_webp(self, img: Image.Image, out_path: Path) -> bool:
        try:
            out_path.parent.mkdir(parents=True, exist_ok=True)
            img.save(
                out_path,
                format="WEBP",
                quality=60,
                method=6,
                optimize=True,
            )
            return True
        except Exception:
            return False

    def _save_jpeg(self, img: Image.Image, out_path: Path) -> bool:
        try:
            out_path.parent.mkdir(parents=True, exist_ok=True)
            if img.mode in {"RGBA", "LA", "P"}:
                img = img.convert("RGB")
            else:
                img = img.convert("RGB")
            img.save(
                out_path,
                format="JPEG",
                quality=68,
                optimize=True,
                progressive=True,
                subsampling="4:2:0",
            )
            return True
        except Exception:
            return False

    def _save_png(self, img: Image.Image, out_path: Path) -> bool:
        try:
            out_path.parent.mkdir(parents=True, exist_ok=True)
            if img.mode not in {"RGBA", "LA", "P", "L"}:
                img = img.convert("RGBA")
            # Aggressive palette quantization for large non-photo assets.
            quantized = img.convert("P", palette=Image.Palette.ADAPTIVE, colors=256)
            quantized.save(out_path, format="PNG", optimize=True)
            return True
        except Exception:
            try:
                img.save(out_path, format="PNG", optimize=True)
                return True
            except Exception:
                return False

    def optimize_all(self) -> None:
        originals = sorted(self.originals_dir.glob("*"))
        for src in originals:
            if not src.is_file():
                continue
            if len(self.records) > 0 and len(self.records) % 100 == 0:
                print(
                    f"[optimize] processed={len(self.records)}/{len(originals)}",
                    flush=True,
                )

            rel = src.relative_to(self.output_dir)
            orig_size = src.stat().st_size
            ext = src.suffix.lower()
            variant_paths: List[Path] = []

            if ext == ".svg":
                data = src.read_bytes()
                optimized_data = self._optimize_svg_bytes(data)
                out_svg = self.optimized_dir / (src.stem + ".svg")
                out_svg.write_bytes(optimized_data)
                variant_paths.append(out_svg)
            else:
                try:
                    with Image.open(src) as im:
                        im = ImageOps.exif_transpose(im)

                        avif_out = self.optimized_dir / (src.stem + ".avif")
                        if self._save_avif(im, avif_out):
                            variant_paths.append(avif_out)

                        webp_out = self.optimized_dir / (src.stem + ".webp")
                        if self._save_webp(im, webp_out):
                            variant_paths.append(webp_out)

                        # Keep one broadly compatible fallback variant.
                        if im.mode in {"RGBA", "LA", "P"}:
                            png_out = self.optimized_dir / (src.stem + ".png")
                            if self._save_png(im, png_out):
                                variant_paths.append(png_out)
                        else:
                            jpg_out = self.optimized_dir / (src.stem + ".jpg")
                            if self._save_jpeg(im, jpg_out):
                                variant_paths.append(jpg_out)
                except UnidentifiedImageError:
                    continue
                except Exception:
                    continue

            # Include original as a candidate for best (rare cases where conversion is bigger).
            candidates = [src] + variant_paths
            best = min(candidates, key=lambda p: p.stat().st_size if p.exists() else 10**18)

            best_out = self.best_dir / best.name
            self._copy_file(best, best_out)

            best_size = best_out.stat().st_size
            ratio = ((orig_size - best_size) / orig_size * 100) if orig_size else 0.0

            self.records.append(
                {
                    "original": str(rel),
                    "original_bytes": orig_size,
                    "best": str(best_out.relative_to(self.output_dir)),
                    "best_bytes": best_size,
                    "savings_bytes": max(orig_size - best_size, 0),
                    "savings_percent": round(ratio, 2),
                }
            )


@dataclass
class DomainSummary:
    domain: str
    pages_crawled: int
    assets_crawled: int
    image_candidates: int
    downloaded_unique: int
    failed_downloads: int


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def run_for_domain(base_url: str, root_out: Path, config: CrawlConfig) -> Tuple[DomainSummary, Path]:
    parsed = urllib.parse.urlparse(base_url if base_url.startswith("http") else "https://" + base_url)
    domain_slug = parsed.netloc.replace(":", "_")
    domain_dir = root_out / domain_slug
    ensure_dir(domain_dir)

    crawler = SiteCrawler(base_url, domain_dir, config)
    crawl_result = crawler.crawl()

    downloader = Downloader(domain_dir, timeout=config.request_timeout)
    downloader.download(crawl_result.image_candidates)

    optimizer = Optimizer(domain_dir)
    optimizer.optimize_all()

    # Write per-domain mappings and logs.
    with (domain_dir / "url_to_file.json").open("w", encoding="utf-8") as f:
        json.dump(downloader.url_to_file, f, ensure_ascii=False, indent=2)

    with (domain_dir / "download_failures.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["url", "reason"])
        for url, reason in downloader.failed:
            writer.writerow([url, reason])

    with (domain_dir / "optimization_report.csv").open("w", newline="", encoding="utf-8") as f:
        fields = [
            "original",
            "original_bytes",
            "best",
            "best_bytes",
            "savings_bytes",
            "savings_percent",
        ]
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in optimizer.records:
            writer.writerow(row)

    summary = DomainSummary(
        domain=parsed.netloc,
        pages_crawled=crawl_result.pages_crawled,
        assets_crawled=crawl_result.assets_crawled,
        image_candidates=len(crawl_result.image_candidates),
        downloaded_unique=len(downloader.by_hash),
        failed_downloads=len(downloader.failed),
    )

    return summary, domain_dir


def write_global_summary(root_out: Path, summaries: List[DomainSummary]) -> None:
    global_csv = root_out / "summary.csv"
    with global_csv.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(
            [
                "domain",
                "pages_crawled",
                "assets_crawled",
                "image_candidates",
                "downloaded_unique",
                "failed_downloads",
            ]
        )
        for s in summaries:
            writer.writerow(
                [
                    s.domain,
                    s.pages_crawled,
                    s.assets_crawled,
                    s.image_candidates,
                    s.downloaded_unique,
                    s.failed_downloads,
                ]
            )


def compute_aggregate_metrics(root_out: Path) -> Dict[str, int]:
    totals = {
        "original_count": 0,
        "best_count": 0,
        "original_bytes": 0,
        "best_bytes": 0,
    }

    for domain_dir in [p for p in root_out.iterdir() if p.is_dir()]:
        originals = list((domain_dir / "originals").glob("*"))
        bests = list((domain_dir / "best").glob("*"))
        totals["original_count"] += len(originals)
        totals["best_count"] += len(bests)
        totals["original_bytes"] += sum(p.stat().st_size for p in originals if p.is_file())
        totals["best_bytes"] += sum(p.stat().st_size for p in bests if p.is_file())

    return totals


def main(argv: List[str]) -> int:
    if len(argv) < 3:
        print(
            "Usage: python3 scripts/extract_optimize_site_images.py <output_dir> <url1> [url2 ...]",
            file=sys.stderr,
        )
        return 1

    out_dir = Path(argv[1]).resolve()
    urls = argv[2:]
    ensure_dir(out_dir)

    config = CrawlConfig(
        max_pages=int(os.environ.get("IMG_CRAWL_MAX_PAGES", "900")),
        max_assets=int(os.environ.get("IMG_CRAWL_MAX_ASSETS", "1200")),
        request_timeout=int(os.environ.get("IMG_CRAWL_TIMEOUT", "25")),
        sleep_between_requests=float(os.environ.get("IMG_CRAWL_SLEEP", "0")),
    )

    summaries: List[DomainSummary] = []
    domain_dirs: List[Path] = []

    for url in urls:
        print(f"[start] {url}")
        summary, domain_dir = run_for_domain(url, out_dir, config)
        summaries.append(summary)
        domain_dirs.append(domain_dir)
        print(
            f"[done] {summary.domain} pages={summary.pages_crawled} assets={summary.assets_crawled} "
            f"candidates={summary.image_candidates} downloaded={summary.downloaded_unique} "
            f"failed={summary.failed_downloads}"
        )

    write_global_summary(out_dir, summaries)
    metrics = compute_aggregate_metrics(out_dir)

    savings = metrics["original_bytes"] - metrics["best_bytes"]
    savings_pct = (savings / metrics["original_bytes"] * 100.0) if metrics["original_bytes"] else 0.0

    readme = out_dir / "README.txt"
    with readme.open("w", encoding="utf-8") as f:
        f.write("Medvi Image Extraction + Optimization Report\n")
        f.write("==========================================\n\n")
        for s in summaries:
            f.write(
                f"- {s.domain}: pages={s.pages_crawled}, assets={s.assets_crawled}, "
                f"candidates={s.image_candidates}, downloaded_unique={s.downloaded_unique}, "
                f"failed={s.failed_downloads}\n"
            )
        f.write("\n")
        f.write(f"Total original files: {metrics['original_count']}\n")
        f.write(f"Total best files: {metrics['best_count']}\n")
        f.write(f"Original bytes: {metrics['original_bytes']}\n")
        f.write(f"Best bytes: {metrics['best_bytes']}\n")
        f.write(f"Savings bytes: {savings}\n")
        f.write(f"Savings percent: {savings_pct:.2f}%\n")

    print(f"[summary] originals={metrics['original_count']} best={metrics['best_count']}")
    print(f"[summary] bytes original={metrics['original_bytes']} best={metrics['best_bytes']} savings={savings} ({savings_pct:.2f}%)")
    print(f"[output] {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
