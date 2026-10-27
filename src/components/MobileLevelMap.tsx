import React from 'react';
import { sound } from '../services/sound';
import { Star, Lock, CheckCircle2, Sparkles, Trophy, Award, Play } from 'lucide-react';

export interface LevelNode {
  id: number;
  sikuaniTitle: string;
  spanishTitle: string;
  gameType: 'sopa' | 'crucigrama' | 'ahorcado' | 'siluetas' | 'rpg' | 'laberinto';
  minStarsToUnlock: number;
  starsEarned: number;
  icon: string;
  themeColor: string;
  description: string;
}

interface Props {
  levels: LevelNode[];
  onSelectLevel: (level: LevelNode) => void;
  totalStars: number;
}

export const MobileLevelMap: React.FC<Props> = ({ levels, onSelectLevel, totalStars }) => {
  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-xs pb-10">
      {/* Map Header Status */}
      <div className="w-full bg-[#180e35] p-3 rounded-2xl border-2 border-[#ffd23f] flex items-center justify-between mb-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Trophy className="text-[#ffd23f]" size={18} />
          <div>
            <span className="text-[#ffd23f] font-bold text-[10px] block">CAMINO DEL CONUCO</span>
            <span className="text-[#5be37d] text-[8px]">Ruta de aprendizaje Sikuani</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0b0518] px-2.5 py-1 rounded-xl border border-[#ffd23f]/60">
          <Star className="text-[#ffd23f]" size={14} fill="#ffd23f" />
          <span className="text-[#ffd23f] font-bold text-[10px]">{totalStars} ★</span>
        </div>
      </div>

      {/* Vertical Winding Path with Leaves (Ojitas) */}
      <div className="relative w-full flex flex-col items-center gap-6 py-2">
        {levels.map((lvl, index) => {
          const isUnlocked = totalStars >= lvl.minStarsToUnlock;
          // Zigzag horizontal alignment (-35px, 0px, 35px, etc.)
          const offsets = [0, 40, 20, -40, -20, 30, 0];
          const xOffset = offsets[index % offsets.length];

          return (
            <React.Fragment key={lvl.id}>
              {/* Connecting Leafy Vine Trail between nodes */}
              {index > 0 && (
                <div className="flex flex-col items-center -my-2.5 z-0">
                  <div className="w-2.5 h-6 bg-gradient-to-b from-[#2e7d32] to-[#43a047] rounded-full relative">
                    {/* Decorative Leaves (Ojitas) on the connecting path */}
                    <span className="absolute -left-3 top-0 text-xs">🍃</span>
                    <span className="absolute -right-3 bottom-0 text-xs transform scale-x-[-1]">🌿</span>
                  </div>
                </div>
              )}

              {/* Level Node Button */}
              <div
                style={{ transform: `translateX(${xOffset}px)` }}
                className="relative z-10 flex flex-col items-center transition-transform"
              >
                <button
                  onClick={() => {
                    if (isUnlocked) {
                      sound.btnClick();
                      onSelectLevel(lvl);
                    } else {
                      sound.hurt();
                    }
                  }}
                  className={`w-20 h-20 rounded-3xl border-4 flex flex-col items-center justify-center p-1 relative shadow-2xl transition-all duration-150 active:scale-90 ${
                    isUnlocked
                      ? 'border-[#ffffff] cursor-pointer hover:scale-105 ring-4 ring-[#ffd23f]/50'
                      : 'border-gray-700 bg-[#120826] opacity-60 cursor-not-allowed'
                  }`}
                  style={isUnlocked ? { backgroundColor: lvl.themeColor } : {}}
                >
                  {/* Lock Overlay or Mascot Emoji */}
                  {isUnlocked ? (
                    <span className="text-2xl drop-shadow-md">{lvl.icon}</span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Lock size={18} className="text-gray-400 mb-0.5" />
                      <span className="text-[7px] text-gray-400 font-bold">{lvl.minStarsToUnlock}★</span>
                    </div>
                  )}

                  {/* Level Number Pill */}
                  <span className="absolute -top-2 bg-[#0b0518] text-[#ffd23f] border border-[#ffd23f] px-2 py-0.5 rounded-full text-[7px] font-bold">
                    NIVEL {lvl.id}
                  </span>

                  {/* Stars Earned underneath */}
                  {isUnlocked && (
                    <div className="flex gap-0.5 mt-0.5">
                      {[0, 1, 2].map((s) => (
                        <Star
                          key={s}
                          size={9}
                          className={s < lvl.starsEarned ? 'text-[#ffd23f]' : 'text-black/40'}
                          fill={s < lvl.starsEarned ? '#ffd23f' : 'transparent'}
                        />
                      ))}
                    </div>
                  )}
                </button>

                {/* Level Title & Meaning */}
                <div className="text-center mt-1.5 max-w-[150px] px-1">
                  <span className="text-[#ffd23f] font-bold text-[8px] block leading-snug break-words">
                    {lvl.sikuaniTitle}
                  </span>
                  <span className="text-gray-300 text-[6.5px] block leading-tight mt-0.5 break-words">
                    {lvl.spanishTitle}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
