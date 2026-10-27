import React, { useState } from 'react';
import { sound } from '../services/sound';
import { DailyQuest } from '../data/sikuaniData';
import { HarvestInventory } from './HarvestRpgGame';
import { User, Award, CheckCircle, Star, Edit3, Shield, Package } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  playerName: string;
  onUpdateName: (newName: string) => void;
  playerXp: number;
  playerLevel: number;
  avatarId: string;
  onUpdateAvatar: (newAvatar: string) => void;
  quests: DailyQuest[];
  onClaimQuest: (questId: string) => void;
  inventory: HarvestInventory;
  arcadeStars: number;
}

const AVATARS = [
  { id: 'farmer_boy', emoji: '👦🏾', name: 'Penakueto (Niño Sikuani)' },
  { id: 'farmer_girl', emoji: '👧🏾', name: 'Penakueta (Niña Sikuani)' },
  { id: 'wise_elder', emoji: '👵🏾', name: 'Akue (Sabedora Tradicional)' },
  { id: 'hunter', emoji: '🏹', name: 'Pebi Jina (Cazador Ribereño)' },
  { id: 'capybara', emoji: '🐾', name: 'Jomokobi (Espíritu Capibara)' },
  { id: 'jaguar', emoji: '🐆', name: 'Newütjü (Guardián del Monte)' },
];

export const PlayerProfile: React.FC<Props> = ({
  playerName,
  onUpdateName,
  playerXp,
  playerLevel,
  avatarId,
  onUpdateAvatar,
  quests,
  onClaimQuest,
  inventory,
  arcadeStars,
}) => {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  const getRankTitle = (lvl: number) => {
    if (lvl >= 5) return 'MAESTRO DEL KALIAWIRINAE';
    if (lvl === 4) return 'GUARDIÁN DEL MONTE (UNU)';
    if (lvl === 3) return 'SABEDOR DE LAS AGUAS (MERA)';
    if (lvl === 2) return 'CUIDADOR DEL CONUCO (PABI)';
    return 'SEMBRADOR NOVATO';
  };

  const handleSaveName = () => {
    sound.btnClick();
    if (tempName.trim()) {
      onUpdateName(tempName.trim());
      setEditing(false);
    }
  };

  const currentAvatar = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];
  const xpNeeded = playerLevel * 200;
  const xpProgress = Math.min(100, Math.floor((playerXp % 200) / 2));

  return (
    <div className="flex flex-col gap-3 p-3 max-w-md mx-auto bg-[#0a061c] border-4 border-[#ff9f1c] pixel-corners text-xs">
      {/* Profile Header Card */}
      <div className="bg-[#180e35] p-3 border-2 border-[#ffd23f] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar button */}
            <div className="relative">
              <span className="text-3xl p-1 bg-[#2b1854] border-2 border-[#ff4d6d] pixel-corners block">
                {currentAvatar.emoji}
              </span>
            </div>
            <div>
              {editing ? (
                <div className="flex gap-1 items-center">
                  <input
                    type="text"
                    value={tempName}
                    maxLength={16}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-[#0f0724] border border-[#ffd23f] px-1.5 py-0.5 text-white text-[10px] w-28 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-2 py-0.5 bg-[#5be37d] text-black font-bold text-[8px] pixel-corners"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#ffd23f] font-bold text-sm">{playerName}</span>
                  <button
                    onClick={() => {
                      setEditing(true);
                      sound.btnClick();
                    }}
                    className="text-[#9ad2f8] hover:text-white"
                  >
                    <Edit3 size={11} />
                  </button>
                </div>
              )}
              <span className="text-[#5be37d] text-[8px] font-bold block mt-0.5">
                {getRankTitle(playerLevel)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-[#4cc9f0] block">NIVEL {playerLevel}</span>
            <span className="text-[8px] text-[#ffd23f] flex items-center gap-0.5 justify-end">
              <Star size={10} fill="#ffd23f" /> {arcadeStars}/21 ★
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-1">
          <div className="flex justify-between text-[7px] text-[#9ad2f8] mb-0.5">
            <span>EXPERIENCIA SIKUANI</span>
            <span>{playerXp} XP (Siguiente nivel en {xpNeeded} XP)</span>
          </div>
          <div className="w-full bg-[#0a0518] h-2 border border-[#5a2a8a]">
            <div
              className="bg-gradient-to-r from-[#ffd23f] to-[#ff9f1c] h-full transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Avatar Picker */}
      <div className="bg-[#150d2e] p-2 border-2 border-[#5a2a8a]">
        <span className="text-[8px] text-[#ffd23f] font-bold block mb-1.5">
          ELEGIR AVATAR ANCESTRAL:
        </span>
        <div className="grid grid-cols-6 gap-1">
          {AVATARS.map((av) => (
            <button
              key={av.id}
              onClick={() => {
                sound.pop();
                onUpdateAvatar(av.id);
              }}
              title={av.name}
              className={`p-1 text-center border-2 pixel-corners arcade-btn text-lg ${
                avatarId === av.id ? 'bg-[#ff4d6d] border-[#ffd23f]' : 'bg-[#241544] border-transparent'
              }`}
            >
              {av.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Harvested Crops Inventory */}
      <div className="bg-[#150d2e] p-2 border-2 border-[#5be37d]">
        <div className="flex items-center gap-1.5 text-[8px] text-[#5be37d] font-bold mb-1.5">
          <Package size={12} />
          <span>GRANERO DEL CONUCO (COSECHAS GUARDADAS):</span>
        </div>
        {/* Granero List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[7.5px]">
          <div className="bg-[#1e1038] p-1.5 border border-[#3d246c] rounded-lg flex items-center justify-between">
            <span className="truncate">🌽 Jetsa</span>
            <strong className="text-[#ffd23f] ml-1 shrink-0">{inventory.jetsa}</strong>
          </div>
          <div className="bg-[#1e1038] p-1.5 border border-[#3d246c] rounded-lg flex items-center justify-between">
            <span className="truncate">🌾 Newajü</span>
            <strong className="text-[#5be37d] ml-1 shrink-0">{inventory.newaju}</strong>
          </div>
          <div className="bg-[#1e1038] p-1.5 border border-[#3d246c] rounded-lg flex items-center justify-between">
            <span className="truncate">🍍 Dunusi</span>
            <strong className="text-[#ff9f1c] ml-1 shrink-0">{inventory.dunusi}</strong>
          </div>
          <div className="bg-[#1e1038] p-1.5 border border-[#3d246c] rounded-lg flex items-center justify-between">
            <span className="truncate">🍠 Emairi</span>
            <strong className="text-[#b388ff] ml-1 shrink-0">{inventory.emairi}</strong>
          </div>
          <div className="bg-[#1e1038] p-1.5 border border-[#3d246c] rounded-lg flex items-center justify-between">
            <span className="truncate">🫓 Peri</span>
            <strong className="text-[#ffd23f] ml-1 shrink-0">{inventory.peri}</strong>
          </div>
          <div className="bg-[#1e1038] p-1.5 border border-[#3d246c] rounded-lg flex items-center justify-between">
            <span className="truncate">🥣 Matsuka</span>
            <strong className="text-[#4cc9f0] ml-1 shrink-0">{inventory.matsuka}</strong>
          </div>
        </div>
      </div>

      {/* Daily Quests Section */}
      <div className="bg-[#180e35] p-2 rounded-xl border-2 border-[#ff4d6d]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[8px] text-[#ff4d6d] font-bold flex items-center gap-1">
            <Shield size={11} /> MISIONES DIARIAS SIKUANI
          </span>
          <span className="text-[6.5px] text-[#9ad2f8]">RENOVADAS HOY</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {quests.map((q) => (
            <div
              key={q.id}
              className={`p-2 border rounded-xl flex items-center justify-between gap-2 ${
                q.completed
                  ? 'bg-[#1b2b1d] border-[#5be37d]'
                  : 'bg-[#120826] border-[#3a1d5e]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className="text-[#ffd23f] font-bold block text-[8px] truncate">
                  {q.sikuaniTitle} ({q.title})
                </span>
                <span className="text-gray-300 text-[7px] block leading-snug break-words">
                  {q.desc}
                </span>
                <span className="text-[6.5px] text-[#5be37d] mt-0.5 block">
                  +{q.rewardXp} XP · +{q.rewardCoins} Monedas
                </span>
              </div>

              <div>
                {q.completed ? (
                  <span className="text-[#5be37d] flex items-center gap-1 text-[8px] font-bold">
                    <CheckCircle size={12} /> LISTO
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      sound.correct();
                      confetti({ particleCount: 30, spread: 60 });
                      onClaimQuest(q.id);
                    }}
                    className="px-2 py-1 bg-[#ffd23f] text-black font-bold text-[7px] pixel-corners arcade-btn"
                  >
                    COMPLETAR
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
