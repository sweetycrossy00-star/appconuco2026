import React, { useState, useEffect } from 'react';
import { sound } from '../services/sound';
import { Film, Play, ChevronRight, RotateCcw, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoryScene {
  id: number;
  title: string;
  sikuaniTitle: string;
  dialogue: string[];
  visualType: 'kaliawiri' | 'clans' | 'sebucan' | 'river';
  sikuaniKeywords: { word: string; meaning: string }[];
}

const STORIES: { id: string; name: string; scenes: StoryScene[] }[] = [
  {
    id: 'kaliawiri',
    name: '1. El Árbol de la Vida (Kaliawirinae)',
    scenes: [
      {
        id: 1,
        title: 'El Árbol Sagrado en el Cielo',
        sikuaniTitle: 'Kaliawirinae Itaboxota',
        dialogue: [
          'En el tiempo primordial antes de los conucos, todas las plantas habitaban en una sola copa gigantesca:',
          'El Kaliawirinae, el Árbol de la Vida, cuyas ramas estaban unidas al cielo por sagrados bejucos (ünübo).',
          'En él crecían al mismo tiempo la yuca amarga (Newajü), el maíz dorado (Jetsa) y la piña dulce (Dunusi).'
        ],
        visualType: 'kaliawiri',
        sikuaniKeywords: [
          { word: 'Kaliawirinae', meaning: 'Árbol de la Vida' },
          { word: 'Ünübo', meaning: 'Bejuco sagrado' },
          { word: 'Itaboxo', meaning: 'Cielo' }
        ]
      },
      {
        id: 2,
        title: 'La Caída del Árbol y la Siembra',
        sikuaniTitle: 'Nae Otjopa Atsata',
        dialogue: [
          'Cuando el árbol se abrió, sus semillas cayeron sobre la tierra fértil (Atsa) a lo largo de las vegas de los ríos.',
          'Los sabedores enseñaron a la gente (Jiwi) a rozar el monte con hachas (Sipali) y crear el conuco vivo (Pabi).',
          'Desde aquel día, cada familia siembra y cuida el don de Kaliawiri.'
        ],
        visualType: 'kaliawiri',
        sikuaniKeywords: [
          { word: 'Pabi', meaning: 'Conuco tradicional' },
          { word: 'Atsa', meaning: 'Tierra fértil' },
          { word: 'Jiwi', meaning: 'Gente / Pueblo Sikuani' }
        ]
      }
    ]
  },
  {
    id: 'clans',
    name: '2. Los Clanes Momowi y el Territorio',
    scenes: [
      {
        id: 1,
        title: 'Los Clanes y el Pensamiento Racional',
        sikuaniTitle: 'Momowi Unuta',
        dialogue: [
          'Los Sikuani originalmente recorrían las inmensas sabanas del Vichada como nómadas libres.',
          'Se agrupaban en clanes llamados Momowi ("nietos de"), donde cada linaje descendía de un animal ancestral:',
          'El clan del chigüiro (Jomokobi-momowi), del tigre (Newütjü-momowi) y del oso hormiguero (Tsonü-momowi).'
        ],
        visualType: 'clans',
        sikuaniKeywords: [
          { word: 'Momowi', meaning: 'Linaje / Nieto de' },
          { word: 'Jomokobi', meaning: 'Chigüiro' },
          { word: 'Newütjü', meaning: 'Jaguar / Tigre' }
        ]
      },
      {
        id: 2,
        title: 'El Río Vichada y el Asentamiento',
        sikuaniTitle: 'Witsara Mene',
        dialogue: [
          'Con el paso de los siglos, los clanes se establecieron junto a los grandes ríos: Meta, Vichada, Muco y Orinoco.',
          'Allí florecieron los resguardos como Santa Teresita del Tuparro y las comunidades de Cumaribo y Puerto Carreño.',
          'El respeto mutuo entre humanos, aguas (Mera) y selva (Unu) garantiza la vida de las futuras generaciones.'
        ],
        visualType: 'river',
        sikuaniKeywords: [
          { word: 'Mene', meaning: 'Río' },
          { word: 'Mera', meaning: 'Agua pura' },
          { word: 'Unu', meaning: 'Selva / Monte' }
        ]
      }
    ]
  },
  {
    id: 'sebucan',
    name: '3. El Secreto del Sebucán (Wabata)',
    scenes: [
      {
        id: 1,
        title: 'El Misterio de la Yuca Amarga',
        sikuaniTitle: 'Newajü Liwaisi',
        dialogue: [
          'La yuca amarga (Newajü) posee un jugo amargo y letal llamado yare si se come cruda.',
          'Las abuelas sikuani (Akue) recibieron la sabiduría de rallar la pulpa en la piedra y tejer un cilindro elástico de palma:',
          'El sebucán sagrado (Wabata o Woboto), obra maestra de la artesanía llanera.'
        ],
        visualType: 'sebucan',
        sikuaniKeywords: [
          { word: 'Newajü', meaning: 'Yuca amarga' },
          { word: 'Wabata', meaning: 'Sebucán' },
          { word: 'Akue', meaning: 'Abuela sabia' }
        ]
      },
      {
        id: 2,
        title: 'El Nacimiento del Casabe y Mañoco',
        sikuaniTitle: 'Peri Tsata',
        dialogue: [
          'Al colgar el sebucán con pesas de piedra, el jugo venenoso se escurre por completo.',
          'La masa purificada se cierne en la guapa (Aba) y se asa en discos dorados sobre el fuego de leña (Iso):',
          '¡Así nace el casabe crujiente (Peri) y el mañoco tostado (Matsuka) que alimenta a todo el llano!'
        ],
        visualType: 'sebucan',
        sikuaniKeywords: [
          { word: 'Peri', meaning: 'Casabe' },
          { word: 'Matsuka', meaning: 'Mañoco' },
          { word: 'Aba', meaning: 'Guapa (cesta cernidora)' }
        ]
      }
    ]
  }
];

interface Props {
  onEarnXp: (amount: number, reason: string) => void;
}

export const PixelTheatre: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [dialogueLineIndex, setDialogueLineIndex] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);

  const story = STORIES[selectedStoryIndex];
  const scene = story.scenes[currentSceneIndex];

  useEffect(() => {
    sound.playMusic('theatre');
    return () => {
      sound.stopMusic();
    };
  }, [selectedStoryIndex]);

  const handleNextLine = () => {
    sound.btnClick();
    if (dialogueLineIndex < scene.dialogue.length - 1) {
      setDialogueLineIndex((i) => i + 1);
    } else {
      // Advance to next scene or finish story
      if (currentSceneIndex < story.scenes.length - 1) {
        setCurrentSceneIndex((s) => s + 1);
        setDialogueLineIndex(0);
        sound.correct();
      } else {
        // Story finished!
        sound.victory();
        confetti({ particleCount: 50, spread: 80 });
        if (!completedStories.includes(story.id)) {
          setCompletedStories((prev) => [...prev, story.id]);
          onEarnXp(120, `Historia: ${story.name}`);
        }
      }
    }
  };

  const handleRestart = () => {
    sound.btnClick();
    setCurrentSceneIndex(0);
    setDialogueLineIndex(0);
  };

  return (
    <div className="flex flex-col gap-3 p-3 max-w-md mx-auto bg-[#0a0518] border-4 border-[#b388ff] pixel-corners text-xs">
      {/* Header */}
      <div className="bg-[#1b0e38] p-2 border-2 border-[#ffd23f] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="text-[#ffd23f]" size={16} />
          <span className="text-[#ffd23f] font-bold">TEATRO PIXELART</span>
        </div>
        <span className="text-[#b388ff] text-[8px]">RELATOS ANCESTRALES</span>
      </div>

      {/* Story Select Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {STORIES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              sound.btnClick();
              setSelectedStoryIndex(idx);
              setCurrentSceneIndex(0);
              setDialogueLineIndex(0);
            }}
            className={`px-2 py-1 text-[8px] whitespace-nowrap pixel-corners arcade-btn flex items-center gap-1 ${
              selectedStoryIndex === idx
                ? 'bg-[#b388ff] text-black font-bold'
                : 'bg-[#180e30] text-gray-300'
            }`}
          >
            {completedStories.includes(s.id) && <Award size={10} className="text-[#ffd23f]" />}
            {s.name}
          </button>
        ))}
      </div>

      {/* Retro Pixel Animation Cinema Screen */}
      <div className="relative bg-[#000000] border-4 border-[#3a1c71] p-3 crt-overlay min-h-[160px] flex flex-col justify-between items-center text-center overflow-hidden shadow-[inset_0_0_40px_#140828]">
        {/* Scene Title Banner */}
        <div className="w-full flex items-center justify-between text-[8px] border-b border-[#2d1b69] pb-1">
          <span className="text-[#ffd23f] font-bold">{scene.sikuaniTitle}</span>
          <span className="text-[#4cc9f0]">
            Escena {currentSceneIndex + 1}/{story.scenes.length}
          </span>
        </div>

        {/* 8-Bit Pixel Art Scenic Visualizer */}
        <div className="my-3 flex flex-col items-center justify-center">
          {scene.visualType === 'kaliawiri' && (
            <div className="animate-pulse flex flex-col items-center">
              <span className="text-4xl">🌳</span>
              <span className="text-[8px] text-[#5be37d] mt-1 font-bold">KALIAWIRINAE (ÁRBOL SAGRADO)</span>
              <div className="flex gap-2 text-base mt-1">
                <span>🌽</span>
                <span>🍍</span>
                <span>🍠</span>
                <span>🍌</span>
              </div>
            </div>
          )}

          {scene.visualType === 'clans' && (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-3xl">🐾</span>
                <span className="text-[7px] text-[#ff9f1c]">JOMOKOBI</span>
              </div>
              <div className="flex flex-col items-center animate-bounce">
                <span className="text-3xl">🐆</span>
                <span className="text-[7px] text-[#ffd23f]">NEWÜTJÜ</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl">🦅</span>
                <span className="text-[7px] text-[#4cc9f0]">TSAKI</span>
              </div>
            </div>
          )}

          {scene.visualType === 'river' && (
            <div className="flex flex-col items-center">
              <span className="text-3xl">🛶</span>
              <span className="text-[8px] text-[#4cc9f0] mt-1 font-bold">RÍO VICHADA (WITSARA MENE)</span>
              <span className="text-xs text-[#9ad2f8]">〰️〰️〰️ MERA 〰️〰️〰️</span>
            </div>
          )}

          {scene.visualType === 'sebucan' && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span className="text-3xl">🎋</span>
                <span className="text-[7px] text-[#ffd23f]">WABATA</span>
              </div>
              <span className="text-lg text-[#ff4d6d]">➔</span>
              <div className="flex flex-col items-center animate-pulse">
                <span className="text-3xl">🫓</span>
                <span className="text-[7px] text-[#5be37d]">PERI (CASABE)</span>
              </div>
            </div>
          )}
        </div>

        {/* Subtitles & Dialogue Box */}
        <div className="w-full bg-[#0d0720]/90 border border-[#b388ff] p-2 min-h-[44px] flex items-center justify-center">
          <p className="text-[9px] text-white leading-relaxed font-mono">
            {scene.dialogue[dialogueLineIndex]}
          </p>
        </div>
      </div>

      {/* Sikuani Key Terms Learned */}
      <div className="bg-[#160d2e] p-2 border-2 border-[#5a2a8a]">
        <span className="text-[8px] text-[#ffd23f] font-bold block mb-1">
          PALABRAS CLAVE EN SIKUANI:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {scene.sikuaniKeywords.map((kw, i) => (
            <button
              key={i}
              onClick={() => sound.sikuaniWordSound(kw.word)}
              className="px-1.5 py-0.5 bg-[#2d1b69] border border-[#ffd23f] text-[7px] text-[#5be37d] hover:bg-[#3d248c] active:scale-95"
            >
              <strong>{kw.word}:</strong> {kw.meaning} 🔊
            </button>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleRestart}
          className="px-3 py-2 bg-[#1b1035] text-white border-2 border-[#5a2a8a] pixel-corners arcade-btn text-[8px] flex items-center gap-1"
        >
          <RotateCcw size={12} /> REPETIR
        </button>
        <button
          onClick={handleNextLine}
          className="flex-1 py-2 bg-[#ffd23f] text-black font-bold border-2 border-[#ff9f1c] pixel-corners arcade-btn text-[9px] flex items-center justify-center gap-1"
        >
          CONTINUAR <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
