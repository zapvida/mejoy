import { XCircle } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'

import { Button } from '@/components/ui/buttons';

export default function CheckoutCancelPage() {
  return (
    <>
      <Head>
        <title>Pagamento Cancelado | Me Joy</title>
        <meta
          name="description"
          content="Seu pagamento foi cancelado. Você pode tentar novamente a qualquer momento."
        />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Pagamento Cancelado
        </h1>
        <p className="text-gray-600 text-lg max-w-md mb-6">
          Seu pagamento foi cancelado. Não se preocupe, você pode tentar novamente a qualquer momento.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/pricing">
            <Button className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-base">
              Tentar Novamente
            </Button>
          </Link>
          <Link href="/">
            <Button className="px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg text-base">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
