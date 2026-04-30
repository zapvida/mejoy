import { motion } from "framer-motion";
import React from "react";

type Props = { 
  nome: string; 
  idade?: number | null; 
  imc?: number | null; 
  sexo?: string | null;
};

const PacienteInfoCard: React.FC<Props> = ({ nome, idade, imc, sexo }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full rounded-xl border border-border bg-gradient-to-br from-background to-background backdrop-blur-md p-8 shadow-green-lg"
  >
    <motion.h3
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-6 flex items-center gap-3 text-2xl font-bold text-brand"
    >
      <span className="text-3xl animate-float">🩺</span>
      Resumo do Paciente
    </motion.h3>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {[
        { 
          label: "Nome", 
          value: nome || "Não informado", 
          icon: "👤", 
          color: "from-background to-muted",
          textColor: "text-white"
        },
        { 
          label: "Idade", 
          value: idade ? `${idade} anos` : "Não informada", 
          icon: "🎂", 
          color: "from-background to-muted",
          textColor: "text-white"
        },
        { 
          label: "IMC", 
          value: imc ? `${imc} kg/m²` : "Não informado", 
          icon: "⚖️", 
          color: "from-brand to-brand",
          textColor: "text-white"
        },
        { 
          label: "Sexo", 
          value: sexo || "Não informado", 
          icon: "👥", 
          color: "from-background to-muted",
          textColor: "text-white"
        },
      ].map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`rounded-xl bg-gradient-to-br ${item.color} backdrop-blur-sm p-6 border border-border hover:border-brand/30 transition-all duration-300 hover:shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl animate-pulse-slow">{item.icon}</span>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{item.label}</p>
          </div>
          <p className={`text-xl font-bold ${item.textColor}`}>{item.value}</p>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

export default PacienteInfoCard;
