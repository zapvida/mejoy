type Evento = {
  data: string;
  descricao: string;
};

type LinhaDoTempoProps = {
  eventos: Evento[];
};

export default function LinhaDoTempo({ eventos = [] }: LinhaDoTempoProps) {
  if (!Array.isArray(eventos) || eventos.length === 0) {
    return (
      <div className="bg-black/50 backdrop-blur-md border border-brand rounded-2xl px-5 py-6 shadow-xl">
        <h2 className="text-2xl font-bold text-brand mb-3 text-center">
          🗓️ Linha do Tempo
        </h2>
        <p className="text-sm text-brand-200 text-center">
          Nenhum evento disponível.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/50 backdrop-blur-md border border-brand rounded-2xl px-5 py-6 shadow-xl">
      <h2 className="text-2xl font-bold text-brand mb-6 text-center">
        🗓️ Linha do Tempo
      </h2>
      <ul className="flex flex-col gap-5">
        {eventos.map((evento, index) => (
          <li
            key={index}
            className="relative border-l-4 border-brand pl-6 hover:bg-black/30 transition rounded-md"
          >
            <div className="absolute left-[-0.45rem] top-2 w-3 h-3 bg-brand rounded-full border border-white/20 shadow-md" />
            <time className="block text-xs text-brand-300 mb-1">
              {evento.data}
            </time>
            <p className="text-sm sm:text-base text-white leading-relaxed">
              {evento.descricao}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}