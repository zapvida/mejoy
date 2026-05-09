import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

import MobileTabBar from "@/components/mobile/MobileTabBar";
import MobileTopBar from "@/components/mobile/MobileTopBar";
import { AppValueSection } from "@/components/mejoy-app/AppValueSection";
import { formularios } from "@/forms";
import { ZAPFARM_PRODUCTS } from "@/config/zapfarm/products";
import { track } from "@/lib/analytics";
import {
  getRelatedProtocols,
  SUPPORTED_PROTOCOLS,
} from "@/lib/emagrecimento/protocolCatalog";
import { buildProductAppValue } from "@/lib/mejoy-app/value";
import { getSearchSuggestions } from "@/lib/search/intelligent-search";

interface ProtocolCardViewModel {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  category: string;
  duration: string;
  rating: number;
  participants: number;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
  evidenceLevel: string;
  reviewedAtLabel: string;
  scienceVisibility: string;
  clinicalOwner: string;
  scienceSourceLine: string;
  scienceSummary: string;
}

function formatReviewedDate(value: string) {
  const [year, month, day] = value.split("-");
  const monthLabel =
    {
      "01": "jan",
      "02": "fev",
      "03": "mar",
      "04": "abr",
      "05": "mai",
      "06": "jun",
      "07": "jul",
      "08": "ago",
      "09": "set",
      "10": "out",
      "11": "nov",
      "12": "dez",
    }[month ?? ""] ?? month;

  return `${day} ${monthLabel} ${year}`;
}

export default function ProtocolosIndex() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const protocols = useMemo<ProtocolCardViewModel[]>(() => {
    return SUPPORTED_PROTOCOLS.flatMap((meta) => {
      const product = ZAPFARM_PRODUCTS[meta.slug];
      const form = formularios[meta.slug as keyof typeof formularios];

      if (!meta.supported || !product || !form) {
        return [];
      }

      return [
        {
          slug: meta.slug,
          title: meta.title || form.titulo || product.displayName,
          subtitle: meta.tagline || form.subtitulo || product.shortDescription,
          description:
            meta.summary ||
            form.descricaoDetalhada ||
            form.descricao ||
            product.description,
          badge: meta.badge,
          category: meta.category,
          duration: form.duracao || "2-3 min",
          rating: form.rating || 4.8,
          participants: form.participantes || 0,
          tags: form.tags || [],
          imageSrc: meta.imageSrc,
          imageAlt: meta.imageAlt,
          evidenceLevel: `Evidencia ${meta.science.evidenceLevel}`,
          reviewedAtLabel: formatReviewedDate(meta.science.reviewedAt),
          scienceVisibility:
            meta.science.visibility === "patient-safe"
              ? "Seguro para paciente"
              : "Uso clinico",
          clinicalOwner: meta.science.clinicalOwner,
          scienceSourceLine: meta.science.sourceLine,
          scienceSummary: meta.science.scienceSummary,
        },
      ];
    });
  }, []);

  const filteredProtocols = useMemo(() => {
    if (!searchTerm.trim()) return protocols;

    const lowered = searchTerm.toLowerCase();
    return protocols.filter((protocol) =>
      [
        protocol.title,
        protocol.subtitle,
        protocol.description,
        protocol.badge,
        protocol.category,
        ...protocol.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(lowered),
    );
  }, [protocols, searchTerm]);

  const featuredProtocols = useMemo(
    () => getRelatedProtocols("emagrecimento", 4),
    [],
  );
  const appValue = useMemo(
    () =>
      buildProductAppValue({
        productSlug: "emagrecimento",
        productName: "Protocolos MeJoy",
      }),
    [],
  );

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const suggestions = getSearchSuggestions(searchTerm).slice(0, 6);
    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  }, [searchTerm]);

  const handleProtocolClick = (slug: string) => {
    track("protocolo_start", { protocolo: slug, surface: "protocolos_hub" });
    router.push(`/triagem/${slug}`);
  };

  const handleSearchFocus = () => {
    if (searchSuggestions.length > 0) setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    window.setTimeout(() => setShowSuggestions(false), 120);
  };

  return (
    <>
      <Head>
        <title>Protocolos de Saúde | MeJoy</title>
        <meta
          name="description"
          content="Hub premium de protocolos MeJoy com entrada clara para triagem, acompanhamento médico e saúde integral."
        />
      </Head>

      <MobileTopBar title="Protocolos" />
      <MobileTabBar />

      <main
        className="min-h-screen bg-[#faf7f1] pb-[calc(64px+env(safe-area-inset-bottom))] pt-20 text-slate-900 md:pb-0 md:pt-0"
        data-testid="page-protocolos"
      >
        <div className="hidden px-4 py-4 md:block">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-full border border-[#dde5d7] bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-[#f7faf6]"
            >
              Voltar ao início
            </button>
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
              Protocolos ativos MeJoy
            </div>
          </div>
        </div>

        <section className="px-4 pb-8 pt-2 sm:px-6 lg:pb-10">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4b6b50]">
                Hub premium de saúde integral
              </p>
              <h1 className="mt-4 max-w-3xl text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.06em] text-slate-900 sm:text-[3.3rem]">
                O melhor protocolo é o que faz sentido para o seu momento, sem
                fricção para começar.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Este hub organiza os protocolos realmente suportados pela MeJoy,
                com entrada clara para triagem, acompanhamento, continuidade e
                saúde integral.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { value: `${protocols.length}`, label: "protocolos ativos" },
                  { value: "1 triagem", label: "para começar com contexto" },
                  { value: "1 painel", label: "para acompanhar tudo depois" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-[#dbe4d7] bg-white px-4 py-4 shadow-[0_14px_35px_rgba(15,23,42,0.04)]"
                  >
                    <p className="text-lg font-semibold tracking-[-0.03em] text-slate-900">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                {[
                  "Mais imagem, menos ruído",
                  "Elegibilidade e próxima ação claras",
                  "Suporte e continuidade no mesmo ecossistema",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#d8ddd5] bg-white px-4 py-2 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-[28px] border border-[#dbe4d7] bg-white/90 px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                  Camada de ciencia
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Todo protocolo ativo aqui foi revisado por time clinico, com
                  linguagem publica segura, fontes permitidas e atualizacao
                  editorial continua.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  {[
                    "CFM, WHO e sociedades clinicas",
                    "Revisao humana obrigatoria",
                    "Sem promessas milagrosas",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#d8ddd5] bg-[#f7faf6] px-3 py-1"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-[30px] border border-white bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
                  <div className="relative aspect-[0.86] overflow-hidden rounded-[22px]">
                    <Image
                      src="/images/emagrecimento/medvi/hero-main.webp"
                      alt="Jornada MeJoy"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 18vw"
                      priority
                    />
                  </div>
                </div>
                <div className="overflow-hidden rounded-[30px] border border-white bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
                  <div className="relative aspect-[1.05] overflow-hidden rounded-[22px]">
                    <Image
                      src="/images/emagrecimento/medvi/journey-acompanhamento.avif"
                      alt="Cuidado contínuo MeJoy"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 18vw"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  {featuredProtocols.slice(0, 2).map((item) => (
                    <div
                      key={item.slug}
                      className="overflow-hidden rounded-[30px] border border-white bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.07)]"
                    >
                      <div className="relative aspect-[0.94] overflow-hidden rounded-[22px]">
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 50vw, 16vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[32px] border border-[#dbe4d7] bg-[linear-gradient(180deg,#ffffff_0%,#f3f7f0_100%)] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                    Como usar este hub
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                    Escolha o tema principal e entre pela triagem certa.
                  </p>
                  <div className="mt-5 space-y-3">
                    {[
                      "Cada protocolo mostra proposta, foco clínico e entrada direta.",
                      "Você só vê protocolos que já têm operação e jornada suportadas.",
                      "Depois da compra, o cuidado continua no mesmo dashboard.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-[20px] border border-[#e3e7df] bg-white px-4 py-3 text-sm text-slate-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <AppValueSection
              value={appValue}
              surface="protocols"
              compact
              title="Cada protocolo MeJoy tambem libera o App MeJoy Premium"
            />
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-[32px] border border-[#dde5d7] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                  Buscar protocolo
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                  Menos fricção para encontrar o cuidado certo
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Pesquise por sintomas, metas ou áreas da saúde. O hub cruza
                  intenção com os protocolos já prontos para operar.
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por sono, peso, intestino, ansiedade..."
                  className="w-full rounded-[22px] border border-[#d8dfd5] bg-[#fafbf8] px-5 py-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2f6a49] focus:ring-4 focus:ring-[#e5efe4]"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  aria-label="Buscar protocolos"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 hover:text-slate-700"
                    aria-label="Limpar busca"
                  >
                    Limpar
                  </button>
                )}

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-[22px] border border-[#dde5d7] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchTerm(suggestion);
                          setShowSuggestions(false);
                        }}
                        className="w-full border-b border-[#edf2ea] px-4 py-3 text-left text-sm text-slate-700 transition last:border-b-0 hover:bg-[#f7faf6]"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
            {[
              {
                title: "Escolha guiada",
                body: "Cada card deixa claro o foco do protocolo e a entrada correta para começar com menos dúvida.",
              },
              {
                title: "Prova de continuidade",
                body: "O protocolo não termina na compra. O dashboard organiza o que acontece depois com suporte e acompanhamento.",
              },
              {
                title: "Saúde integral",
                body: "Protocolos vizinhos ficam conectados para aumentar retenção e aprofundar cuidado ao longo do tempo.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-[#dde5d7] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
              >
                <p className="text-lg font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                  Protocolos disponíveis
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                  Escolha o protocolo que mais se parece com a sua necessidade
                  agora
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {filteredProtocols.length} protocolo(s) encontrados
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProtocols.map((protocol, index) => (
                <motion.article
                  key={protocol.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className="overflow-hidden rounded-[30px] border border-[#dde5d7] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
                >
                  <div className="relative aspect-[1.08] overflow-hidden">
                    <Image
                      src={protocol.imageSrc}
                      alt={protocol.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 30vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                    <div className="absolute left-4 top-4 inline-flex rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800">
                      {protocol.badge}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-flex rounded-full border border-white/35 bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
                        {protocol.category}
                      </span>
                      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                        {protocol.title}
                      </p>
                      <p className="mt-2 max-w-[28rem] text-sm leading-relaxed text-white/90">
                        {protocol.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                        {protocol.duration}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                        {protocol.rating.toFixed(1)} de avaliação
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                        {protocol.participants > 0
                          ? `+${protocol.participants} participantes`
                          : "Acompanhamento oficial"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {protocol.description}
                    </p>

                    <div className="mt-4 rounded-[22px] border border-[#e4eadf] bg-[#f8fbf6] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                        Base clinica revisada
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                        <span className="rounded-full border border-[#d6dfd1] bg-white px-3 py-1">
                          {protocol.evidenceLevel}
                        </span>
                        <span className="rounded-full border border-[#d6dfd1] bg-white px-3 py-1">
                          Revisado em {protocol.reviewedAtLabel}
                        </span>
                        <span className="rounded-full border border-[#d6dfd1] bg-white px-3 py-1">
                          {protocol.scienceVisibility}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {protocol.scienceSummary}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">
                        {protocol.clinicalOwner} • {protocol.scienceSourceLine}
                      </p>
                    </div>

                    {protocol.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {protocol.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#f4f7f3] px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 grid gap-3">
                      <button
                        onClick={() => handleProtocolClick(protocol.slug)}
                        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2f6a49] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(47,106,73,0.18)] transition hover:bg-[#25563b]"
                        data-testid={`btn-protocolo-start-${protocol.slug}`}
                      >
                        Iniciar triagem deste protocolo
                      </button>
                      <button
                        onClick={() => handleProtocolClick(protocol.slug)}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dde5d7] bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#f7faf6]"
                        data-testid={`protocolo-card-${protocol.slug}`}
                      >
                        Ver foco clínico e elegibilidade
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-[30px] border border-[#dde5d7] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4b6b50]">
                  Segurança e confiança
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                  Só permanece ativo aqui o que a MeJoy consegue operar com
                  clareza.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Triagem, relatório, pagamento, suporte e continuidade precisam
                  conversar entre si. É isso que transforma um protocolo em
                  experiência robusta.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "Dados protegidos e jornada rastreável.",
                  "Entrada clínica organizada antes do fechamento.",
                  "Painel único para compra, suporte e próximos passos.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-[#e3e7df] bg-[#fafbf8] px-4 py-4 text-sm text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
