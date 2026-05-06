import Head from "next/head";
import RunnerLayout from "@/components/b2b/runner/RunnerLayout";
import StepColors from "@/components/b2b/wizard/StepColors";

export default function StepColorsPage() {
  return (
    <>
      <Head>
        <title>Cores — Personalize sua marca | MeJoy</title>
        <meta name="description" content="Escolha as cores da sua marca. Preview em tempo real." />
      </Head>
      <RunnerLayout 
        title="Passo 2: Cores da marca" 
        step={1} 
        nextHref="/b2b/configurar/cta" 
        backHref="/b2b/configurar"
      >
        <StepColors />
      </RunnerLayout>
    </>
  );
}

