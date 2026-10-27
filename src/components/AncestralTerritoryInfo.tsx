import React from 'react';
import { CULTURAL_LORE } from '../data/sikuaniData';
import { sound } from '../services/sound';
import { Compass, MapPin, Feather, Heart, TreePine, Droplet } from 'lucide-react';

interface Props {
  onClose?: () => void;
}

export const AncestralTerritoryInfo: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="flex flex-col gap-3 p-3 max-w-md mx-auto bg-[#0a0518] border-4 border-[#5be37d] pixel-corners text-xs">
      {/* Header */}
      <div className="bg-[#122818] p-2 border-2 border-[#ffd23f] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="text-[#5be37d]" size={16} />
          <span className="text-[#ffd23f] font-bold text-xs">TERRITORIO ANCESTRAL SIKUANI</span>
        </div>
        {onClose && (
          <button
            onClick={() => {
              sound.btnClick();
              onClose();
            }}
            className="px-2 py-0.5 bg-[#ff4d6d] text-white text-[8px] pixel-corners"
          >
            ✕
          </button>
        )}
      </div>

      {/* Hero Visual Card */}
      <div className="bg-gradient-to-b from-[#1b2b1a] to-[#0d160f] p-3 border-2 border-[#2e7d32] flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/WhatsApp_Image_2026-10-26_at_11.33.22_PM_dc357c09.jpeg"
            alt="Conuco Vivo Logo"
            className="w-16 h-16 object-contain bg-white/10 p-1 border border-[#ffd23f] pixel-corners shrink-0"
          />
          <div>
            <h4 className="text-[#ffd23f] font-bold text-[11px]">PUEBLO SIKUANI (KIVE)</h4>
            <span className="text-[#5be37d] text-[9px] block">
              Vichada, Guainía, Meta, Casanare y Arauca
            </span>
            <span className="text-gray-300 text-[8px] block mt-0.5">
              Familia Lingüística Guahibana · Cuenca del Orinoco
            </span>
          </div>
        </div>

        <p className="text-[8px] text-gray-200 leading-relaxed mt-1">
          {CULTURAL_LORE.introduction}
        </p>
      </div>

      {/* Territory Key Pillars */}
      <div className="grid grid-cols-2 gap-2 text-[8px]">
        {/* El Conuco Vivo */}
        <div className="bg-[#140e28] p-2 border border-[#ffd23f]/50 flex flex-col gap-1">
          <span className="text-[#ffd23f] font-bold flex items-center gap-1">
            <TreePine size={12} className="text-[#5be37d]" /> PABI (EL CONUCO)
          </span>
          <p className="text-gray-300 leading-tight">
            Es un policultivo agroecológico donde conviven la yuca amarga, el maíz, el plátano y plantas medicinales, sin agroquímicos y rotando las parcelas.
          </p>
        </div>

        {/* Los Ríos Sagrados */}
        <div className="bg-[#140e28] p-2 border border-[#4cc9f0]/50 flex flex-col gap-1">
          <span className="text-[#4cc9f0] font-bold flex items-center gap-1">
            <Droplet size={12} /> MENE & MERA (AGUAS)
          </span>
          <p className="text-gray-300 leading-tight">
            Los ríos Vichada, Meta y Orinoco son caminos vivos de transporte y pesca ancestral con cacures (trampas) y flechas.
          </p>
        </div>

        {/* Los Clanes Momowi */}
        <div className="bg-[#140e28] p-2 border border-[#ff4d6d]/50 flex flex-col gap-1">
          <span className="text-[#ff4d6d] font-bold flex items-center gap-1">
            <Feather size={12} /> CLANES MOMOWI
          </span>
          <p className="text-gray-300 leading-tight">
            Familias descendientes de animales primordiales con pensamiento racional que enseñan a respetar a cada ser de la sabana.
          </p>
        </div>

        {/* Los Resguardos */}
        <div className="bg-[#140e28] p-2 border border-[#b388ff]/50 flex flex-col gap-1">
          <span className="text-[#b388ff] font-bold flex items-center gap-1">
            <MapPin size={12} /> CUMARIBO & TUPARRO
          </span>
          <p className="text-gray-300 leading-tight">
            Comunidades de Santa Teresita del Tuparro y Piramirí lideran la educación bilingüe propia para mantener viva la lengua materna.
          </p>
        </div>
      </div>

      {/* Law 1381 Recognition */}
      <div className="bg-[#1b1435] p-2 border-l-4 border-[#ffd23f] text-[7.5px] text-gray-300 leading-relaxed">
        <strong className="text-[#ffd23f]">Ley 1381 de 2010 (Ley de Lenguas Nativas de Colombia):</strong>{' '}
        Reconoce y ampara los derechos lingüísticos de los pueblos originarios. Enseñar en lengua materna en el conuco y la escuela fortalece la memoria viva de la nación.
      </div>
    </div>
  );
};
