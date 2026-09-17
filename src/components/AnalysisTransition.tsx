import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MoodOrbCanvas } from './3d/MoodOrbCanvas';
import { MoodMeta } from '../types';
import { sound } from '../services/soundEffects';
import { Cpu, Sparkles, Network, CheckCircle2 } from 'lucide-react';

interface AnalysisTransitionProps {
  mood: MoodMeta;
  onComplete: () => void;
}

const ANALYSIS_STEPS = [
  { text: 'Mapping emotional baseline & response vectors...', icon: Network },
  { text: 'Extracting multidimensional signals across 8 life domains...', icon: Cpu },
  { text: 'Isolating recurring patterns & narrowing contributing factors...', icon: Sparkles },
  { text: 'Synthesizing transparent reasoning & personalized actions...', icon: CheckCircle2 },
];

export const AnalysisTransition: React.FC<AnalysisTransitionProps> = ({
  mood,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    sound.playPulse();

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next < ANALYSIS_STEPS.length) {
          sound.playPulse();
          return next;
        } else {
          clearInterval(interval);
          sound.playSuccess();
          setTimeout(() => {
            onComplete();
          }, 800);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 max-w-4xl mx-auto py-12 text-center">
      {/* Background Neural Glow */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full filter blur-[90px] opacity-35 pointer-events-none"
        style={{ backgroundColor: mood.primaryColor }}
      />

      {/* 3D Morphing Sphere */}
      <div className="relative w-72 h-72 sm:w-88 sm:h-88 mb-6">
        <MoodOrbCanvas mood={mood} size="medium" interactive={false} />
      </div>

      {/* Main Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-400/30 text-xs font-mono text-cyan-300 shadow-glow-cyan">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>NEURAL PATTERN ENGINE ACTIVE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Analyzing your <span className="text-gradient-cyan-purple">emotional patterns…</span>
        </h2>
      </motion.div>

      {/* Stepper Progress */}
      <div className="w-full max-w-md space-y-3">
        {ANALYSIS_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const StepIcon = step.icon;

          return (
            <motion.div
              key={step.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: isDone || isCurrent ? 1 : 0.35,
                x: 0,
              }}
              className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-all duration-300 ${
                isCurrent
                  ? 'glass-panel-glow border-cyan-400 bg-cyan-500/10 text-white'
                  : isDone
                  ? 'glass-panel border-white/5 text-slate-300'
                  : 'bg-space-900/40 text-slate-500 border border-transparent'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isCurrent
                    ? 'bg-cyan-400 text-slate-950 font-bold'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <StepIcon size={16} className={isCurrent ? 'animate-spin-slow' : ''} />
                )}
              </div>
              <span className="text-xs sm:text-sm font-medium">
                {step.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
