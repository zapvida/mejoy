import Head from "next/head";
import RunnerLayout from "@/components/b2b/runner/RunnerLayout";
import StepCtas from "@/components/b2b/wizard/StepCtas";

export default function StepCtasPage() {
  return (
    <>
      <Head>
        <title>CTA — Personalize sua marca | MeJoy</title>
        <meta name="description" content="Configure o botão de ação principal. Preview em tempo real." />
      </Head>
      <RunnerLayout 
        title="Passo 3: Ação principal (CTA)" 
        step={2} 
        nextHref="/b2b/configurar/revisao" 
        backHref="/b2b/configurar/cores"
      >
        <StepCtas />
      </RunnerLayout>
    </>
  );
}

