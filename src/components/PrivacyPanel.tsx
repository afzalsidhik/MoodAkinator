import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../services/soundEffects';
import { ShieldCheck, Lock, Trash2, Check, AlertTriangle } from 'lucide-react';

interface PrivacyPanelProps {
  onClose: () => void;
  onClearData: () => void;
}

export const PrivacyPanel: React.FC<PrivacyPanelProps> = ({
  onClose,
  onClearData,
}) => {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    sound.playSelect();
    onClearData();
    setCleared(true);
    setTimeout(() => {
      setCleared(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-glass-card space-y-6 text-left"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                Your emotions belong to you.
              </h2>
              <p className="text-xs text-cyan-300 font-mono">100% Client-Side Privacy Guarantee</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playHover();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            MOODAKINATOR AI is architected with strict <strong className="text-white">zero-telemetry, client-first principles</strong>.
          </p>
          <div className="p-3.5 rounded-xl bg-space-900/80 border border-white/5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-mono">
              <Lock size={14} />
              <span>Local Browser Persistence Only</span>
            </div>
            <p className="text-slate-400">
              All questions, emotional answers, and timeline histories are stored strictly inside your browser’s local storage. No data is sent to external servers or advertisers.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-space-900/80 border border-white/5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-mono">
              <AlertTriangle size={14} />
              <span>Non-Diagnostic Self-Reflection</span>
            </div>
            <p className="text-slate-400">
              This application helps explore contributing patterns through conversation. It is not an assessment or diagnosis for clinical conditions.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
          <button
            onClick={handleClear}
            disabled={cleared}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              cleared
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {cleared ? <Check size={14} /> : <Trash2 size={14} />}
            <span>{cleared ? 'Data Erased' : 'Clear My Data'}</span>
          </button>

          <button
            onClick={() => {
              sound.playHover();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-panel text-xs text-white font-mono font-semibold hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
