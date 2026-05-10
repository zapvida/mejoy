import Image from 'next/image';
import { EMAGRECIMENTO_SPECIALIST_ASSETS } from '@/lib/emagrecimento-lp-assets';

export function MedicalCouncilSection() {
  const leaders = EMAGRECIMENTO_SPECIALIST_ASSETS.councilCards;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 text-white">
            Conselho Médico MeJoy
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto px-2">
            Liderança médica comprometida com segurança e excelência
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {leaders.map((leader, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="text-center mb-6">
                <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-white/30">
                  <Image
                    src={leader.photo}
                    alt={leader.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {leader.title}
                </h3>
                <p className="text-base font-semibold text-emerald-100 mb-1">{leader.subtitle}</p>
              </div>
              <div className="border-t border-white/20 pt-6">
                <p className="text-sm sm:text-base text-emerald-100 leading-relaxed italic text-center">
                  "{leader.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border-2 border-white/20 max-w-4xl mx-auto">
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed text-center">
            <strong className="text-white">Nossa missão:</strong> Organizar triagem, relatorio, avaliacao humana, continuidade e suporte oficial em um fluxo mais claro, seguro e responsavel para o paciente brasileiro.
          </p>
        </div>
      </div>
    </section>
  );
}
