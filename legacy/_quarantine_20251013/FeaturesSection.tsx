import { motion } from 'framer-motion'
import { FaHeartbeat, FaRobot, FaFileMedical } from 'react-icons/fa'

const features = [
  {
    title: 'Triagem Instantânea',
    description:
      'Receba avaliação médica com IA em segundos. Detecção precoce de riscos à saúde com precisão.',
    icon: FaRobot,
  },
  {
    title: 'Relatórios Inteligentes',
    description:
      'Visualize relatórios personalizados com recomendações claras e rastreáveis de evolução clínica.',
    icon: FaFileMedical,
  },
  {
    title: 'Cuidado Contínuo',
    description:
      'Acompanhamento digital automatizado e seguro para melhorar sua saúde ao longo do tempo.',
    icon: FaHeartbeat,
  },
]

export default function Features() {
  return (
    <section className="py-24 px-6 bg-white text-foreground">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Por que usar o Teodoc?</h2>
        <p className="text-lg text-muted-foreground mb-16">
          Descubra os benefícios de cuidar da sua saúde com tecnologia de ponta
        </p>
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-8 bg-muted rounded-3xl shadow-xl hover:shadow-2xl transition"
              >
                <div className="text-brand text-5xl mb-6">
                  <Icon />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}