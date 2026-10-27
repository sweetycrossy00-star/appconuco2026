import React, { useState, useEffect } from 'react';
import { sound } from '../services/sound';
import { SIKUANI_WORDS, SikuaniWord } from '../data/sikuaniData';
import { Heart, Volume2, RotateCcw, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onEarnXp: (amount: number, reason: string) => void;
  onBack?: () => void;
}

export const AhorcadoSabana: React.FC<Props> = ({ onEarnXp, onBack }) => {
  const [currentWord, setCurrentWord] = useState<SikuaniWord | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const MAX_MISTAKES = 5;

  const KEYBOARD = [
    ['A', 'B', 'D', 'E', 'F', 'I', 'J'],
    ['K', 'L', 'M', 'N', 'O', 'P', 'R'],
    ['S', 'T', 'U', 'Ü', 'W', 'Y'],
  ];

  const pickNewWord = () => {
    const word = SIKUANI_WORDS[Math.floor(Math.random() * SIKUANI_WORDS.length)];
    // Normalize word to uppercase letters only (strip parenthesis)
    const cleanWord = word.sikuani.split(' ')[0].toUpperCase();
    setCurrentWord({ ...word, sikuani: cleanWord });
    setGuessedLetters([]);
    setMistakes(0);
  };

  useEffect(() => {
    pickNewWord();
  }, []);

  if (!currentWord) return null;

  const targetLetters = currentWord.sikuani.split('');
  const isWon = targetLetters.every((char) => guessedLetters.includes(char));
  const isLost = mistakes >= MAX_MISTAKES;

  const handleGuess = (char: string) => {
    if (isWon || isLost || guessedLetters.includes(char)) return;

    sound.btnClick();
    const nextGuessed = [...guessedLetters, char];
    setGuessedLetters(nextGuessed);

    if (targetLetters.includes(char)) {
      sound.pop();
      if (targetLetters.every((c) => nextGuessed.includes(c))) {
        sound.victory();
        confetti({ particleCount: 50, spread: 70 });
        onEarnXp(80, `Adivinaste: ${currentWord.sikuani}`);
      }
    } else {
      sound.hurt();
      setMistakes((m) => m + 1);
    }
  };

  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto text-xs pb-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#191033] p-2.5 rounded-2xl border-2 border-[#ff9f1c]">
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
            <span className="text-[#ffd23f] font-bold text-[11px] block">ADIVINA LA PALABRA</span>
            <span className="text-[#5be37d] text-[8px]">Protege a Jomokobi</span>
          </div>
        </div>
        {/* Lives / Leaves */}
        <div className="flex items-center gap-1">
          {Array(MAX_MISTAKES)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                className={`text-sm transition-all ${
                  i < MAX_MISTAKES - mistakes ? 'text-[#ff4d6d]' : 'text-gray-600 opacity-40'
                }`}
              >
                ❤️
              </span>
            ))}
        </div>
      </div>

      {/* Scenic Pixelart Mascot Card */}
      <div className="bg-[#0b0518] p-3 rounded-3xl border-4 border-[#5be37d] flex flex-col items-center justify-center text-center shadow-lg">
        {/* Mascot / Scene */}
        <div className="text-4xl my-2">
          {isWon ? '🎉🦫✨' : isLost ? '🌧️🦫💦' : mistakes > 2 ? '⛅🦫' : '☀️🦫🌿'}
        </div>

        {/* Clue Category & Spanish */}
        <span className="bg-[#2b1854] text-[#4cc9f0] px-2 py-0.5 rounded-full text-[8px] font-bold uppercase mb-1">
          {currentWord.category}
        </span>
        <span className="text-white text-[10px] font-bold mb-3">
          Significado: <strong className="text-[#ffd23f]">{currentWord.spanish}</strong>
        </span>

        {/* Word Mystery Letter Slots */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-2">
          {targetLetters.map((char, idx) => {
            const revealed = guessedLetters.includes(char) || isLost;
            return (
              <div
                key={idx}
                className={`w-9 h-11 rounded-xl border-2 flex items-center justify-center text-sm font-bold shadow-md ${
                  revealed
                    ? 'bg-[#1e1338] text-[#ffd23f] border-[#ffd23f]'
                    : 'bg-[#130926] border-[#4cc9f0] text-transparent'
                }`}
              >
                {revealed ? char : '_'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Win / Loss Announcement */}
      {isWon && (
        <div className="bg-[#1b3d22] border-2 border-[#5be37d] p-3 rounded-2xl text-center flex items-center justify-between">
          <div className="text-left">
            <span className="text-[#5be37d] font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 size={14} /> ¡PALABRA ACERTADA!
            </span>
            <span className="text-[8px] text-gray-300 block">{currentWord.description}</span>
          </div>
          <button
            onClick={() => sound.sikuaniWordSound(currentWord.sikuani)}
            className="p-2 bg-[#ffd23f] text-black rounded-xl active:scale-95"
            title="Escuchar"
          >
            <Volume2 size={14} />
          </button>
        </div>
      )}

      {isLost && (
        <div className="bg-[#3d1b1b] border-2 border-[#ff4d6d] p-3 rounded-2xl text-center flex items-center justify-between">
          <div className="text-left">
            <span className="text-[#ff4d6d] font-bold text-[10px] flex items-center gap-1">
              <XCircle size={14} /> ERA: {currentWord.sikuani}
            </span>
            <span className="text-[8px] text-gray-300 block">{currentWord.description}</span>
          </div>
          <button
            onClick={() => {
              sound.btnClick();
              pickNewWord();
            }}
            className="px-3 py-1.5 bg-[#ffd23f] text-black font-bold rounded-xl active:scale-95 text-[8px]"
          >
            OTRA VEZ
          </button>
        </div>
      )}

      {/* Touch Keyboard */}
      <div className="bg-[#120826] p-2.5 rounded-2xl border-2 border-[#5a2a8a] space-y-1">
        {KEYBOARD.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1">
            {row.map((char) => {
              const used = guessedLetters.includes(char);
              return (
                <button
                  key={char}
                  onClick={() => handleGuess(char)}
                  disabled={used || isWon || isLost}
                  className={`py-2 px-2.5 rounded-xl text-[9px] font-bold border transition-transform active:scale-90 ${
                    used
                      ? 'opacity-30 bg-gray-800 border-gray-700 text-gray-500'
                      : char === 'Ü'
                      ? 'bg-[#5be37d] text-black border-white font-extrabold'
                      : 'bg-[#221544] text-white border-[#3d246c] hover:border-[#ffd23f]'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Next Word Button */}
      {(isWon || isLost) && (
        <button
          onClick={() => {
            sound.btnClick();
            pickNewWord();
          }}
          className="w-full py-3 bg-[#ffd23f] text-black font-bold rounded-2xl text-[10px] active:scale-95 shadow-lg flex items-center justify-center gap-1.5"
        >
          SIGUIENTE PALABRA SIKUANI ▶
        </button>
      )}
    </div>
  );
};
