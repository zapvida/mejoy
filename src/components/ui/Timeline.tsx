type Evento = {
  data: string;
  descricao: string;
};

type TimelineProps = {
  eventos: Evento[];
};

export default function Timeline({ eventos }: TimelineProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">🕑 Linha do Tempo</h2>
      <ol className="relative border-l border-brand">
        {eventos.map((evento, idx) => (
          <li key={idx} className="mb-10 ml-6">
            <div className="absolute w-4 h-4 bg-brand rounded-full -left-2 border-2 border-white"></div>
            <time className="block mb-2 text-sm md:text-base text-brand">
              {new Date(evento.data).toLocaleString('pt-BR')}
            </time>
            <p className="text-base md:text-lg font-medium text-white">{evento.descricao}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}