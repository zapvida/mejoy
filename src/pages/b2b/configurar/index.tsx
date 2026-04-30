import Head from "next/head";
import { useEffect } from "react";
import RunnerLayout from "@/components/b2b/runner/RunnerLayout";
import StepLogoName from "@/components/b2b/wizard/StepLogoName";
import { track } from "@/lib/analytics";

export default function StepLogoNamePage() {
  useEffect(() => {
    track("runner_start", { step: 1, section: "wizard" });
  }, []);

  return (
    <>
      <Head>
        <title>Logo & Nome — Personalize sua marca | Me Joy</title>
        <meta name="description" content="Configure o logo e nome da sua clínica. Veja o preview em tempo real." />
      </Head>
      <RunnerLayout 
        title="Passo 1: Logo & Nome da clínica" 
        step={0} 
        nextHref="/b2b/configurar/cores" 
        backHref={null}
      >
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-4">
            Em 4 passos simples você terá sua landing branca, com sua identidade, pronta para rodar campanhas.
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Preview ao vivo</li>
            <li>Nenhuma equipe técnica necessária</li>
            <li>Pode editar depois</li>
          </ul>
        </div>
        <StepLogoName />
      </RunnerLayout>
    </>
  );
}

