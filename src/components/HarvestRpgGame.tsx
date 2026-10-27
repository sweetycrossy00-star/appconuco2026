import React, { useState, useEffect } from 'react';
import { sound } from '../services/sound';
import { Sparkles, RefreshCw, Trophy, Droplets, Shovel, Flame, Sun, CloudRain } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface HarvestInventory {
  jetsa: number; // Maíz
  newaju: number; // Yuca amarga
  dunusi: number; // Piña
  emairi: number; // Ñame
  peri: number; // Casabe
  matsuka: number; // Mañoco
}

interface Plot {
  id: number;
  stage: 'empty' | 'prepared' | 'planted' | 'growing' | 'ready' | 'weeded';
  crop: 'jetsa' | 'newaju' | 'dunusi' | 'emairi' | null;
  moisture: number; // 0 to 100
  growth: number; // 0 to 100
  hasWeeds: boolean;
}

interface Props {
  onEarnXp: (amount: number, reason: string) => void;
  onHarvestItem: (item: keyof HarvestInventory, amount: number) => void;
  inventory: HarvestInventory;
}

export const HarvestRpgGame: React.FC<Props> = ({ onEarnXp, onHarvestItem, inventory }) => {
  const [selectedTool, setSelectedTool] = useState<'sipali' | 'uba_jetsa' | 'uba_newaju' | 'uba_dunusi' | 'mera' | 'jonoka' | 'nota'>('uba_newaju');
  const [weather, setWeather] = useState<'wai' | 'ema'>('wai'); // Wai = Verano, Ema = Lluvia
  const [dayCounter, setDayCounter] = useState(1);
  const [logMessage, setLogMessage] = useState('¡Bienvenido al Pabi (Conuco)! Selecciona una acción para cultivar.');
  
  // 3x3 Conuco grid
  const [plots, setPlots] = useState<Plot[]>([
    { id: 0, stage: 'ready', crop: 'newaju', moisture: 60, growth: 100, hasWeeds: false },
    { id: 1, stage: 'planted', crop: 'jetsa', moisture: 40, growth: 30, hasWeeds: false },
    { id: 2, stage: 'empty', crop: null, moisture: 20, growth: 0, hasWeeds: true },
    { id: 3, stage: 'growing', crop: 'dunusi', moisture: 70, growth: 60, hasWeeds: false },
    { id: 4, stage: 'prepared', crop: null, moisture: 50, growth: 0, hasWeeds: false },
    { id: 5, stage: 'empty', crop: null, moisture: 10, growth: 0, hasWeeds: false },
    { id: 6, stage: 'growing', crop: 'newaju', moisture: 50, growth: 70, hasWeeds: false },
    { id: 7, stage: 'ready', crop: 'jetsa', moisture: 50, growth: 100, hasWeeds: false },
    { id: 8, stage: 'empty', crop: null, moisture: 30, growth: 0, hasWeeds: true },
  ]);

  // Weather & growth timer
  useEffect(() => {
    const timer = setInterval(() => {
      setPlots((prev) =>
        prev.map((p) => {
          let m = p.moisture;
          let g = p.growth;
          let stage = p.stage;
          let hasWeeds = p.hasWeeds;

          // Weather effect
          if (weather === 'ema') {
            m = Math.min(100, m + 8);
          } else {
            m = Math.max(0, m - 4);
          }

          // Random weed appearance
          if (Math.random() < 0.05 && !hasWeeds && stage !== 'empty') {
            hasWeeds = true;
          }

          // Growth mechanics
          if ((stage === 'planted' || stage === 'growing') && p.crop && m > 20 && !hasWeeds) {
            g = Math.min(100, g + 8);
            if (g >= 100) {
              stage = 'ready';
            } else if (g >= 40) {
              stage = 'growing';
            }
          }

          return { ...p, moisture: m, growth: g, stage, hasWeeds };
        })
      );
    }, 2800);

    return () => clearInterval(timer);
  }, [weather]);

  // Weather cycle toggle
  const toggleWeather = () => {
    sound.btnClick();
    if (weather === 'wai') {
      setWeather('ema');
      sound.water();
      setLogMessage('¡Ha comenzado la lluvia Ema! El agua Mera nutre todas las parcelas.');
    } else {
      setWeather('wai');
      setLogMessage('El sol brilla en el verano Wai. ¡Recuerda regar las plantas sedientas!');
    }
  };

  const advanceDay = () => {
    sound.btnClick();
    setDayCounter((d) => d + 1);
    setPlots((prev) =>
      prev.map((p) => {
        let g = p.growth;
        let stage = p.stage;
        if (p.crop && (stage === 'planted' || stage === 'growing')) {
          g = Math.min(100, g + 35);
          if (g >= 100) stage = 'ready';
          else if (g >= 40) stage = 'growing';
        }
        return { ...p, growth: g, stage };
      })
    );
    setLogMessage(`Amanece un nuevo ciclo agrícola en el Vichada (Día ${dayCounter + 1}).`);
  };

  const handlePlotClick = (plot: Plot) => {
    const nextPlots = [...plots];
    const target = { ...plot };

    if (selectedTool === 'jonoka') {
      // Deshierbar
      if (target.hasWeeds) {
        target.hasWeeds = false;
        sound.pop();
        onEarnXp(25, 'Deshierbe Jonoka');
        setLogMessage('¡Arrancaste la maleza! La planta vuelve a respirar libre.');
      } else {
        sound.hurt();
        setLogMessage('Esta parcela no tiene malezas.');
      }
    } else if (selectedTool === 'sipali') {
      // Limpiar y preparar terreno
      if (target.stage === 'empty') {
        target.stage = 'prepared';
        target.hasWeeds = false;
        sound.toolSlash();
        onEarnXp(20, 'Preparación Atsa con Sipali');
        setLogMessage('¡Tierra limpia y fértil (Atsa)! Lista para sembrar.');
      } else {
        sound.hurt();
        setLogMessage('Usa el hacha solo en parcelas vacías.');
      }
    } else if (selectedTool.startsWith('uba_')) {
      // Sembrar
      if (target.stage === 'prepared') {
        const cropType = selectedTool.replace('uba_', '') as Plot['crop'];
        target.stage = 'planted';
        target.crop = cropType;
        target.growth = 10;
        sound.pop();
        onEarnXp(30, `Siembra Uba de ${cropType?.toUpperCase()}`);
        setLogMessage(`¡Sembraste ${cropType?.toUpperCase()} con éxito!`);
      } else if (target.stage === 'empty') {
        sound.hurt();
        setLogMessage('Primero debes preparar la tierra con el Hacha Sipali.');
      } else {
        sound.hurt();
        setLogMessage('Esta parcela ya tiene un cultivo.');
      }
    } else if (selectedTool === 'mera') {
      // Regar agua
      if (target.moisture < 100) {
        target.moisture = Math.min(100, target.moisture + 40);
        sound.water();
        onEarnXp(15, 'Riego Mera');
        setLogMessage('¡Bañaste la parcela con agua fresca (Mera)!');
      }
    } else if (selectedTool === 'nota') {
      // Cosechar
      if (target.stage === 'ready' && target.crop) {
        const harvestedCrop = target.crop;
        target.stage = 'empty';
        target.crop = null;
        target.growth = 0;
        sound.correct();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        onHarvestItem(harvestedCrop, 1);
        onEarnXp(60, `Cosecha Nota de ${harvestedCrop.toUpperCase()}`);
        setLogMessage(`¡Cosecha sagrada! Has recolectado ${harvestedCrop.toUpperCase()} del conuco.`);
      } else {
        sound.hurt();
        setLogMessage('El cultivo aún no está maduro para cosechar.');
      }
    }

    nextPlots[plot.id] = target;
    setPlots(nextPlots);
  };

  // Procesar casabe en sebucán
  const processCasabe = () => {
    if (inventory.newaju >= 2) {
      sound.correct();
      onHarvestItem('newaju', -2);
      onHarvestItem('peri', 1);
      onHarvestItem('matsuka', 1);
      onEarnXp(80, 'Procesamiento en Sebucán Wabata');
      confetti({ particleCount: 40, spread: 70 });
      setLogMessage('¡El Sebucán Woboto extrajo el yare! Obtuviste 1 Casabe (Peri) y 1 Mañoco (Matsuka).');
    } else {
      sound.hurt();
      setLogMessage('Necesitas al menos 2 raíces de Yuca Brava (Newajü) para activar el Sebucán.');
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 max-w-md mx-auto bg-[#0f0a24] border-4 border-[#ff4d6d] pixel-corners text-xs">
      {/* RPG Header */}
      <div className="flex items-center justify-between bg-[#1f103d] p-2 border-2 border-[#ffd23f]">
        <div>
          <span className="text-[#ffd23f] font-bold block text-sm">PABI RPG</span>
          <span className="text-[#4cc9f0] text-[10px]">Ciclos del Conuco</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleWeather}
            className={`px-2 py-1 flex items-center gap-1 pixel-corners arcade-btn text-[9px] ${
              weather === 'wai' ? 'bg-[#ff9f1c] text-black' : 'bg-[#4aa3ff] text-white'
            }`}
          >
            {weather === 'wai' ? <Sun size={12} /> : <CloudRain size={12} />}
            {weather === 'wai' ? 'WAI (Sol)' : 'EMA (Lluvia)'}
          </button>
          <button
            onClick={advanceDay}
            className="px-2 py-1 bg-[#5be37d] text-black font-bold pixel-corners arcade-btn text-[9px] flex items-center gap-1"
          >
            <RefreshCw size={10} /> Día {dayCounter}
          </button>
        </div>
      </div>

      {/* Narrative Dialogue Box */}
      <div className="bg-[#180d30] border-2 border-[#4cc9f0] p-2 min-h-[46px] flex items-center gap-2 text-[10px]">
        <span className="text-[#ffd23f] font-bold">CONUCO:</span>
        <span className="text-white leading-tight">{logMessage}</span>
      </div>

      {/* Tool Selection Bar */}
      <div className="bg-[#1b1240] p-2 border-2 border-[#5a2a8a] rounded-xl">
        <div className="text-[8px] text-[#9ad2f8] mb-1 font-bold text-center">
          HERRAMIENTAS Y ACCIONES SIKUANI:
        </div>
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => {
              setSelectedTool('sipali');
              sound.btnClick();
            }}
            className={`p-1 text-center pixel-corners arcade-btn text-[7px] flex flex-col items-center justify-center min-h-[46px] ${
              selectedTool === 'sipali' ? 'bg-[#ffd23f] text-black font-bold' : 'bg-[#2b1854] text-white'
            }`}
          >
            <Shovel size={13} className="text-[#ff9f1c]" />
            <span className="truncate max-w-full">Sipali</span>
            <span className="text-[6px] opacity-75">(Hacha)</span>
          </button>

          <button
            onClick={() => {
              setSelectedTool('uba_newaju');
              sound.btnClick();
            }}
            className={`p-1 text-center pixel-corners arcade-btn text-[7px] flex flex-col items-center justify-center min-h-[46px] ${
              selectedTool === 'uba_newaju' ? 'bg-[#ffd23f] text-black font-bold' : 'bg-[#2b1854] text-white'
            }`}
          >
            <Sparkles size={13} className="text-[#5be37d]" />
            <span className="truncate max-w-full">Uba Newajü</span>
            <span className="text-[6px] opacity-75">(Yuca)</span>
          </button>

          <button
            onClick={() => {
              setSelectedTool('uba_jetsa');
              sound.btnClick();
            }}
            className={`p-1 text-center pixel-corners arcade-btn text-[7px] flex flex-col items-center justify-center min-h-[46px] ${
              selectedTool === 'uba_jetsa' ? 'bg-[#ffd23f] text-black font-bold' : 'bg-[#2b1854] text-white'
            }`}
          >
            <Sparkles size={13} className="text-[#ffd23f]" />
            <span className="truncate max-w-full">Uba Jetsa</span>
            <span className="text-[6px] opacity-75">(Maíz)</span>
          </button>

          <button
            onClick={() => {
              setSelectedTool('mera');
              sound.btnClick();
            }}
            className={`p-1 text-center pixel-corners arcade-btn text-[7px] flex flex-col items-center justify-center min-h-[46px] ${
              selectedTool === 'mera' ? 'bg-[#ffd23f] text-black font-bold' : 'bg-[#2b1854] text-white'
            }`}
          >
            <Droplets size={13} className="text-[#4cc9f0]" />
            <span className="truncate max-w-full">Mera</span>
            <span className="text-[6px] opacity-75">(Agua)</span>
          </button>

          <button
            onClick={() => {
              setSelectedTool('jonoka');
              sound.btnClick();
            }}
            className={`p-1 text-center pixel-corners arcade-btn text-[7px] flex flex-col items-center justify-center min-h-[44px] ${
              selectedTool === 'jonoka' ? 'bg-[#ffd23f] text-black font-bold' : 'bg-[#2b1854] text-white'
            }`}
          >
            <Flame size={13} className="text-[#ff4d6d]" />
            <span className="truncate max-w-full">Jonoka</span>
            <span className="text-[6px] opacity-75">(Deshierbe)</span>
          </button>

          <button
            onClick={() => {
              setSelectedTool('nota');
              sound.btnClick();
            }}
            className={`p-1 text-center pixel-corners arcade-btn text-[7px] flex items-center justify-center gap-1 col-span-3 min-h-[44px] ${
              selectedTool === 'nota' ? 'bg-[#5be37d] text-black font-bold' : 'bg-[#2b1854] text-[#5be37d]'
            }`}
          >
            <Trophy size={13} />
            <span>NOTA (COSECHAR COPIA MADURA)</span>
          </button>
        </div>
      </div>

      {/* 3x3 Plot Grid */}
      <div className="grid grid-cols-3 gap-2 bg-[#2a1710] p-2.5 border-4 border-[#5d3b1e] rounded-sm">
        {plots.map((plot) => {
          let stageLabel = 'Tierra virgen';
          let bgColor = 'bg-[#4a2c15]';
          let textColor = 'text-[#d7ccc8]';

          if (plot.stage === 'prepared') {
            stageLabel = 'Atsa limpia';
            bgColor = 'bg-[#6d4c41]';
          } else if (plot.stage === 'planted') {
            stageLabel = `Brote de ${plot.crop?.toUpperCase()}`;
            bgColor = 'bg-[#33691e]';
            textColor = 'text-[#c8e6c9]';
          } else if (plot.stage === 'growing') {
            stageLabel = `${plot.crop?.toUpperCase()} en flor`;
            bgColor = 'bg-[#2e7d32]';
            textColor = 'text-[#a5d6a7]';
          } else if (plot.stage === 'ready') {
            stageLabel = `¡${plot.crop?.toUpperCase()} LISTO!`;
            bgColor = 'bg-[#f57f17] animate-pulse';
            textColor = 'text-black font-bold';
          }

          return (
            <button
              key={plot.id}
              onClick={() => handlePlotClick(plot)}
              className={`h-24 p-1.5 border-2 border-[#1f1008] pixel-corners flex flex-col justify-between items-center text-center transition-transform active:scale-95 ${bgColor} ${textColor}`}
            >
              {/* Header icons: Weeds & Moisture */}
              <div className="w-full flex justify-between items-center text-[7px]">
                <span className="flex items-center gap-0.5 text-[#4cc9f0]">
                  <Droplets size={8} /> {plot.moisture}%
                </span>
                {plot.hasWeeds && (
                  <span className="bg-[#b71c1c] text-white px-1 py-0.2 rounded-sm text-[6px] animate-bounce">
                    MALEZA
                  </span>
                )}
              </div>

              {/* Graphic Icon */}
              <div className="text-xl my-0.5">
                {plot.stage === 'ready' ? (
                  '🌾'
                ) : plot.stage === 'growing' ? (
                  '🌿'
                ) : plot.stage === 'planted' ? (
                  '🌱'
                ) : plot.stage === 'prepared' ? (
                  '🟫'
                ) : plot.hasWeeds ? (
                  '🥀'
                ) : (
                  '🪵'
                )}
              </div>

              {/* Status and Progress */}
              <div className="w-full">
                <span className="block text-[7px] leading-tight truncate">{stageLabel}</span>
                {plot.stage !== 'empty' && plot.stage !== 'prepared' && (
                  <div className="w-full bg-black/40 h-1.5 mt-1 overflow-hidden border border-black">
                    <div
                      className="bg-[#5be37d] h-full"
                      style={{ width: `${plot.growth}%` }}
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sebucán Transformation Workshop */}
      <div className="bg-[#241544] p-2.5 border-2 border-[#ffd23f] flex items-center justify-between">
        <div>
          <span className="text-[#ffd23f] font-bold block text-[10px]">WABATA (SEBUCÁN TRADICIONAL)</span>
          <span className="text-[8px] text-[#ccc]">Procesa 2 Yuca Brava en Casabe Peri y Mañoco</span>
        </div>
        <button
          onClick={processCasabe}
          disabled={inventory.newaju < 2}
          className={`px-3 py-2 text-[8px] font-bold pixel-corners arcade-btn ${
            inventory.newaju >= 2
              ? 'bg-[#ff4d6d] text-white cursor-pointer'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          PRENSAR EN WABATA
        </button>
      </div>
    </div>
  );
};
