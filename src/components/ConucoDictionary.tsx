import React, { useState } from 'react';
import { SIKUANI_WORDS, SikuaniWord } from '../data/sikuaniData';
import { sound } from '../services/sound';
import { renderPixelSprite } from '../utils/pixelRenderer';
import { Search, Volume2, BookOpen, Sparkles, Filter } from 'lucide-react';

interface Props {
  onLearnTerm?: (termId: string) => void;
}

export const ConucoDictionary: React.FC<Props> = ({ onLearnTerm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedWord, setSelectedWord] = useState<SikuaniWord | null>(null);

  const categories = [
    { id: 'all', label: 'TODO' },
    { id: 'conuco', label: 'CONUCO & PLANTAS' },
    { id: 'herramientas', label: 'HERRAMIENTAS' },
    { id: 'naturaleza', label: 'AGUA & SELVA' },
    { id: 'animales', label: 'ANIMALES' },
    { id: 'acciones', label: 'ACCIONES' },
  ];

  const filteredWords = SIKUANI_WORDS.filter((word) => {
    const matchesCategory = activeCategory === 'all' || word.category === activeCategory;
    const matchesSearch =
      word.sikuani.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.spanish.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectWord = (word: SikuaniWord) => {
    sound.btnClick();
    setSelectedWord(word);
    sound.sikuaniWordSound(word.sikuani);
    if (onLearnTerm) onLearnTerm(word.id);
  };

  return (
    <div className="flex flex-col gap-3 p-3 max-w-md mx-auto bg-[#0b0618] border-4 border-[#ffd23f] pixel-corners text-xs">
      {/* Header */}
      <div className="bg-[#1f103d] p-2 border-2 border-[#ff4d6d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="text-[#ffd23f]" size={16} />
          <span className="text-[#ffd23f] font-bold">DICCIONARIO SIKUANI</span>
        </div>
        <span className="text-[#4cc9f0] text-[9px]">{filteredWords.length} TÉRMINOS</span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 text-[#ffd23f]" size={14} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="BUSCAR EN SIKUANI O ESPAÑOL..."
          className="w-full bg-[#180e30] border-2 border-[#5a2a8a] pl-8 pr-3 py-2 text-white placeholder-gray-400 pixel-corners focus:outline-none focus:border-[#ffd23f] text-[9px]"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              sound.btnClick();
            }}
            className={`px-2 py-1 text-[8px] whitespace-nowrap pixel-corners arcade-btn ${
              activeCategory === cat.id
                ? 'bg-[#ff4d6d] text-white font-bold'
                : 'bg-[#1b1240] text-gray-300 hover:bg-[#2e1d54]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Words Grid / List */}
      <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
        {filteredWords.map((word) => (
          <button
            key={word.id}
            onClick={() => handleSelectWord(word)}
            className="p-2 bg-[#160d2e] border-2 border-[#3d246c] pixel-corners arcade-btn text-left hover:border-[#ffd23f] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[#ffd23f] font-bold text-[10px] block truncate">
                  {word.sikuani}
                </span>
                <Volume2 size={10} className="text-[#4cc9f0]" />
              </div>
              <span className="text-white text-[9px] block truncate">{word.spanish}</span>
            </div>
            <span className="text-[7px] text-[#9ad2f8] mt-1 uppercase opacity-75">
              {word.category}
            </span>
          </button>
        ))}
      </div>

      {/* Detailed Word Modal / Drawer */}
      {selectedWord && (
        <div className="bg-[#1f103d] border-2 border-[#5be37d] p-3 pixel-corners mt-1 flex flex-col gap-2 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#3d246c] pb-2">
            <div>
              <span className="text-[#ffd23f] font-bold text-sm block">
                {selectedWord.sikuani}
              </span>
              <span className="text-white text-[10px]">
                Español: <strong>{selectedWord.spanish}</strong>
              </span>
            </div>
            <button
              onClick={() => sound.sikuaniWordSound(selectedWord.sikuani)}
              className="p-2 bg-[#ffd23f] text-black pixel-corners arcade-btn flex items-center gap-1 text-[8px]"
            >
              <Volume2 size={12} /> ESCUCHAR
            </button>
          </div>

          <div className="text-[9px] text-[#e0e0e0] leading-relaxed">
            <p>{selectedWord.description}</p>
            <div className="mt-1 text-[#9ad2f8]">
              <strong>Pronunciación fonética:</strong> [{selectedWord.pronunciation}]
            </div>
          </div>

          {selectedWord.culturalNote && (
            <div className="bg-[#0b0618] p-2 border-l-2 border-[#ff4d6d] text-[8px] text-[#ffd23f] leading-snug">
              <strong>Contexto Cultural Sikuani:</strong> {selectedWord.culturalNote}
            </div>
          )}

          <button
            onClick={() => setSelectedWord(null)}
            className="w-full py-1.5 bg-[#2d1b69] text-white text-[8px] font-bold pixel-corners arcade-btn text-center mt-1"
          >
            CERRAR DETALLES
          </button>
        </div>
      )}
    </div>
  );
};
