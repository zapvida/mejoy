import fs from "fs";
import path from "path";

import type { GetServerSideProps } from "next";
import Head from "next/head";

import ReportPage from "./[id]";

import type { PatientProfile } from "@/lib/report/types";
import { safeJson } from "@/lib/safeObject";

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Carregar dados demo do arquivo JSON
    const demoPath = path.join(process.cwd(), "public/demo/report.json");
    const demoData = JSON.parse(fs.readFileSync(demoPath, "utf8"));
    
    // Criar reportData simples baseado nos dados demo
    const reportData = {
      scoreNow: demoData.report.scores?.current || 7.2,
      scorePotential: demoData.report.scores?.potential || 8.5,
      alertSignals: demoData.report.alerts?.map((alert: any) => alert.description) || ["Reduzir ultraprocessados nesta semana."],
      updatedAt: demoData.report.createdAt || new Date().toISOString(),
      version: "2.0",
      pillars: demoData.report.roadmap?.map((roadmap: any) => ({
        id: roadmap.id || "nutricao",
        title: roadmap.title || "Nutrição",
        quickWins: roadmap.wins?.map((win: any) => win.label) || ["Aumentar consumo de fibras"],
        weeklyGoal: roadmap.goal?.label || "Consumir 25g de fibras diariamente",
      })) || [],
      grocery: null,
      citations: null,
      topActions: ["Dormir 7–8h", "+2 porções de vegetais", "Caminhar 30 min"],
      readingTimeMin: 3,
      preventiveExams: demoData.report.exams?.map((exam: any) => ({
        name: exam.name,
        when: exam.when || "Nos próximos 30 dias",
        prep: exam.prep || "",
        why: exam.why || "",
      })) || [],
      patient: {
        idade: demoData.report.patient.age || 35,
        sexo: demoData.report.patient.sex === "male" ? "masculino" : "feminino",
        imc: demoData.report.patient.bmi || 24.5,
      },
    };
    
    const safePatient: PatientProfile = {
      id: demoData.report.patient.id || "demo-patient-123",
      name: demoData.report.patient.name || "João Silva",
      sex: demoData.report.patient.sex === "male" ? "masculino" : "feminino",
      age: demoData.report.patient.age || 35,
      birthDate: demoData.report.patient.birthDate || null,
      bmi: demoData.report.patient.bmi ? { 
        bmi: demoData.report.patient.bmi, 
        classification: "Normal" 
      } : null,
      whatsapp: demoData.report.patient.whatsapp || "",
      weightKg: demoData.report.patient.weightKg || null,
      heightCm: demoData.report.patient.heightCm || null,
    };
    
    return {
      props: safeJson({
        report: demoData.report,
        reportData,
        safePatient,
        reportId: demoData.report.id || "demo-report-123",
        shouldPrint: false,
        error: null,
      }),
    };
  } catch (error) {
    console.error("Erro ao carregar dados demo:", error);
    return {
      props: safeJson({
        report: null,
        reportData: null,
        safePatient: null,
        reportId: null,
        shouldPrint: false,
        error: "Erro ao carregar dados de demonstração",
      }),
    };
  }
};

export default function DemoReportPage(props: any) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <ReportPage {...props} />
    </>
  );
}
