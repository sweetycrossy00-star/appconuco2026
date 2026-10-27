import React, { useState, useEffect } from 'react';
import { sound } from './services/sound';
import { MobileLevelMap, LevelNode } from './components/MobileLevelMap';
import { GameHub, GameKey } from './components/GameHub';
import { SopaDeLetras } from './components/SopaDeLetras';
import { CrucigramaConuco } from './components/CrucigramaConuco';
import { AhorcadoSabana } from './components/AhorcadoSabana';
import { SilhouetteQuizGame } from './components/SilhouetteQuizGame';
import { HarvestRpgGame, HarvestInventory } from './components/HarvestRpgGame';
import { ArcadeCabinet } from './components/ArcadeCabinet';
import { ConucoDictionary } from './components/ConucoDictionary';
import { PixelTheatre } from './components/PixelTheatre';
import { PlayerProfile } from './components/PlayerProfile';
import { AncestralTerritoryInfo } from './components/AncestralTerritoryInfo';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { CyberpunkWaveBg } from './components/CyberpunkWaveBg';
import { INITIAL_QUESTS, DailyQuest } from './data/sikuaniData';
import {
  Map,
  Gamepad2,
  BookOpen,
  User,
  Smartphone,
  Volume2,
  VolumeX,
  Star,
  Info,
  ChevronLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'map' | 'games' | 'dictionary' | 'profile'>('map');
  const [activeGame, setActiveGame] = useState<GameKey | null>(null);
  const [showTerritoryModal, setShowTerritoryModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);

  const [playerName, setPlayerName] = useState(() => {
    try {
      return localStorage.getItem('sikuani_player_name') || 'Sabedor';
    } catch {
      return 'Sabedor';
    }
  });

  const [avatarId, setAvatarId] = useState(() => {
    try {
      return localStorage.getItem('sikuani_avatar_id') || 'farmer_boy';
    } catch {
      return 'farmer_boy';
    }
  });

  const [playerXp, setPlayerXp] = useState(() => {
    try {
      const v = localStorage.getItem('sikuani_player_xp');
      return v ? parseInt(v, 10) : 120;
    } catch {
      return 120;
    }
  });

  const [savedStars, setSavedStars] = useState<number[]>(() => {
    try {
      const v = JSON.parse(localStorage.getItem('arcv') || '[]');
      return Array.isArray(v) && v.length === 7 ? v : [3, 2, 1, 0, 0, 0, 0];
    } catch {
      return [3, 2, 1, 0, 0, 0, 0];
    }
  });

  const [inventory, setInventory] = useState<HarvestInventory>(() => {
    try {
      const v = JSON.parse(localStorage.getItem('sikuani_inventory') || '{}');
      return {
        jetsa: v.jetsa || 3,
        newaju: v.newaju || 4,
        dunusi: v.dunusi || 2,
        emairi: v.emairi || 1,
        peri: v.peri || 2,
        matsuka: v.matsuka || 1,
      };
    } catch {
      return { jetsa: 3, newaju: 4, dunusi: 2, emairi: 1, peri: 2, matsuka: 1 };
    }
  });

  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    try {
      const v = JSON.parse(localStorage.getItem('sikuani_quests') || '[]');
      return Array.isArray(v) && v.length ? v : INITIAL_QUESTS;
    } catch {
      return INITIAL_QUESTS;
    }
  });

  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Background music control
  useEffect(() => {
    if (activeGame === 'rpg') {
      sound.playMusic('rpg');
    } else if (activeGame === 'theatre') {
      sound.playMusic('theatre');
    } else if (activeGame) {
      sound.playMusic('play');
    } else {
      sound.playMusic('menu');
    }
  }, [activeGame, currentTab]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  const handleEarnXp = (amount: number, reason: string) => {
    setPlayerXp((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('sikuani_player_xp', String(next));
      } catch {}
      return next;
    });
    showNotification(`+${amount} XP: ${reason}`);
  };

  const handleHarvestItem = (item: keyof HarvestInventory, amount: number) => {
    setInventory((prev) => {
      const next = { ...prev, [item]: Math.max(0, prev[item] + amount) };
      try {
        localStorage.setItem('sikuani_inventory', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleClaimQuest = (questId: string) => {
    setQuests((prev) => {
      const next = prev.map((q) => {
        if (q.id === questId) {
          handleEarnXp(q.rewardXp, `Misión: ${q.title}`);
          return { ...q, completed: true, currentCount: q.targetCount };
        }
        return q;
      });
      try {
        localStorage.setItem('sikuani_quests', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const totalStars = savedStars.reduce((a, b) => a + b, 0);
  const playerLevel = Math.max(1, Math.floor(playerXp / 200) + 1);

  // 7 Progressive Level Stations along the Winding Leaf Trail
  const LEVEL_NODES: LevelNode[] = [
    {
      id: 1,
      sikuaniTitle: 'Brote de Yuca (Newajü)',
      spanishTitle: 'Sopa de Letras Botánica',
      gameType: 'sopa',
      minStarsToUnlock: 0,
      starsEarned: savedStars[0] || 0,
      icon: '🌱',
      themeColor: '#2e7d32',
      description: 'Encuentra las plantas sagradas del conuco.',
    },
    {
      id: 2,
      sikuaniTitle: 'Herramientas (Sipali)',
      spanishTitle: 'Crucigrama del Campo',
      gameType: 'crucigrama',
      minStarsToUnlock: 1,
      starsEarned: savedStars[1] || 0,
      icon: '🪓',
      themeColor: '#1565c0',
      description: 'Aprende los utensilios sikuani con el teclado.',
    },
    {
      id: 3,
      sikuaniTitle: 'El Maizal (Jetsa)',
      spanishTitle: 'Adivina la Palabra',
      gameType: 'ahorcado',
      minStarsToUnlock: 2,
      starsEarned: savedStars[2] || 0,
      icon: '🌽',
      themeColor: '#e65100',
      description: 'Protege a Jomokobi adivinando letras.',
    },
    {
      id: 4,
      sikuaniTitle: 'Fuentes de Agua (Mera)',
      spanishTitle: 'Desafío de Siluetas',
      gameType: 'siluetas',
      minStarsToUnlock: 4,
      starsEarned: savedStars[3] || 0,
      icon: '💧',
      themeColor: '#00838f',
      description: 'Reconoce las sombras misteriosas del monte.',
    },
    {
      id: 5,
      sikuaniTitle: 'El Chigüiro (Jomokobi)',
      spanishTitle: 'Laberinto de la Selva',
      gameType: 'laberinto',
      minStarsToUnlock: 6,
      starsEarned: savedStars[4] || 0,
      icon: '🦫',
      themeColor: '#4a148c',
      description: 'Come frutos del conuco en el laberinto.',
    },
    {
      id: 6,
      sikuaniTitle: 'El Sebucán (Wabata)',
      spanishTitle: 'Simulador de Conuco RPG',
      gameType: 'rpg',
      minStarsToUnlock: 9,
      starsEarned: savedStars[5] || 0,
      icon: '🎋',
      themeColor: '#ad1457',
      description: 'Prepara la tierra, siembra y procesa casabe.',
    },
    {
      id: 7,
      sikuaniTitle: 'El Árbol Celestial',
      spanishTitle: 'Kaliawirinae Maestro',
      gameType: 'sopa',
      minStarsToUnlock: 12,
      starsEarned: savedStars[6] || 0,
      icon: '🌳',
      themeColor: '#ffd23f',
      description: 'El desafío final del sabedor de Vichada.',
    },
  ];

  const handleSelectLevelNode = (node: LevelNode) => {
    if (node.gameType === 'sopa') setActiveGame('sopa');
    else if (node.gameType === 'crucigrama') setActiveGame('crucigrama');
    else if (node.gameType === 'ahorcado') setActiveGame('ahorcado');
    else if (node.gameType === 'siluetas') setActiveGame('siluetas');
    else if (node.gameType === 'rpg') setActiveGame('rpg');
    else if (node.gameType === 'laberinto') setActiveGame('arcade_classic');
  };

  return (
    <div className="min-h-screen bg-[#07030d] text-white flex flex-col font-['Press_Start_2P',monospace] select-none antialiased relative overflow-x-hidden">
      {/* Animated Multi-Colored Cyberpunk Wave Background */}
      <CyberpunkWaveBg />

      {/* Mobile App Native Top Bar */}
      <header className="sticky top-0 z-40 bg-[#120726]/95 backdrop-blur-md px-3 py-2 flex items-center justify-between border-b-2 border-[#ff4d6d] shadow-md">
        {/* User avatar & status */}
        <div
          onClick={() => {
            sound.btnClick();
            setCurrentTab('profile');
            setActiveGame(null);
          }}
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-full bg-[#ffd23f] flex items-center justify-center text-lg border-2 border-white shadow-inner">
            {avatarId === 'farmer_girl' ? '👧🏾' : avatarId === 'wise_elder' ? '👵🏾' : avatarId === 'hunter' ? '🏹' : avatarId === 'capybara' ? '🐾' : avatarId === 'jaguar' ? '🐆' : '👦🏾'}
          </div>
          <div>
            <span className="text-[#ffd23f] text-[9px] font-bold block truncate max-w-[100px]">
              {playerName}
            </span>
            <span className="text-[#5be37d] text-[7px] block">NIVEL {playerLevel}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Total Stars Pill */}
          <div className="flex items-center gap-1 bg-[#1e0f38] px-2 py-1 rounded-full border border-[#ffd23f]/50 text-[8px] text-[#ffd23f]">
            <Star size={11} fill="#ffd23f" />
            <span>{totalStars}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
              sound.btnClick();
            }}
            className="p-1.5 bg-[#241344] rounded-full text-white active:scale-90"
            title="Sonido"
          >
            {isMuted ? <VolumeX size={13} className="text-[#ff4d6d]" /> : <Volume2 size={13} className="text-[#4cc9f0]" />}
          </button>

          {/* Territory Lore Button */}
          <button
            onClick={() => {
              sound.btnClick();
              setShowTerritoryModal(true);
            }}
            className="p-1.5 bg-[#241344] rounded-full text-[#ff9f1c] active:scale-90"
            title="Territorio Sikuani"
          >
            <Info size={13} />
          </button>

          {/* APK Install button */}
          <button
            onClick={() => {
              sound.btnClick();
              setShowApkModal(true);
            }}
            className="px-2 py-1 bg-[#5be37d] text-black font-bold text-[7.5px] rounded-full active:scale-95 flex items-center gap-1"
          >
            <Smartphone size={11} /> APK
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-3 pt-3 pb-24 max-w-sm mx-auto w-full">
        {/* If a game is actively playing, render it with a quick back button */}
        {activeGame ? (
          <div>
            <button
              onClick={() => {
                sound.btnClick();
                setActiveGame(null);
              }}
              className="mb-2 px-3 py-1.5 bg-[#1f103d] border border-[#ffd23f] text-[#ffd23f] text-[8px] rounded-xl flex items-center gap-1 active:scale-95"
            >
              <ChevronLeft size={14} /> VOLVER AL MENÚ
            </button>

            {activeGame === 'sopa' && (
              <SopaDeLetras
                onEarnXp={handleEarnXp}
                onBack={() => setActiveGame(null)}
              />
            )}
            {activeGame === 'crucigrama' && (
              <CrucigramaConuco
                onEarnXp={handleEarnXp}
                onBack={() => setActiveGame(null)}
              />
            )}
            {activeGame === 'ahorcado' && (
              <AhorcadoSabana
                onEarnXp={handleEarnXp}
                onBack={() => setActiveGame(null)}
              />
            )}
            {activeGame === 'siluetas' && (
              <SilhouetteQuizGame onEarnXp={handleEarnXp} />
            )}
            {activeGame === 'rpg' && (
              <HarvestRpgGame
                onEarnXp={handleEarnXp}
                onHarvestItem={handleHarvestItem}
                inventory={inventory}
              />
            )}
            {activeGame === 'arcade_classic' && (
              <ArcadeCabinet
                onEarnXp={handleEarnXp}
                playerName={playerName}
                arcadeStars={totalStars}
                savedStars={savedStars}
                onUpdateStars={(s) => setSavedStars(s)}
              />
            )}
            {activeGame === 'theatre' && (
              <PixelTheatre onEarnXp={handleEarnXp} />
            )}
          </div>
        ) : (
          /* Normal Tab Views */
          <div>
            {currentTab === 'map' && (
              <MobileLevelMap
                levels={LEVEL_NODES}
                onSelectLevel={handleSelectLevelNode}
                totalStars={totalStars}
              />
            )}

            {currentTab === 'games' && (
              <GameHub onSelectGame={(key) => setActiveGame(key)} />
            )}

            {currentTab === 'dictionary' && (
              <ConucoDictionary
                onLearnTerm={(id) => handleEarnXp(20, 'Palabra explorada')}
              />
            )}

            {currentTab === 'profile' && (
              <PlayerProfile
                playerName={playerName}
                onUpdateName={(n) => {
                  setPlayerName(n);
                  try {
                    localStorage.setItem('sikuani_player_name', n);
                  } catch {}
                }}
                playerXp={playerXp}
                playerLevel={playerLevel}
                avatarId={avatarId}
                onUpdateAvatar={(a) => {
                  setAvatarId(a);
                  try {
                    localStorage.setItem('sikuani_avatar_id', a);
                  } catch {}
                }}
                quests={quests}
                onClaimQuest={handleClaimQuest}
                inventory={inventory}
                arcadeStars={totalStars}
              />
            )}
          </div>
        )}
      </main>

      {/* Bottom Mobile Tab Bar (App-style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#100722]/98 backdrop-blur-lg border-t-2 border-[#5a2a8a] py-2 px-4 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => {
            sound.btnClick();
            setCurrentTab('map');
            setActiveGame(null);
          }}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
            currentTab === 'map' && !activeGame
              ? 'text-[#ffd23f] scale-110 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Map size={18} />
          <span className="text-[7px]">CAMINO</span>
        </button>

        <button
          onClick={() => {
            sound.btnClick();
            setCurrentTab('games');
            setActiveGame(null);
          }}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
            currentTab === 'games' || activeGame
              ? 'text-[#5be37d] scale-110 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Gamepad2 size={18} />
          <span className="text-[7px]">JUEGOS</span>
        </button>

        <button
          onClick={() => {
            sound.btnClick();
            setCurrentTab('dictionary');
            setActiveGame(null);
          }}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
            currentTab === 'dictionary'
              ? 'text-[#4cc9f0] scale-110 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BookOpen size={18} />
          <span className="text-[7px]">DICCIONARIO</span>
        </button>

        <button
          onClick={() => {
            sound.btnClick();
            setCurrentTab('profile');
            setActiveGame(null);
          }}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
            currentTab === 'profile'
              ? 'text-[#ff4d6d] scale-110 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <User size={18} />
          <span className="text-[7px]">PERFIL</span>
        </button>
      </nav>

      {/* APK Installation Modal */}
      <ApkDownloadModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />

      {/* Territory Information Modal */}
      {showTerritoryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
          <div className="max-w-sm w-full">
            <AncestralTerritoryInfo onClose={() => setShowTerritoryModal(false)} />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#ffd23f] text-black px-3 py-1.5 text-[8px] font-bold rounded-xl shadow-lg border border-black animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
