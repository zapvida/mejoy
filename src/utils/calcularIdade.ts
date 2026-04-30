export const calcularIdade = (data: string | undefined): string => {
  if (!data) return 'Não informado';
  const [dia, mes, ano] = data.split('/');
  const nascimento = new Date(`${ano}-${mes}-${dia}`);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return `${idade} `;
};