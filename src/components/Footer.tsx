import React from 'react';
import { Sparkles, Shield, HeartHandshake } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface FooterProps {
  onOpenHowItWorks: () => void;
  onOpenPrivacy: () => void;
  onOpenSafety: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenHowItWorks,
  onOpenPrivacy,
  onOpenSafety,
}) => {
  return (
    <footer className="w-full border-t border-white/5 bg-space-950/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-8 mt-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand info */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            <span className="font-display font-bold text-white tracking-wide">
              MOODAKINATOR AI
            </span>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-slate-400">
            Akinator for Emotions & Self-Discovery
          </span>
        </div>

        {/* Center: Non-diagnostic disclaimer */}
        <div className="text-center text-[11px] text-slate-400 max-w-md">
          Not a substitute for clinical psychological or medical diagnosis. For personal insight and reflection.
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => {
              sound.playHover();
              onOpenHowItWorks();
            }}
            className="hover:text-cyan-300 transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => {
              sound.playHover();
              onOpenPrivacy();
            }}
            className="hover:text-cyan-300 transition-colors"
          >
            Privacy
          </button>
          <button
            onClick={() => {
              sound.playHover();
              onOpenSafety();
            }}
            className="hover:text-rose-300 text-rose-400/80 transition-colors flex items-center gap-1"
          >
            <HeartHandshake size={13} />
            <span>Crisis Help</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
