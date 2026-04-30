import type { DurationAnswer } from "@/lib/format/duration";
import { toMonths } from "@/lib/format/duration";

export type SuplementoDigestivo = "nao" | "zapfarm" | "outro";
export type AcompanhamentoMedico = "nunca" | "eventual" | "regular";
export type JanelaConsultaGastro = "nunca" | "menos6m" | "6a12m" | "1a2a" | "mais2a";
export type EndoscopiaFeita = "nunca" | "sim";
export type EndoscopiaUltima = "menos6m" | "6a12m" | "1a3a" | "mais3a";
export type IbpFrequencia = "diario" | "3a5x_sem" | "1a2x_sem" | "eventual";

export type MedicamentoKey =
  | "ibp" | "h2" | "antiacidos" | "aine" | "atb_3m" | "procineticos" | "antiespasmodicos" | "outros" | "nenhum";

export type TriageGIAnswers = {
  slug?: string;
  suplemento_digestivo?: SuplementoDigestivo;
  suplemento_digestivo_outro?: string;
  acompanhamento_medico?: AcompanhamentoMedico;
  ultima_consulta_gastro?: JanelaConsultaGastro;
  endoscopia_feita?: EndoscopiaFeita;
  endoscopia_quantas?: number;
  endoscopia_ultima?: EndoscopiaUltima;
  endoscopia_achados?: string;
  sintomas_duracao?: DurationAnswer;
  sintomas_duracao_meses?: number;
  medicamentos_atuais?: MedicamentoKey[];
  ibp_frequencia?: IbpFrequencia;
  bristol_value?: 1|2|3|4|5|6|7;
};

export type BrandAffinity = "zapfarm" | "educar-zapfarm" | "migrar-zapfarm";

export function deriveGI(a: TriageGIAnswers) {
  const meses = a.sintomas_duracao_meses ?? toMonths(a.sintomas_duracao);
  const sup = a.suplemento_digestivo ?? "nao";
  const usoZapFarm = sup === "zapfarm";
  const usaOutro = sup === "outro";
  const nuncaSup = sup === "nao";
  const fezEDA = (a.endoscopia_feita ?? "nunca") === "sim";
  const edaMuitas = (a.endoscopia_quantas ?? 0) >= 3;
  const consultaAntiga = ["1a2a","mais2a","nunca"].includes(a.ultima_consulta_gastro ?? "nunca");
  const meds = a.medicamentos_atuais ?? [];
  const usaIBP = meds.includes("ibp");
  const ibpDiario = usaIBP && a.ibp_frequencia === "diario";
  const brandAffinity: BrandAffinity = usoZapFarm ? "zapfarm" : (nuncaSup ? "educar-zapfarm" : "migrar-zapfarm");
  return { meses, usoZapFarm, usaOutro, nuncaSup, fezEDA, edaMuitas, consultaAntiga, usaIBP, ibpDiario, brandAffinity };
}
