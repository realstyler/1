"use client";

import React, { useState } from 'react';
import { 
  Wand2, 
  Palette, 
  Home, 
  Sun, 
  Sunrise, 
  Lightbulb, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { mockStyles } from '@/data/mock';

interface Props {
  selectedCount: number;
}

export default function SidebarOptions({ selectedCount }: Props) {
  const [activeTab, setActiveTab] = useState<'Presets' | 'Custom Prompt'>('Presets');
  const [intent, setIntent] = useState<'Enhance' | 'Restyle' | 'Remodel'>('Restyle');
  const [lighting, setLighting] = useState<'Natural' | 'Warm' | 'Ambient'>('Natural');
  const [creativity, setCreativity] = useState<'Subtle' | 'Balanced' | 'Bold'>('Balanced');
  const [selectedAesthetic, setSelectedAesthetic] = useState<string | null>('Coastal');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const aesthetics = ['Modern', 'Coastal', 'Minimal', 'Japandi', 'Industrial', 'Classic', 'Scandi', 'Boho', 'Rustic'];

  return (
    <aside className="w-[360px] h-full shrink-0 flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
      
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white via-white/60 to-transparent pointer-events-none z-10" />

      <div className="flex-1 overflow-y-auto p-7 pb-36 scrollbar-hide relative" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}} />
        
        <h2 className="text-[22px] font-luxury-serif mb-5 tracking-tight mt-2">Style Options</h2>

        {/* Tabs */}
        <div className="flex bg-[#f8f9fa] p-1 rounded-xl mb-7">
          {(['Presets', 'Custom Prompt'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${
                activeTab === tab ? 'bg-white shadow-sm text-black' : 'text-[#8e94a0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Зменшено загальний відступ між секціями з space-y-8 до space-y-6 */}
        <div className="space-y-6">
          {activeTab === 'Presets' ? (
            <>
              {/* Intent Section */}
              <div>
                <label className="text-[12px] font-[700] uppercase tracking-[0.15em] text-[#a1a5ad] block mb-3">Intent</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Enhance', label: 'Enhance', desc: 'Improve quality', icon: Wand2 },
                    { id: 'Restyle', label: 'Restyle', desc: 'Change look', icon: Palette },
                    { id: 'Remodel', label: 'Remodel', desc: 'Show potential', icon: Home }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setIntent(opt.id as any)}
                      className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left h-auto relative ${
                        intent === opt.id ? 'border-[#8ea28d] bg-[#fdfefd]' : 'border-gray-50'
                      }`}
                    >
                      <div className={`mb-2 transition-colors ${intent === opt.id ? 'text-[#8ea28d]' : 'text-[#b1b5bd]'}`}>
                        <opt.icon size={20} strokeWidth={1.5} />
                      </div>
                      <span className="text-[14px] font-semibold text-[#1a1a1a] block leading-tight mb-0.5">{opt.label}</span>
                      <span className={`text-[9px] transition-colors leading-tight whitespace-nowrap ${intent === opt.id ? 'text-[#8ea28d]' : 'text-[#b1b5bd]'}`}>
                        {opt.desc}
                      </span>
                      {intent === opt.id && (
                        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 bg-[#8ea28d] rounded-full flex items-center justify-center">
                          <Check size={8} strokeWidth={4} color="white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lighting Section */}
              <div>
                <label className="text-[12px] font-[700] uppercase tracking-[0.15em] text-[#a1a5ad] block mb-3">Lighting</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Natural', icon: Sun },
                    { id: 'Warm', icon: Sunrise },
                    { id: 'Ambient', icon: Lightbulb }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setLighting(opt.id as any)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                        lighting === opt.id ? 'border-[#8ea28d] bg-[#fdfefd]' : 'border-gray-50'
                      }`}
                    >
                      <div className={`mb-1 transition-colors ${lighting === opt.id ? 'text-[#8ea28d]' : 'text-[#b1b5bd]'}`}>
                        <opt.icon size={22} strokeWidth={1.5} />
                      </div>
                      <span className={`text-[12px] font-bold ${lighting === opt.id ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]'}`}>{opt.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Creativity Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[12px] font-[700] uppercase tracking-[0.15em] text-[#a1a5ad]">Creativity</label>
                  <span className="text-[10px] font-semibold text-[#8ea28d] px-2 py-0.5 rounded bg-[#8ea28d]/10 transition-all">
                    {creativity}
                  </span>
                </div>
                <div className="flex bg-[#f8f9fa] p-1 rounded-xl">
                  {['Subtle', 'Balanced', 'Bold'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setCreativity(level as any)}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        creativity === level ? 'bg-white shadow-sm text-black' : 'text-[#8e94a0]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aesthetic Section */}
              <div>
                <label className="text-[12px] font-[700] uppercase tracking-[0.15em] text-[#a1a5ad] block mb-3">Aesthetic</label>
                <div className="grid grid-cols-3 gap-4">
                  {aesthetics.map((style, index) => {
                    const isSelected = selectedAesthetic === style;
                    const mockImg = mockStyles[index % mockStyles.length].thumbnail;

                    return (
                      <div 
                        key={style} 
                        onClick={() => setSelectedAesthetic(style)}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className={`relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-1.5 border-2 transition-all bg-gray-100 ${
                          isSelected ? 'border-[#8ea28d] shadow-sm' : 'border-transparent group-hover:border-gray-200'
                        }`}>
                          <img 
                            src={mockImg} 
                            alt={style} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#8ea28d] rounded-full flex items-center justify-center shadow-sm">
                              <Check size={12} strokeWidth={4} color="white" />
                            </div>
                          )}
                        </div>
                        <span className={`text-[11px] font-bold transition-colors ${
                          isSelected ? 'text-[#8ea28d]' : 'text-[#5a5f66]'
                        }`}>
                          {style}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Custom Prompt Section */
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[11px] font-[800] uppercase tracking-[0.15em] text-[#a1a5ad] block mb-3">
                Describe your vision
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Modern industrial loft with large windows and warm oak flooring..."
                className="w-full h-40 p-4 bg-[#f8f9fa] border-2 border-transparent rounded-2xl text-sm text-[#1a1a1a] placeholder:text-[#b1b5bd] focus:bg-white focus:border-[#8ea28d]/30 focus:outline-none transition-all resize-none shadow-inner"
              />
              <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                <p className="text-[11px] text-blue-600/80 leading-relaxed italic">
                  Tip: Be specific about materials, lighting, and furniture styles for the best results.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/85 to-white/70 pt-8 z-10 border-t border-gray-100/60 backdrop-blur-[2px]">
        <button
          disabled={selectedCount === 0}
          className={`w-full py-4 rounded-[20px] font-bold text-[15px] flex items-center justify-center gap-2.5 transition-all shadow-xl active:scale-[0.98] ${
            selectedCount > 0 
              ? 'bg-[#2d2d2d] text-white hover:bg-black' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          <Sparkles 
            size={18} 
            strokeWidth={2} 
            className={selectedCount > 0 ? 'text-[#e17a5f]' : 'text-gray-400'} 
          />
          
          Restyle {selectedCount > 0 ? `${selectedCount} Photo${selectedCount > 1 ? 's' : ''}` : 'Photos'}
        </button>
        
        <p className="text-center text-[9px] text-[#b1b5bd] mt-3.5 font-medium uppercase tracking-[0.1em]">
          Est. time: ~45s
        </p>
      </div>
    </aside>
  );
}