'use client';

/**
 * Embed de vídeo YouTube no PDP.
 * Espelha o OficialFarma.
 */

interface PdpVideoEmbedProps {
  videoUrl: string;
  className?: string;
}

function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function PdpVideoEmbed({ videoUrl, className = '' }: PdpVideoEmbedProps) {
  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) return null;

  return (
    <div className={`rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${className}`}>
      <div className="aspect-video bg-gray-100">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Vídeo sobre o produto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
