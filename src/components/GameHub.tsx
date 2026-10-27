import React from 'react';
import { sound } from '../services/sound';
import { Gamepad2, Sparkles, Sprout, Eye, BookOpen, Film, ArrowRight, Star } from 'lucide-react';

export type GameKey =
  | 'sopa'
  | 'crucigrama'
  | 'ahorcado'
  | 'siluetas'
  | 'rpg'
  | 'arcade_classic'
  | 'theatre';

interface GameItem {
  id: GameKey;
  title: string;
  sikuaniName: string;
  category: string;
  desc: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  badge: string;
}

const GAMES: GameItem[] = [
  {
    id: 'sopa',
    title: 'Sopa de Letras',
    sikuaniName: 'Itane Pabi',
    category: 'Botánica y Conuco',
    desc: 'Encuentra las palabras ocultas en la cuadrícula de 8 bits.',
    icon: '🧩',
    bgColor: 'bg-[#1e1040]',
    borderColor: 'border-[#4cc9f0]',
    badge: '¡NUEVO!',
  },
  {
    id: 'crucigrama',
    title: 'Crucigrama del Conuco',
    sikuaniName: 'Tsata Liwaisi',
    category: 'Herramientas y Plantas',
    desc: 'Resuelve las pistas y escribe los términos con el teclado sikuani.',
    icon: '✏️',
    bgColor: 'bg-[#152418]',
    borderColor: 'border-[#5be37d]',
    badge: 'POPULAR',
  },
  {
    id: 'ahorcado',
    title: 'Adivina la Palabra',
    sikuaniName: 'Yapütane Jomokobi',
    category: 'Zoología y Sabana',
    desc: 'Adivina la palabra letra por letra antes de que se agoten las vidas.',
    icon: '🏹',
    bgColor: 'bg-[#2b1424]',
    borderColor: 'border-[#ff4d6d]',
    badge: 'DIVERTIDO',
  },
  {
    id: 'siluetas',
    title: 'Desafío de Siluetas',
    sikuaniName: 'Itaxuta Tsita',
    category: 'Reconocimiento de Formas',
    desc: 'Identifica la forma oscura del sprite antes de que el reloj marque cero.',
    icon: '👁️',
    bgColor: 'bg-[#2b1f10]',
    borderColor: 'border-[#ffd23f]',
    badge: 'VELOZ',
  },
  {
    id: 'rpg',
    title: 'Simulador Conuco RPG',
    sikuaniName: 'Pabi Uba RPG',
    category: 'Ciclos de Cosecha',
    desc: 'Limpia la tierra, siembra maíz y procesa yuca en el sebucán tradicional.',
    icon: '🌾',
    bgColor: 'bg-[#14261d]',
    borderColor: 'border-[#5be37d]',
    badge: 'ESTRATEGIA',
  },
  {
    id: 'arcade_classic',
    title: 'Arcade Conuco Vivo (7 en 1)',
    sikuaniName: 'Kaliawiri Arcade',
    category: 'Clásicos de Acción',
    desc: 'Gusanos, maleza, cartas de memoria, lluvia de agua y laberinto.',
    icon: '🕹️',
    bgColor: 'bg-[#241038]',
    borderColor: 'border-[#b388ff]',
    badge: '7 JUEGOS',
  },
  {
    id: 'theatre',
    title: 'Teatro Pixelart',
    sikuaniName: 'Kaliawirinae Liwaisi',
    category: 'Relatos y Memoria',
    desc: 'Historias animadas sobre el origen del conuco y los pueblos de Vichada.',
    icon: '🎬',
    bgColor: 'bg-[#141d3b]',
    borderColor: 'border-[#4cc9f0]',
    badge: 'HISTORIAS',
  },
];

interface Props {
  onSelectGame: (gameKey: GameKey) => void;
}

export const GameHub: React.FC<Props> = ({ onSelectGame }) => {
  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto text-xs pb-8">
      {/* Header */}
      <div className="bg-[#180e35] p-3 rounded-2xl border-2 border-[#ff4d6d] flex items-center justify-between">
        <div>
          <span className="text-[#ffd23f] font-bold text-sm block">SALA DE JUEGOS</span>
          <span className="text-[#5be37d] text-[8px]">Selecciona tu minijuego favorito</span>
        </div>
        <span className="text-2xl">🎮</span>
      </div>

      {/* Game Cards List */}
      <div className="flex flex-col gap-2.5">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => {
              sound.btnClick();
              onSelectGame(game.id);
            }}
            className={`${game.bgColor} border-2 ${game.borderColor} p-3 rounded-2xl flex items-center justify-between text-left transition-all active:scale-95 hover:brightness-110 shadow-lg group`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-black/40 rounded-2xl border border-white/20">
                {game.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ffd23f] font-bold text-[10px]">
                    {game.title}
                  </span>
                  <span className="bg-[#ff4d6d] text-white text-[6px] px-1.5 py-0.5 rounded-full font-bold">
                    {game.badge}
                  </span>
                </div>
                <span className="text-[#4cc9f0] text-[8px] block font-bold">
                  {game.sikuaniName}
                </span>
                <span className="text-gray-300 text-[7px] block leading-tight mt-0.5">
                  {game.desc}
                </span>
              </div>
            </div>

            <div className="p-2 bg-black/30 rounded-xl group-hover:bg-[#ffd23f] group-hover:text-black transition-colors">
              <ArrowRight size={14} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
