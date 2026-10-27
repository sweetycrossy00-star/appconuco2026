import React, { useState } from 'react';
import { sound } from '../services/sound';
import { CheckCircle2, RotateCcw, Lightbulb, ArrowLeft, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CrosswordItem {
  id: number;
  word: string; // Sikuani answer in uppercase
  spanishClue: string;
  direction: 'H' | 'V';
  startRow: number;
  startCol: number;
}

const CROSSWORD_DATA: CrosswordItem[] = [
  {
    id: 1,
    word: 'NEWAJU',
    spanishClue: 'Yuca amarga o brava (tubérculo rey del conuco)',
    direction: 'H',
    startRow: 1,
    startCol: 0,
  },
  {
    id: 2,
    word: 'MERA',
    spanishClue: 'El agua pura que calma la sed y riega las plantas',
    direction: 'V',
    startRow: 0,
    startCol: 3,
  },
  {
    id: 3,
    word: 'SIPALI',
    spanishClue: 'Hacha de campo para rozar el monte y abrir conuco',
    direction: 'H',
    startRow: 4,
    startCol: 1,
  },
  {
    id: 4,
    word: 'PERI',
    spanishClue: 'Casabe crujiente asado en el budare',
    direction: 'V',
    startRow: 3,
    startCol: 3,
  },
];

const ROWS = 6;
const COLS = 7;

interface Props {
  onEarnXp: (amount: number, reason: string) => void;
  onBack?: () => void;
}

export const CrucigramaConuco: React.FC<Props> = ({ onEarnXp, onBack }) => {
  const [gridValues, setGridValues] = useState<{ [key: string]: string }>({});
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>({ r: 1, c: 0 });
  const [isCompleted, setIsCompleted] = useState(false);

  // Keyboard keys including Sikuani special characters
  const KEYBOARD_ROWS = [
    ['A', 'B', 'D', 'E', 'F', 'I', 'J'],
    ['K', 'L', 'M', 'N', 'O', 'P', 'R'],
    ['S', 'T', 'U', 'Ü', 'W', 'Y', '⌫'],
  ];

  // Helper: check if a cell is active in any crossword word
  const getCellClues = (r: number, c: number) => {
    return CROSSWORD_DATA.filter((item) => {
      if (item.direction === 'H') {
        return r === item.startRow && c >= item.startCol && c < item.startCol + item.word.length;
      } else {
        return c === item.startCol && r >= item.startRow && r < item.startRow + item.word.length;
      }
    });
  };

  const isCellValid = (r: number, c: number) => getCellClues(r, c).length > 0;

  const handleKeyPress = (char: string) => {
    if (!selectedCell) return;
    sound.btnClick();

    const key = `${selectedCell.r}-${selectedCell.c}`;

    if (char === '⌫') {
      const next = { ...gridValues };
      delete next[key];
      setGridValues(next);
      return;
    }

    // Set character
    const next = { ...gridValues, [key]: char };
    setGridValues(next);

    // Auto advance to next slot horizontally or vertically
    const currentClue = getCellClues(selectedCell.r, selectedCell.c)[0];
    if (currentClue) {
      if (currentClue.direction === 'H' && selectedCell.c + 1 < currentClue.startCol + currentClue.word.length) {
        setSelectedCell({ r: selectedCell.r, c: selectedCell.c + 1 });
      } else if (currentClue.direction === 'V' && selectedCell.r + 1 < currentClue.startRow + currentClue.word.length) {
        setSelectedCell({ r: selectedCell.r + 1, c: selectedCell.c });
      }
    }

    // Check complete solution
    verifyCrossword(next);
  };

  const verifyCrossword = (vals: { [key: string]: string }) => {
    const allCorrect = CROSSWORD_DATA.every((item) => {
      for (let i = 0; i < item.word.length; i++) {
        const r = item.direction === 'H' ? item.startRow : item.startRow + i;
        const c = item.direction === 'H' ? item.startCol + i : item.startCol;
        const entered = vals[`${r}-${c}`] || '';
        const target = item.word[i] === 'Ü' ? 'Ü' : item.word[i];
        if (entered !== target && entered !== item.word[i]) {
          return false;
        }
      }
      return true;
    });

    if (allCorrect && !isCompleted) {
      setIsCompleted(true);
      sound.victory();
      confetti({ particleCount: 60, spread: 80 });
      onEarnXp(150, '¡Completaste el Crucigrama del Conuco!');
    }
  };

  const giveHint = () => {
    if (!selectedCell) return;
    sound.pop();
    const clues = getCellClues(selectedCell.r, selectedCell.c);
    if (!clues.length) return;
    const clue = clues[0];
    const index = clue.direction === 'H' ? selectedCell.c - clue.startCol : selectedCell.r - clue.startRow;
    const correctLetter = clue.word[index];
    const next = { ...gridValues, [`${selectedCell.r}-${selectedCell.c}`]: correctLetter };
    setGridValues(next);
    verifyCrossword(next);
  };

  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto text-xs pb-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#191033] p-2.5 rounded-2xl border-2 border-[#5be37d]">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={() => {
                sound.btnClick();
                onBack();
              }}
              className="p-1.5 bg-[#2d1b69] rounded-xl text-white active:scale-95"
            >
              <ArrowLeft size={14} />
            </button>
          )}
          <div>
            <span className="text-[#5be37d] font-bold text-[11px] block">CRUCIGRAMA DEL CONUCO</span>
            <span className="text-[#ffd23f] text-[8px]">Escribe las respuestas en Sikuani</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={giveHint}
            className="p-1.5 bg-[#ffd23f] text-black rounded-xl active:scale-95 flex items-center gap-1 font-bold text-[8px]"
            title="Pista"
          >
            <Lightbulb size={12} /> PISTA
          </button>
          <button
            onClick={() => {
              sound.btnClick();
              setGridValues({});
              setIsCompleted(false);
            }}
            className="p-1.5 bg-[#ff4d6d] text-white rounded-xl active:scale-95"
            title="Reiniciar"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Crossword Grid */}
      <div className="bg-[#0b0518] p-3 rounded-3xl border-4 border-[#ffd23f] flex flex-col items-center justify-center shadow-xl">
        <div className="grid grid-cols-7 gap-1 touch-manipulation">
          {Array(ROWS)
            .fill(null)
            .map((_, r) =>
              Array(COLS)
                .fill(null)
                .map((_, c) => {
                  const valid = isCellValid(r, c);
                  if (!valid) {
                    return <div key={`${r}-${c}`} className="w-9 h-9 sm:w-10 sm:h-10 opacity-0" />;
                  }

                  const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                  const value = gridValues[`${r}-${c}`] || '';
                  const clueNumber = CROSSWORD_DATA.find(
                    (item) => item.startRow === r && item.startCol === c
                  )?.id;

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => {
                        sound.btnClick();
                        setSelectedCell({ r, c });
                      }}
                      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all active:scale-90 ${
                        isSelected
                          ? 'bg-[#ffd23f] text-black border-white ring-2 ring-[#ff4d6d]'
                          : 'bg-[#1b1240] text-white border-[#5a2a8a]'
                      }`}
                    >
                      {clueNumber && (
                        <span className="absolute top-0.5 left-1 text-[7px] text-[#4cc9f0] font-bold">
                          {clueNumber}
                        </span>
                      )}
                      {value}
                    </button>
                  );
                })
            )}
        </div>
      </div>

      {/* Clues Card */}
      <div className="bg-[#140b2b] p-2.5 rounded-2xl border-2 border-[#ff9f1c]">
        <span className="text-[#ffd23f] font-bold text-[8px] block mb-1.5">PISTAS DEL CONUCO:</span>
        <div className="space-y-1.5 text-[7.5px] leading-snug">
          {CROSSWORD_DATA.map((item) => (
            <div key={item.id} className="flex items-start gap-1 text-gray-200">
              <span className="bg-[#5a2a8a] text-[#ffd23f] px-1 py-0.5 rounded font-bold shrink-0">
                {item.id} ({item.direction === 'H' ? 'H' : 'V'}):
              </span>
              <span className="break-words">{item.spanishClue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Touch Keyboard */}
      <div className="bg-[#120826] p-2 rounded-2xl border-2 border-[#5a2a8a] space-y-1">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1">
            {row.map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className={`py-1.5 px-2 rounded-lg text-[8px] font-bold border transition-transform active:scale-90 ${
                  char === '⌫'
                    ? 'bg-[#ff4d6d] text-white border-[#ff8fa0]'
                    : char === 'Ü'
                    ? 'bg-[#5be37d] text-black border-white font-extrabold'
                    : 'bg-[#221544] text-white border-[#3d246c] hover:border-[#ffd23f]'
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="bg-[#1b3d22] border-2 border-[#5be37d] p-3 rounded-2xl text-center flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[#5be37d] font-bold text-sm flex items-center gap-1">
            <CheckCircle2 size={16} /> ¡CRUCIGRAMA RESUELTO!
          </span>
          <span className="text-white text-[9px]">
            ¡Eres un verdadero sabedor del conuco y la lengua sikuani!
          </span>
        </div>
      )}
    </div>
  );
};
