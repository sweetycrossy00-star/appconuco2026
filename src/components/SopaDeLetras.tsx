import React, { useState, useEffect } from 'react';
import { sound } from '../services/sound';
import { Sparkles, CheckCircle2, RotateCcw, Volume2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordSearchWord {
  sikuani: string;
  spanish: string;
  found: boolean;
  color: string;
}

interface Cell {
  letter: string;
  row: number;
  col: number;
  highlighted: boolean;
  foundColor?: string;
}

interface Props {
  onEarnXp: (amount: number, reason: string) => void;
  onBack?: () => void;
}

const WORDS_LIST: { sikuani: string; spanish: string; color: string }[] = [
  { sikuani: 'JETSA', spanish: 'Maíz', color: '#ffd23f' },
  { sikuani: 'MERA', spanish: 'Agua', color: '#4cc9f0' },
  { sikuani: 'PABI', spanish: 'Conuco', color: '#5be37d' },
  { sikuani: 'JOMO', spanish: 'Culebra', color: '#ff4d6d' },
  { sikuani: 'UBA', spanish: 'Sembrar', color: '#ff9f1c' },
  { sikuani: 'PERI', spanish: 'Casabe', color: '#b388ff' },
];

const GRID_SIZE = 8;

export const SopaDeLetras: React.FC<Props> = ({ onEarnXp, onBack }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [words, setWords] = useState<WordSearchWord[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [isWon, setIsWon] = useState(false);

  // Generate word search board
  const generateBoard = () => {
    setIsWon(false);
    setSelectedCells([]);

    const emptyGrid: string[][] = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(''));

    const directions = [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
      [1, 1],  // Diagonal
    ];

    const currentWords: WordSearchWord[] = WORDS_LIST.map((w) => ({
      ...w,
      found: false,
    }));

    // Place words in grid
    currentWords.forEach((wordObj) => {
      const word = wordObj.sikuani;
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        attempts++;
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const [dr, dc] = dir;
        const maxR = dr === 0 ? GRID_SIZE - 1 : GRID_SIZE - word.length;
        const maxC = dc === 0 ? GRID_SIZE - 1 : GRID_SIZE - word.length;

        if (maxR < 0 || maxC < 0) continue;

        const startR = Math.floor(Math.random() * (maxR + 1));
        const startC = Math.floor(Math.random() * (maxC + 1));

        // Check if word fits
        let canFit = true;
        for (let i = 0; i < word.length; i++) {
          const r = startR + dr * i;
          const c = startC + dc * i;
          if (emptyGrid[r][c] !== '' && emptyGrid[r][c] !== word[i]) {
            canFit = false;
            break;
          }
        }

        if (canFit) {
          for (let i = 0; i < word.length; i++) {
            const r = startR + dr * i;
            const c = startC + dc * i;
            emptyGrid[r][c] = word[i];
          }
          placed = true;
        }
      }
    });

    // Fill remaining cells with random letters
    const alphabet = 'ABCDEIJKLMNOPRSTUW';
    const cellGrid: Cell[][] = emptyGrid.map((row, r) =>
      row.map((char, c) => ({
        letter: char || alphabet[Math.floor(Math.random() * alphabet.length)],
        row: r,
        col: c,
        highlighted: false,
      }))
    );

    setGrid(cellGrid);
    setWords(currentWords);
  };

  useEffect(() => {
    generateBoard();
  }, []);

  const handleCellClick = (r: number, c: number) => {
    sound.btnClick();
    const cellKey = `${r}-${c}`;
    const alreadySelected = selectedCells.some((cell) => cell.row === r && cell.col === c);

    let nextSelected: { row: number; col: number }[];
    if (alreadySelected) {
      nextSelected = selectedCells.filter((cell) => !(cell.row === r && cell.col === c));
    } else {
      nextSelected = [...selectedCells, { row: r, col: c }];
    }

    setSelectedCells(nextSelected);

    // Form word from selected cells
    const formedWord = nextSelected.map((pos) => grid[pos.row][pos.col].letter).join('');
    const reversedWord = formedWord.split('').reverse().join('');

    const matchedWord = words.find(
      (w) => (!w.found && w.sikuani === formedWord) || (!w.found && w.sikuani === reversedWord)
    );

    if (matchedWord) {
      sound.correct();
      confetti({ particleCount: 30, spread: 50 });
      onEarnXp(50, `Sopa de letras: ${matchedWord.sikuani}`);

      // Mark cells on grid with color
      setGrid((prev) =>
        prev.map((row) =>
          row.map((cell) => {
            const isInFound = nextSelected.some((p) => p.row === cell.row && p.col === cell.col);
            return isInFound ? { ...cell, foundColor: matchedWord.color } : cell;
          })
        )
      );

      // Update words list
      const updatedWords = words.map((w) =>
        w.sikuani === matchedWord.sikuani ? { ...w, found: true } : w
      );
      setWords(updatedWords);
      setSelectedCells([]);

      // Check win condition
      if (updatedWords.every((w) => w.found)) {
        setIsWon(true);
        sound.victory();
        confetti({ particleCount: 70, spread: 80 });
        onEarnXp(120, '¡Completaste la Sopa de Letras Sikuani!');
      }
    }
  };

  const playPronounce = (word: string) => {
    sound.sikuaniWordSound(word);
  };

  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto text-xs pb-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#191033] p-2.5 rounded-2xl border-2 border-[#ffd23f]">
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
            <span className="text-[#ffd23f] font-bold text-[11px] block">SOPA DE LETRAS</span>
            <span className="text-[#4cc9f0] text-[8px]">Encuentra palabras en Sikuani</span>
          </div>
        </div>
        <button
          onClick={() => {
            sound.btnClick();
            generateBoard();
          }}
          className="p-1.5 bg-[#ff4d6d] text-white rounded-xl active:scale-95"
          title="Reiniciar tablero"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Target Words Card */}
      <div className="bg-[#140b2b] p-2.5 rounded-2xl border-2 border-[#4cc9f0]">
        <span className="text-[#9ad2f8] text-[7.5px] font-bold block mb-1.5 text-center">
          PALABRAS POR ENCONTRAR:
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {words.map((w, idx) => (
            <div
              key={idx}
              onClick={() => playPronounce(w.sikuani)}
              className={`p-1 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[38px] ${
                w.found
                  ? 'bg-[#1b3d22] border-[#5be37d] text-[#5be37d] opacity-90'
                  : 'bg-[#221345] border-[#5a2a8a] text-white hover:border-[#ffd23f]'
              }`}
            >
              <span className={`font-bold text-[8px] block truncate max-w-full ${w.found ? 'line-through' : ''}`}>
                {w.sikuani}
              </span>
              <span className="text-[6.5px] text-[#ccc] block truncate max-w-full">({w.spanish})</span>
            </div>
          ))}
        </div>
      </div>

      {/* 8x8 Grid Container */}
      <div className="bg-[#0b0518] p-3 rounded-3xl border-4 border-[#ff4d6d] shadow-2xl flex flex-col items-center justify-center">
        <div className="grid grid-cols-8 gap-1.5 touch-manipulation">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selectedCells.some((p) => p.row === r && p.col === c);
              let cellStyle = 'bg-[#1a0f38] text-white border-[#3d246c]';

              if (cell.foundColor) {
                cellStyle = `border-[#ffffff] font-bold text-black`;
              } else if (isSelected) {
                cellStyle = 'bg-[#ffd23f] text-black border-[#ffffff] scale-105 font-bold';
              }

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  style={cell.foundColor ? { backgroundColor: cell.foundColor } : {}}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center text-[11px] font-bold transition-transform active:scale-90 shadow-sm ${cellStyle}`}
                >
                  {cell.letter}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Win Banner */}
      {isWon && (
        <div className="bg-[#1b3d22] border-2 border-[#5be37d] p-3 rounded-2xl text-center flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[#5be37d] font-bold text-sm flex items-center gap-1">
            <CheckCircle2 size={16} /> ¡EXCELENTE TRABAJO!
          </span>
          <span className="text-white text-[9px]">
            Has descubierto todas las palabras sikuani de la sopa de letras.
          </span>
          <button
            onClick={generateBoard}
            className="px-4 py-2 bg-[#5be37d] text-black font-bold rounded-xl active:scale-95 text-[9px]"
          >
            JUGAR OTRA VEZ
          </button>
        </div>
      )}
    </div>
  );
};
