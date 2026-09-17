import React, { useState, useEffect } from 'react';
import { sound } from '../services/soundEffects';
import { Volume2, VolumeX, History, Shield, LifeBuoy, Sparkles } from 'lucide-react';

interface NavbarProps {
  onGoHome: () => void;
  onOpenHistory: () => void;
  onOpenPrivacy: () => void;
  onOpenSafety: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onOpenHistory,
  onOpenPrivacy,
  onOpenSafety,
  historyCount,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playSelect();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-space-950/70 border-b border-white/5 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => {
            sound.playHover();
            onGoHome();
          }}
          className="flex items-center gap-3 group text-left"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 p-[1.5px] shadow-glow-cyan group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-space-950 rounded-[10px] flex items-center justify-center">
              <Sparkles size={18} className="text-cyan-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                MOODAKINATOR
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/30">
                AI
              </span>
            </div>
            <span className="hidden sm:block text-[10px] font-mono text-slate-400 -mt-0.5">
              Akinator for Emotions
            </span>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
              isMuted
                ? 'bg-space-900 text-slate-500 border-white/5 hover:text-slate-300'
                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-glow-cyan'
            }`}
            title={isMuted ? 'Unmute Futuristic Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="hidden md:inline font-mono text-[11px]">
              {isMuted ? 'Muted' : 'Audio On'}
            </span>
          </button>

          {/* History Button */}
          <button
            onClick={() => {
              sound.playHover();
              onOpenHistory();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl glass-panel text-slate-300 hover:text-white border border-white/10 hover:border-cyan-400/30 transition-all text-xs font-mono flex items-center gap-1.5"
            title="View Emotion Timeline"
          >
            <History size={15} className="text-cyan-400" />
            <span className="hidden sm:inline">Timeline</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-400 text-space-950 font-bold text-[10px] flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Privacy Button */}
          <button
            onClick={() => {
              sound.playHover();
              onOpenPrivacy();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl glass-panel text-slate-300 hover:text-white border border-white/10 hover:border-cyan-400/30 transition-all text-xs font-mono flex items-center gap-1.5"
            title="Client Privacy Policy"
          >
            <Shield size={15} className="text-emerald-400" />
            <span className="hidden md:inline">Privacy</span>
          </button>

          {/* SOS Safety Help Button */}
          <button
            onClick={() => {
              sound.playHover();
              onOpenSafety();
            }}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all text-xs font-mono font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
            title="Crisis Help & Hotlines"
          >
            <LifeBuoy size={15} className="text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">Need Help?</span>
          </button>
        </div>
      </div>
    </header>
  );
};
