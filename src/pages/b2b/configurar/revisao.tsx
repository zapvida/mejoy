import Head from "next/head";
import RunnerLayout from "@/components/b2b/runner/RunnerLayout";
import StepDomainReview from "@/components/b2b/wizard/StepDomainReview";

export default function StepReviewPage() {
  return (
    <>
      <Head>
        <title>Revisão — Personalize sua marca | MeJoy</title>
        <meta name="description" content="Revise suas configurações e salve. Abra o demo em tela cheia." />
      </Head>
      <RunnerLayout 
        title="Passo 4: Domínio & Revisão" 
        step={3} 
        backHref="/b2b/configurar/cta"
      >
        <StepDomainReview />
      </RunnerLayout>
    </>
  );
}

