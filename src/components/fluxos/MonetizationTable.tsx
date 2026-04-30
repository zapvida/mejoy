'use client';

interface RowItem {
  nome: string;
  valor: string;
  desc?: string;
}

const ROWS: { categoria: string; itens: RowItem[] }[] = [
  {
    categoria: 'B2C (consumidor)',
    itens: [
      { nome: 'Pass', valor: 'R$ 49/mês', desc: 'Acesso ilimitado a triagens pagas' },
      { nome: 'Gift', valor: 'R$ 89', desc: 'Presente: Pass + Gift' },
      {
        nome: 'Produtos',
        valor: 'R$ 139 – R$ 2.700',
        desc: '11 produtos · 33 SKUs · 3 planos cada (Básico, Completo, Premium)',
      },
      {
        nome: 'Assinatura 6 meses',
        valor: 'R$ 2.382 (Sócio) · R$ 2.882 (Não-sócio)',
        desc: '6 meses suplemento + especialista + nutri + psicóloga + check-up · PIX -10% · 3x/6x/12x sem juros',
      },
    ],
  },
  {
    categoria: 'B2B (empresas)',
    itens: [
      {
        nome: 'Planos empresa',
        valor: 'Sob consulta',
        desc: 'Triagem e produtos white-label para clínicas e empresas',
      },
    ],
  },
  {
    categoria: 'Parceiros',
    itens: [
      {
        nome: 'Afiliados e clínicas',
        valor: 'Sob consulta',
        desc: 'Comissão e parcerias comerciais',
      },
    ],
  },
];

export default function MonetizationTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="min-w-[300px] w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
              Categoria
            </th>
            <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
              Valores
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) =>
            row.itens.map((item, j) => (
              <tr
                key={`${i}-${j}`}
                className="border-b border-gray-100 last:border-0 dark:border-gray-700"
              >
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {j === 0 ? row.categoria : ''}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.nome}
                  </span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                    {item.valor}
                  </span>
                  {item.desc && (
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </p>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
