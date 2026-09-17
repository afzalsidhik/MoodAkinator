import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '../services/soundEffects';
import { GitBranch, Brain, Activity, Compass, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  onStart: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  onClose,
  onStart,
}) => {
  const steps = [
    {
      icon: Compass,
      title: '1. Emotional Resonance Origin',
      desc: 'You begin by selecting your present mood or describing your feeling in freeform text. The AI maps initial coordinates across 8 emotional domains.',
    },
    {
      icon: GitBranch,
      title: '2. Akinator-Style Adaptive Narrowing',
      desc: 'Instead of an unyielding 40-question survey, the engine branches dynamically. If stress is flagged around studies, it asks specific questions about exams, deadlines, or peer benchmarking.',
    },
    {
      icon: Activity,
      title: '3. Real-Time Signal Constellation',
      desc: 'As you answer, an Emotional Signal Map visualizes the shifting interplay between sleep, interpersonal tension, cognitive load, and future uncertainty.',
    },
    {
      icon: Brain,
      title: '4. Pattern Synthesis & Transparent Reasoning',
      desc: 'The AI isolates 3-5 probable contributing factors, shows you the exact answers that led to each conclusion, and suggests practical next steps.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-glass-card space-y-6 my-auto text-left"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              Under the Hood
            </span>
            <h2 className="text-2xl font-display font-extrabold text-white mt-1">
              How MOODAKINATOR AI Works
            </h2>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-space-900/80 border border-white/5 space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <StepIcon size={16} />
                </div>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-200 flex items-start gap-3">
          <ShieldCheck size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-300 block mb-0.5">Non-Diagnostic & Ethical Design</strong>
            We do not assign psychiatric labels or diagnoses. We map patterns of daily friction, sleep rhythms, cognitive expectations, and environment to empower self-reflection.
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={() => {
              sound.playHover();
              onClose();
            }}
            className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
          >
            Close
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              onClose();
              onStart();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:shadow-glow-cyan transition-all"
          >
            Start Analysis Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};
