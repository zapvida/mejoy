// 🔥 /src/utils/processarTriagemGeral.ts

import { Step } from '@/types/triagem';
import { differenceInYears } from 'date-fns';

export interface DadosProcessados {
  idade: number;
  imc: number;
  riscoCardiovascular: string;
  setores: Record<string, string[]>;
  insightsGerais: string[];
}

export function processarTriagemGeral(
  formData: Record<string, any>,
  steps: Step[]
): DadosProcessados {
  const insightsGerais: string[] = [];
  const setores: Record<string, string[]> = {};

  // Cálculo de IMC
  const peso = parseFloat(formData.peso || '0');
  const alturaCm = parseFloat(formData.altura || '0');
  const alturaM = alturaCm / 100;

  let imc = 0;
  if (peso > 0 && alturaM > 0) {
    imc = peso / (alturaM * alturaM);
  }

  let risco = 'Desconhecido';
  if (imc > 0) {
    if (imc < 18.5) risco = 'Baixo (Magreza)';
    else if (imc < 25) risco = 'Normal';
    else if (imc < 30) risco = 'Moderado (Sobrepeso)';
    else risco = 'Alto (Obesidade)';
  }

  if (imc > 30) {
    insightsGerais.push('IMC elevado → risco aumentado de doenças cardiovasculares.');
  }

  // Geração de insights por setor
  for (const step of steps) {
    const valor = formData[step.name];
    if (!valor) continue;

    const setor = (step as any).setor || 'Geral'; // fallback
    const label = step.label || step.name;

    if (!setores[setor]) setores[setor] = [];

    if (label.toLowerCase().includes('tabagismo') && valor === 'Sim') {
      setores[setor].push('Tabagismo presente → risco cardiovascular aumentado.');
    }

    if (label.toLowerCase().includes('pressão') && valor === 'Sim') {
      setores[setor].push('Histórico de pressão alta identificado.');
    }

    if (step.justification) {
      setores[setor].push(`${label}: ${valor} → ${step.justification}`);
    } else {
      setores[setor].push(`${label}: ${valor}`);
    }
  }

  function calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    return differenceInYears(hoje, nascimento);
  }

  function calcularIMC(pesoKg: number, alturaCm: number): number {
    const alturaM = alturaCm / 100;
    return Number((pesoKg / (alturaM * alturaM)).toFixed(1));
  }

  const idade = calcularIdade(formData.birthDate);
  const imcCalculado = calcularIMC(peso, alturaCm);

  return {
    idade,
    imc: imcCalculado,
    riscoCardiovascular: risco,
    setores,
    insightsGerais,
  };
}