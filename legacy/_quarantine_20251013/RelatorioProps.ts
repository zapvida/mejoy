export interface RelatorioProps {
  relatorio: {
    planoDeAcao: string[];
    consideracoesFinais: string;
    vitaminasENutrientes: string[];
    examesCheckup: string[];
    linhaDoTempo: {
      data: string;
      descricao: string;
    }[];
  };
  paciente: {
    nome: string;
    idade: number;
    cpf: string;
  };
}