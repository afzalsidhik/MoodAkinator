import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoodOrbCanvas } from './3d/MoodOrbCanvas';
import { MOODS } from '../data/moods';
import { MoodMeta } from '../types';
import { sound } from '../services/soundEffects';
import { Sparkles, ArrowRight, HelpCircle, Shield, Brain, Cpu, Compass } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
  onOpenHowItWorks: () => void;
  onOpenPrivacy: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStart,
  onOpenHowItWorks,
  onOpenPrivacy,
}) => {
  const [activePreviewMood, setActivePreviewMood] = useState<MoodMeta>(MOODS.anxious);

  const previewMoods: MoodMeta[] = [
    MOODS.stressed,
    MOODS.anxious,
    MOODS.drained,
    MOODS.lonely,
    MOODS.motivated,
    MOODS.happy,
  ];

  const handleStart = () => {
    sound.playSelect();
    onStart();
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-12">
      {/* Background Glows & Grids */}
      <div className="absolute inset-0 grid-background opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 shadow-glow-cyan text-xs font-mono text-cyan-300"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>MOODAKINATOR 2.0 • AKINATOR FOR EMOTIONS</span>
        <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
          Adaptive AI
        </span>
      </motion.div>

      {/* Main Grid: Left copy, Right 3D Orb */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto py-6">
        {/* Left Column: Typography & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.08]">
              Understand what you&apos;re{' '}
              <span className="text-gradient-aurora drop-shadow-sm">feeling.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              MOODAKINATOR AI explores the hidden patterns behind your emotions through an intelligent, adaptive conversation.
            </p>
          </div>

          {/* Interactive Mood Orb Preview Selector */}
          <div className="w-full pt-2">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan-400" /> Preview Neural Resonance:
            </p>
            <div className="flex flex-wrap gap-2">
              {previewMoods.map((m) => {
                const isSelected = activePreviewMood.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      sound.playHover();
                      setActivePreviewMood(m);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all duration-300 ${
                      isSelected
                        ? 'glass-panel text-white border-cyan-400 shadow-glow-cyan scale-105'
                        : 'bg-space-900/60 text-slate-400 border border-white/5 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-4">
            <button
              onClick={handleStart}
              className="relative group px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-slate-950 font-bold text-base tracking-wide flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(0,242,254,0.4)] hover:shadow-[0_0_50px_rgba(0,242,254,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-slate-950 font-extrabold uppercase font-display tracking-wider">
                Start Emotional Analysis
              </span>
              <ArrowRight
                size={20}
                className="text-slate-950 group-hover:translate-x-1.5 transition-transform"
              />
            </button>

            <button
              onClick={() => {
                sound.playHover();
                onOpenHowItWorks();
              }}
              className="px-6 py-4 rounded-2xl glass-panel text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white border border-white/10 hover:border-cyan-400/40 transition-all duration-200"
            >
              <HelpCircle size={17} className="text-cyan-400" />
              <span>How It Works</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 w-full text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-cyan-400 flex-shrink-0" />
              <span>Adaptive Narrowing</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-purple-400 flex-shrink-0" />
              <span>Pattern Reasoning</span>
            </div>
            <div
              onClick={onOpenPrivacy}
              className="flex items-center gap-2 cursor-pointer hover:text-cyan-300 transition-colors"
            >
              <Shield size={16} className="text-emerald-400 flex-shrink-0" />
              <span>100% Private Storage</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Glowing Emotional Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 relative flex items-center justify-center min-h-[420px] lg:min-h-[520px]"
        >
          {/* Background Ambient Glow Disc */}
          <div
            className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full filter blur-[70px] opacity-40 transition-colors duration-700 pointer-events-none"
            style={{ backgroundColor: activePreviewMood.primaryColor }}
          />

          {/* Three.js Orb Canvas */}
          <div className="relative w-full h-[400px] sm:h-[480px]">
            <MoodOrbCanvas mood={activePreviewMood} size="hero" interactive={true} />
          </div>

          {/* Floating Live Emotion Pill Card */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-2 sm:bottom-4 left-4 sm:left-8 glass-panel p-3.5 rounded-2xl border border-cyan-500/30 shadow-glass-card flex items-center gap-3 backdrop-blur-xl"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner"
              style={{ backgroundColor: `${activePreviewMood.primaryColor}25` }}
            >
              {activePreviewMood.emoji}
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-300 flex items-center gap-1">
                <span>Neural Resonance</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <div className="text-sm font-bold text-white">
                {activePreviewMood.label}
              </div>
            </div>
          </motion.div>

          {/* Compass Node Pill */}
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-2 right-4 sm:right-8 glass-panel px-3 py-2 rounded-xl border border-purple-500/30 text-xs font-mono text-purple-300 flex items-center gap-2"
          >
            <Compass size={14} className="text-purple-400 animate-spin-slow" />
            <span>8 Signal Dimensions</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Subtitle / Tagline */}
      <div className="relative z-10 text-center text-xs font-mono text-slate-400 tracking-wider">
        “Your mood has a story. Let&apos;s uncover it.”
      </div>
    </div>
  );
};
