import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AnalysisResult, ContributingFactor } from '../types';
import { EmotionalSignalMap } from './3d/EmotionalSignalMap';
import { sound } from '../services/soundEffects';
import {
  Sparkles,
  Share2,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  Info,
  Heart,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Check,
  BrainCircuit,
  MessageSquareHeart,
  Lightbulb,
} from 'lucide-react';

interface ResultDashboardProps {
  result: AnalysisResult;
  onRestart: () => void;
  onSaveToHistory: () => void;
  isSaved?: boolean;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  onRestart,
  onSaveToHistory,
  isSaved = false,
}) => {
  const [expandedFactorId, setExpandedFactorId] = useState<string | null>(
    result.contributingFactors[0]?.id || null
  );
  const [copied, setCopied] = useState(false);
  const [reflectionNotes, setReflectionNotes] = useState<Record<string, string>>({});
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const handleCopySummary = () => {
    sound.playSelect();
    const text = `MOODAKINATOR AI — Emotional Snapshot\nMood: ${result.initialMood.label} (${result.initialMood.emoji})\nState: ${result.emotionalSnapshotTitle}\n\nTop Contributing Factors:\n${result.contributingFactors
      .map((f) => `• ${f.title} [${f.confidence}]: ${f.summary}`)
      .join('\n')}\n\nWhat's Going Well:\n${result.positiveSignals
      .map((p) => `• ${p.iconEmoji} ${p.title}: ${p.description}`)
      .join('\n')}\n\nSelf-Reflection Questions:\n${result.reflectionQuestions
      .map((q) => `? ${q.question}`)
      .join('\n')}\n\n(Generated via MoodAkinator AI — Non-diagnostic reflection tool)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00f2fe', '#7928ca', '#ff0080'],
    });

    setTimeout(() => setCopied(false), 3000);
  };

  const toggleAction = (actionText: string) => {
    sound.playHover();
    setCheckedActions((prev) => ({
      ...prev,
      [actionText]: !prev[actionText],
    }));
  };

  return (
    <div className="relative min-h-screen px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-8 space-y-10">
      {/* Top Banner & Snapshot Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-glow-cyan relative overflow-hidden"
      >
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full filter blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: result.initialMood.primaryColor }}
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-cyan-300 border border-cyan-400/20 text-xs font-mono font-semibold uppercase tracking-wider">
                Your Emotional Snapshot
              </span>
              <span className="text-xs font-mono text-slate-400">
                Pattern Confidence High
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl filter drop-shadow-md">
                {result.initialMood.emoji}
              </span>
              <div>
                <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
                  {result.emotionalSnapshotTitle}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 font-normal">
                  {result.emotionalSnapshotSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => {
                sound.playSelect();
                onSaveToHistory();
              }}
              disabled={isSaved}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                isSaved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'glass-panel text-white hover:border-cyan-400 hover:shadow-glow-cyan'
              }`}
            >
              {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
              <span>{isSaved ? 'Saved in History' : 'Save Session'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl glass-panel text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/10 transition-all border border-cyan-500/30"
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copied ? 'Copied Snapshot' : 'Share Snapshot'}</span>
            </button>

            <button
              onClick={() => {
                sound.playHover();
                onRestart();
              }}
              className="px-4 py-2.5 rounded-xl bg-space-800 text-slate-300 hover:text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border border-white/10 hover:border-white/20 transition-all"
            >
              <RotateCcw size={14} />
              <span>Restart</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid: 2 Columns (Main Insights vs Signal Map & Transparency) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contributing Factors & Reasoning */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. POSSIBLE CONTRIBUTING FACTORS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit size={20} className="text-cyan-400" />
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Possible Contributing Factors
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Akinator Signal Deductions
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Based on the patterns in your answers, these life dimensions appear most strongly correlated with your current emotional state.
            </p>

            {/* Factor Cards Accordion */}
            <div className="space-y-3 pt-2">
              {result.contributingFactors.map((factor, idx) => {
                const isExpanded = expandedFactorId === factor.id;
                const badgeColor =
                  factor.confidence === 'strong signal'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/40';

                return (
                  <motion.div
                    key={factor.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`glass-panel rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'border-cyan-400/50 shadow-glow-cyan'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => {
                        sound.playHover();
                        setExpandedFactorId(isExpanded ? null : factor.id);
                      }}
                      className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/10 text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-white">
                              {factor.title}
                            </h3>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${badgeColor}`}
                            >
                              {factor.confidence}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                            {factor.summary}
                          </p>
                        </div>
                      </div>

                      <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                          isExpanded ? 'rotate-180 text-cyan-400' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-5 pb-5 pt-1 border-t border-white/5 space-y-4"
                        >
                          <p className="text-sm text-slate-200 leading-relaxed">
                            {factor.detailedAnalysis}
                          </p>

                          {/* Evidence Trace */}
                          <div className="p-3.5 rounded-xl bg-space-900/80 border border-white/10 space-y-2">
                            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                              <Info size={13} /> Relevant Answer Evidence:
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {factor.evidence.map((ev, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-cyan-400 mt-0.5">•</span>
                                  <span>{ev}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 2. WHY WE THINK THIS (Reasoning & Transparency) */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-400" />
              <h3 className="text-lg font-display font-bold text-white">
                Why We Think This (Reasoning Transparency)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {result.reasoningSummary}
            </p>
          </div>

          {/* 3. WHAT'S GOING WELL (Positive Signals) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquareHeart size={20} className="text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                What&apos;s Going Well (Positive Anchors)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {result.positiveSignals.map((pos) => (
                <div
                  key={pos.id}
                  className="glass-panel p-4 rounded-2xl border border-emerald-500/20 shadow-glass-card flex items-start gap-3"
                >
                  <span className="text-2xl flex-shrink-0">{pos.iconEmoji}</span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-emerald-300">
                      {pos.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pos.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. WHAT YOU CAN TRY (Practical Non-Medical Actions) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" />
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                  What You Can Try (Practical Actions)
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Non-Medical Steps</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {result.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="glass-panel p-5 rounded-2xl border border-purple-500/20 shadow-glass-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                        {rec.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">
                        {rec.title}
                      </h3>
                      <p className="text-xs text-slate-300">{rec.subtitle}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
                      {rec.durationTag}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {rec.actions.map((act, i) => {
                      const isDone = !!checkedActions[act];
                      return (
                        <div
                          key={i}
                          onClick={() => toggleAction(act)}
                          className={`p-2.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all text-xs ${
                            isDone
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400 line-through'
                              : 'bg-space-900/60 border-white/5 text-slate-200 hover:border-cyan-400/30'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors ${
                              isDone
                                ? 'bg-emerald-400 text-slate-950 font-bold'
                                : 'border border-slate-500'
                            }`}
                          >
                            {isDone && <Check size={12} />}
                          </div>
                          <span className="leading-snug">{act}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. ASK YOURSELF (Reflection Mode & Private Notes) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-pink-400" />
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                Ask Yourself (Reflection Mode)
              </h2>
            </div>

            <div className="space-y-3">
              {result.reflectionQuestions.map((rq) => (
                <div
                  key={rq.id}
                  className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3"
                >
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-white">
                      “{rq.question}”
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{rq.contextHint}</p>
                  </div>

                  <textarea
                    rows={2}
                    value={reflectionNotes[rq.id] || ''}
                    onChange={(e) =>
                      setReflectionNotes({ ...reflectionNotes, [rq.id]: e.target.value })
                    }
                    placeholder="Jot down a quick thought or private realization..."
                    className="w-full bg-space-900/80 border border-white/10 focus:border-pink-400/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-400/20 transition-all resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Radar Map & Medical Disclaimer */}
        <div className="lg:col-span-4 space-y-6">
          <EmotionalSignalMap scores={result.dimensionScores} compact={false} />

          {/* Strict Non-Medical Disclaimer Card */}
          <div className="p-4 rounded-2xl bg-space-900/80 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold uppercase tracking-wider text-[11px]">
              <ShieldCheck size={16} />
              <span>Non-Diagnostic Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              MOODAKINATOR AI is an interactive self-reflection and pattern discovery prototype. It does not diagnose medical or psychiatric conditions. If you are experiencing persistent distress, reaching out to a certified professional or counselor is strongly encouraged.
            </p>
          </div>

          {/* Quick Restart CTA */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-3">
            <p className="text-xs text-slate-300">
              Ready to explore another emotional state or start afresh?
            </p>
            <button
              onClick={() => {
                sound.playSelect();
                onRestart();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-glow-cyan transition-all"
            >
              <span>Analyze Another Mood</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
