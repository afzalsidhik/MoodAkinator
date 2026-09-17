import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOOD_LIST, MOODS } from '../data/moods';
import { MoodMeta } from '../types';
import { sound } from '../services/soundEffects';
import { ArrowLeft, Sparkles, Send, HelpCircle } from 'lucide-react';

interface MoodSelectorProps {
  onSelectMood: (mood: MoodMeta, customText?: string) => void;
  onBack: () => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  onSelectMood,
  onBack,
}) => {
  const [hoveredMood, setHoveredMood] = useState<MoodMeta | null>(null);
  const [customText, setCustomText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleSelect = (mood: MoodMeta) => {
    sound.playSelect();
    onSelectMood(mood);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    sound.playSelect();

    // Auto-detect a base theme from keywords or default to custom mood meta
    const textLower = customText.toLowerCase();
    let detectedMood = MOODS.custom;
    if (textLower.includes('stress') || textLower.includes('overwhelm') || textLower.includes('exam')) {
      detectedMood = { ...MOODS.stressed, label: `Custom: ${customText.slice(0, 30)}` };
    } else if (textLower.includes('tired') || textLower.includes('drain') || textLower.includes('sleep')) {
      detectedMood = { ...MOODS.drained, label: `Custom: ${customText.slice(0, 30)}` };
    } else if (textLower.includes('anxious') || textLower.includes('worry') || textLower.includes('panic')) {
      detectedMood = { ...MOODS.anxious, label: `Custom: ${customText.slice(0, 30)}` };
    } else if (textLower.includes('lonely') || textLower.includes('alone') || textLower.includes('miss')) {
      detectedMood = { ...MOODS.lonely, label: `Custom: ${customText.slice(0, 30)}` };
    } else if (textLower.includes('happy') || textLower.includes('great') || textLower.includes('good')) {
      detectedMood = { ...MOODS.happy, label: `Custom: ${customText.slice(0, 30)}` };
    }

    onSelectMood(detectedMood, customText);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-8">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          onClick={() => {
            sound.playHover();
            onBack();
          }}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors font-mono"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Step 01 / 03: Emotional Baseline</span>
        </div>
      </div>

      {/* Main Prompt */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Where is your <span className="text-gradient-cyan-purple">energy</span> right now?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Select the mood that feels closest to your current experience, or describe it in your own words.
        </p>
      </div>

      {/* Mood Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full mb-8">
        {MOOD_LIST.map((mood) => {
          const isHovered = hoveredMood?.id === mood.id;

          return (
            <motion.button
              key={mood.id}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => {
                sound.playHover();
                setHoveredMood(mood);
              }}
              onHoverEnd={() => setHoveredMood(null)}
              onClick={() => handleSelect(mood)}
              className="relative group p-4 sm:p-5 rounded-2xl glass-panel text-left flex flex-col justify-between min-h-[140px] sm:min-h-[160px] border border-white/5 hover:border-cyan-400/40 transition-all duration-300 shadow-glass-card overflow-hidden"
              style={{
                boxShadow: isHovered
                  ? `0 12px 30px -5px ${mood.primaryColor}40, inset 0 1px 0 rgba(255,255,255,0.2)`
                  : undefined,
              }}
            >
              {/* Dynamic Glow Aura */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full filter blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: mood.primaryColor }}
              />

              <div className="flex items-start justify-between w-full">
                <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                  {mood.emoji}
                </span>
                <span
                  className="w-2 h-2 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: mood.primaryColor }}
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                  {mood.label.split(' ')[0]}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {mood.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Mood Description Panel */}
      <div className="w-full max-w-3xl glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 shadow-glass-card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles size={16} className="text-cyan-400" />
            <span>Or describe your mood in your own words</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Natural Language Engine</span>
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. I feel a strange mix of feeling accomplished about my project, but anxious about tomorrow's placement interview and guilty for relaxing..."
              rows={3}
              className="w-full bg-space-900/80 border border-white/10 focus:border-cyan-400/80 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-slate-400 italic">
              AI will extract nuanced emotional dimensions from your words.
            </p>
            <button
              type="submit"
              disabled={!customText.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-glow-cyan transition-all"
            >
              <span>Analyze Custom Mood</span>
              <Send size={13} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
