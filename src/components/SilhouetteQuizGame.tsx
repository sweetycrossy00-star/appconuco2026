import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../services/sound';
import { renderPixelSprite } from '../utils/pixelRenderer';
import { SIKUANI_WORDS, SikuaniWord } from '../data/sikuaniData';
import { Volume2, Trophy, Flame, Zap, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onEarnXp: (amount: number, reason: string) => void;
  onAnswerCorrect?: () => void;
}

export const SilhouetteQuizGame: React.FC<Props> = ({ onEarnXp, onAnswerCorrect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentWord, setCurrentWord] = useState<SikuaniWord | null>(null);
  const [options, setOptions] = useState<SikuaniWord[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highStreak, setHighStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(true);

  // Filter words that have valid custom procedural sprites
  const eligibleWords = SIKUANI_WORDS.filter((w) =>
    [
      'jetsa', 'newaju', 'bawa', 'dunusi', 'balatunu', 'emairi', 'nonoji', 'aya',
      'mera', 'pabi', 'wabata', 'kote', 'sipali', 'jomokobi', 'tujubu', 'tsonu',
      'owebi', 'newutju', 'dujuai', 'jura', 'jara', 'pubu', 'tolenaito',
      'kaliawirinae', 'tsitsito'
    ].includes(w.id)
  );

  const startNewRound = () => {
    setRevealed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(15);

    // Pick target word
    const target = eligibleWords[Math.floor(Math.random() * eligibleWords.length)];
    setCurrentWord(target);

    // Pick 3 random distractors
    const distractors = eligibleWords.filter((w) => w.id !== target.id);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5).slice(0, 3);
    const roundOptions = [...shuffledDistractors, target].sort(() => Math.random() - 0.5);

    setOptions(roundOptions);
    sound.silhouettePulse();
  };

  useEffect(() => {
    startNewRound();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!gameActive || revealed || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, revealed, gameActive]);

  // Redraw canvas whenever currentWord or revealed changes
  useEffect(() => {
    if (canvasRef.current && currentWord) {
      renderPixelSprite(currentWord.spriteId, canvasRef.current, {
        asSilhouette: !revealed,
        glowColor: revealed ? '#5be37d' : '#ffd23f',
      });
    }
  }, [currentWord, revealed]);

  const handleTimeOut = () => {
    sound.hurt();
    setRevealed(true);
    setIsCorrect(false);
    setStreak(0);
  };

  const handleSelectOption = (word: SikuaniWord) => {
    if (revealed || !currentWord) return;

    setSelectedAnswer(word.id);
    setRevealed(true);

    if (word.id === currentWord.id) {
      setIsCorrect(true);
      sound.correct();
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });

      const points = 100 + streak * 20;
      setScore((s) => s + points);
      setStreak((st) => {
        const next = st + 1;
        if (next > highStreak) setHighStreak(next);
        return next;
      });

      onEarnXp(50, `Silueta: ${word.sikuani}`);
      if (onAnswerCorrect) onAnswerCorrect();
    } else {
      setIsCorrect(false);
      sound.hurt();
      setStreak(0);
    }
  };

  const playPronunciation = () => {
    if (currentWord) {
      sound.sikuaniWordSound(currentWord.sikuani);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 max-w-md mx-auto bg-[#0c061c] border-4 border-[#4cc9f0] pixel-corners text-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-[#1f103d] p-2 border-2 border-[#ffd23f]">
        <div className="flex items-center gap-2">
          <Trophy className="text-[#ffd23f]" size={16} />
          <span className="text-[#ffd23f] font-bold">SILUETAS SIKUANI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#ff9f1c]">
            <Flame size={14} /> Racha: {streak}
          </span>
          <span className="bg-[#5a2a8a] px-2 py-0.5 text-white font-bold border border-[#ffd23f]">
            {score} pts
          </span>
        </div>
      </div>

      {/* Retro Silhouette Display Canvas */}
      <div className="relative bg-[#000000] p-4 border-4 border-[#2d1b69] flex flex-col items-center justify-center crt-overlay overflow-hidden shadow-[inset_0_0_30px_#1a0f30]">
        <div className="absolute top-2 left-2 text-[8px] text-[#ffd23f] flex items-center gap-1">
          <Zap size={10} /> {revealed ? 'FORMA REVELADA' : 'RECONOCE LA FORMA'}
        </div>

        {/* Time Bar */}
        <div className="w-full bg-[#222] h-1.5 absolute top-0 left-0">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft > 5 ? 'bg-[#5be37d]' : 'bg-[#ff4d6d]'
            }`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </div>

        {/* Sprite Silhouette Canvas */}
        <div className="my-2 p-2 bg-[#0d0720]/80 border-2 border-[#ff4d6d] rounded-sm">
          <canvas
            ref={canvasRef}
            width={120}
            height={120}
            className="w-28 h-28 pixel-art"
          />
        </div>

        {/* Revealed Name & Phonetic Info */}
        {revealed && currentWord && (
          <div className="text-center mt-1 animate-fade-in">
            <div className="flex items-center justify-center gap-2">
              <span className="text-base text-[#ffd23f] font-bold tracking-wider">
                {currentWord.sikuani}
              </span>
              <button
                onClick={playPronunciation}
                className="p-1 bg-[#ffd23f] text-black pixel-corners arcade-btn hover:scale-110"
                title="Escuchar pronunciación"
              >
                <Volume2 size={12} />
              </button>
            </div>
            <span className="text-[#9ad2f8] text-[9px] block">
              Significado: <strong className="text-white">{currentWord.spanish}</strong> ({currentWord.pronunciation})
            </span>
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          let btnStyle = 'bg-[#1e1338] text-white hover:bg-[#2e1d54] border-[#4cc9f0]';
          if (revealed) {
            if (opt.id === currentWord?.id) {
              btnStyle = 'bg-[#2e7d32] text-white border-[#81c784] font-bold animate-pulse';
            } else if (opt.id === selectedAnswer) {
              btnStyle = 'bg-[#c62828] text-white border-[#ef9a9a]';
            } else {
              btnStyle = 'opacity-40 bg-[#110a20] text-gray-400 border-gray-700';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt)}
              disabled={revealed}
              className={`p-2.5 text-center border-2 pixel-corners arcade-btn transition-all flex flex-col items-center justify-center gap-0.5 min-h-[50px] ${btnStyle}`}
            >
              <span className="font-bold text-[8.5px] leading-tight break-words max-w-full">
                {opt.sikuani}
              </span>
              <span className="text-[7px] opacity-80 leading-tight">({opt.spanish})</span>
            </button>
          );
        })}
      </div>

      {/* Result & Next Button */}
      {revealed && (
        <div className="bg-[#1f103d] p-2 border-2 border-[#ffd23f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <span className="text-[#5be37d] flex items-center gap-1 font-bold text-[10px]">
                <CheckCircle2 size={14} /> ¡CORRECTO! +{100 + streak * 20} XP
              </span>
            ) : (
              <span className="text-[#ff4d6d] flex items-center gap-1 font-bold text-[10px]">
                <XCircle size={14} /> ¡ERA {currentWord?.sikuani.toUpperCase()}!
              </span>
            )}
          </div>
          <button
            onClick={() => {
              sound.btnClick();
              startNewRound();
            }}
            className="px-3 py-1.5 bg-[#ffd23f] text-black font-bold pixel-corners arcade-btn text-[9px]"
          >
            SIGUIENTE ▶
          </button>
        </div>
      )}

      {/* Cultural Fact Card */}
      {revealed && currentWord?.culturalNote && (
        <div className="bg-[#160d2e] p-2 border-l-4 border-[#ffd23f] text-[8px] text-[#e0e0e0] leading-relaxed">
          <strong className="text-[#ffd23f]">Sabiduría Ancestral:</strong> {currentWord.culturalNote}
        </div>
      )}
    </div>
  );
};
