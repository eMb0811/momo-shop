import React from 'react';

const TAGS = [
  '★ COL ROND STRUCTURÉ AU RAS DU COU',
  '• COUPE AJUSTÉE TAILORED FIT',
  '★ 100% COTON MERCERISÉ LISSE',
  '• MANCHES AJUSTÉES AUX BICEPS',
  '★ + DE 20 NUANCES VIBRANTES DISPONIBLES',
  '• COTON PEIGNÉ HAUT DE GAMME',
  '★ COMMANDE DIRECTE WHATSAPP',
];

export function KineticMarquee() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y-2 border-ink bg-acid py-3 font-mono text-xs sm:text-sm font-black tracking-widest text-ink uppercase select-none"
    >
      <div className="flex w-max animate-marquee">
        <div className="flex shrink-0 items-center gap-8 px-4">
          {TAGS.map((tag, idx) => (
            <span key={idx} className="whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-8 px-4">
          {TAGS.map((tag, idx) => (
            <span key={`clone-${idx}`} className="whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
