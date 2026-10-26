'use client';

import React from 'react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZES_DATA = [
  { size: 'XS', chest: '88 - 93', length: '67', shoulder: '42', morpho: '1m60 - 1m70 (50-60 kg)' },
  { size: 'S', chest: '94 - 99', length: '69', shoulder: '44', morpho: '1m68 - 1m75 (60-70 kg)' },
  { size: 'M', chest: '100 - 105', length: '71', shoulder: '46', morpho: '1m74 - 1m82 (70-80 kg)', highlight: true },
  { size: 'L', chest: '106 - 111', length: '73', shoulder: '48', morpho: '1m80 - 1m88 (80-90 kg)' },
  { size: 'XL', chest: '112 - 118', length: '75', shoulder: '50', morpho: '1m85 - 1m92 (90-100 kg)' },
  { size: 'XXL', chest: '119 - 125', length: '77', shoulder: '52', morpho: '1m88+ (100 kg+)' },
];

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl border-2 border-ink bg-paper p-4 sm:p-8 shadow-[6px_6px_0_0_var(--color-ink)] sm:shadow-[10px_10px_0_0_var(--color-ink)] animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le guide des tailles"
          className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-ink/20 text-ink hover:bg-canvas transition-colors text-xs sm:text-base"
        >
          ✕
        </button>

        {/* Header */}
        <div className="eyebrow mb-2 text-[0.65rem] sm:text-[0.72rem] py-1 px-3">GUIDE TECHNIQUE</div>
        <h2 className="font-display text-xl sm:text-3xl font-extrabold text-ink uppercase tracking-tight pr-8 sm:pr-0">
          Guide des Tailles — Coupe Ajustée
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
          Nos t-shirts en pur coton mercerisé sont conçus avec une coupe ajustée athlétique (Tailored Fit) : col rond structuré au ras du cou et manches courtes épousant les biceps. Choisissez votre taille habituelle pour un tombé ajusté, ou une taille au-dessus pour un porté plus décontracté.
        </p>

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/15 bg-canvas/40">
          <table className="w-full text-left text-xs sm:text-sm font-sans">
            <thead>
              <tr className="border-b border-ink/10 bg-canvas font-mono text-[0.72rem] font-bold uppercase tracking-wider text-ink">
                <th className="py-3 px-3 sm:px-4">Taille</th>
                <th className="py-3 px-3 sm:px-4">Poitrine (cm)</th>
                <th className="py-3 px-3 sm:px-4">Longueur (cm)</th>
                <th className="py-3 px-3 sm:px-4">Épaules (cm)</th>
                <th className="py-3 px-3 sm:px-4">Morphologie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {SIZES_DATA.map((row) => (
                <tr
                  key={row.size}
                  className={row.highlight ? 'bg-acid/25 font-semibold text-ink' : 'text-ink/90'}
                >
                  <td className="py-2.5 px-3 sm:px-4 font-mono font-bold text-coral">
                    {row.size}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">{row.chest}</td>
                  <td className="py-2.5 px-3 sm:px-4">{row.length}</td>
                  <td className="py-2.5 px-3 sm:px-4">{row.shoulder}</td>
                  <td className="py-2.5 px-3 sm:px-4 text-xs">{row.morpho}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips Box */}
        <div className="mt-6 rounded-xl border-l-4 border-coral bg-canvas p-4 text-xs text-muted leading-relaxed">
          <strong className="text-ink font-semibold">Conseil d&apos;entretien momoShop :</strong> Le coton peigné mercerisé conserve son éclat soyeux et la tenue nette de son col lavage après lavage à 30°C. Ne pas repasser à trop haute température.
        </div>
      </div>
    </div>
  );
}
