import React from 'react';
import { motion } from 'framer-motion';
import { SessionHistoryItem } from '../types';
import { sound } from '../services/soundEffects';
import { Calendar, Trash2, ArrowLeft, ArrowUpRight, Sparkles, Clock } from 'lucide-react';

interface EmotionTimelineProps {
  history: SessionHistoryItem[];
  onSelectSession: (item: SessionHistoryItem) => void;
  onDeleteSession: (id: string) => void;
  onBack: () => void;
  onStartNew: () => void;
}

export const EmotionTimeline: React.FC<EmotionTimelineProps> = ({
  history,
  onSelectSession,
  onDeleteSession,
  onBack,
  onStartNew,
}) => {
  return (
    <div className="relative min-h-[85vh] px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playHover();
            onBack();
          }}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Analysis</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-400">
          <Calendar size={13} />
          <span>Local Emotion Timeline</span>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
          Your Emotional <span className="text-gradient-cyan-purple">Journey</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Track how emotional patterns and contributing factors evolve across time. All data remains 100% strictly in your browser.
        </p>
      </div>

      {/* Timeline List */}
      {history.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <Sparkles size={32} className="text-cyan-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Saved Sessions Yet</h3>
          <p className="text-xs text-slate-400">
            Complete your first emotional analysis and click “Save Session” to build your personal timeline.
          </p>
          <button
            onClick={() => {
              sound.playSelect();
              onStartNew();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:shadow-glow-cyan transition-all"
          >
            Start First Analysis
          </button>
        </div>
      ) : (
        <div className="relative border-l-2 border-cyan-500/20 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-6">
          {history.map((item, idx) => {
            const dateObj = new Date(item.timestamp);
            const dateStr = dateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            const timeStr = dateObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="relative group"
              >
                {/* Timeline node icon */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-4 w-7 h-7 rounded-full bg-space-900 border-2 border-cyan-400 flex items-center justify-center text-xs shadow-glow-cyan">
                  {item.moodEmoji}
                </div>

                {/* Card */}
                <div className="glass-panel p-5 rounded-2xl border border-white/10 group-hover:border-cyan-400/40 transition-all duration-300 shadow-glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Clock size={12} className="text-cyan-400" />
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span>{timeStr}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">
                        {item.moodLabel}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase">
                        {item.confidence}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Top Inferred Factor: <span className="text-cyan-200 font-medium">{item.primaryFactor}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {item.result && (
                      <button
                        onClick={() => {
                          sound.playSelect();
                          onSelectSession(item);
                        }}
                        className="px-3.5 py-2 rounded-xl glass-panel text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 hover:bg-cyan-500/20 transition-all"
                      >
                        <span>View Snapshot</span>
                        <ArrowUpRight size={14} />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        sound.playHover();
                        onDeleteSession(item.id);
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
