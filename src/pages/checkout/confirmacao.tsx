import { useRouter } from 'next/router';

import { Button } from '@/components/ui/buttons';
import { BottomMenu } from '@/components/ui/navigation';

export default function ConfirmacaoPage() {
  const router = useRouter();

  const handlePagamento = () => {
    router.push('/checkout/sucesso');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 p-6">
        <div className="max-w-xl mx-auto bg-background rounded-xl p-6 shadow-md">
          <h1 className="text-2xl font-bold text-white mb-4">Confirmação do Pedido</h1>
          <p className="text-muted-foreground mb-6">
            Verifique se os dados estão corretos antes de gerar seu pagamento.
          </p>

          {/* Dados do pedido (exemplo, pode ser dinâmico depois) */}
          <div className="bg-background p-4 rounded-lg mb-6">
            <p className="text-muted-foreground">
              Plano: <span className="font-semibold">Premium Mensal</span>
            </p>
            <p className="text-muted-foreground">
              Valor: <span className="font-semibold">R$ 49,90</span>
            </p>
          </div>

          <Button
            onClick={handlePagamento}
            className="w-full"
          >
            Confirmar e Pagar
          </Button>
        </div>
      </main>
      <BottomMenu />
    </div>
  );
}