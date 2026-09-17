import React from 'react';
import { motion } from 'framer-motion';

interface ProgressNeuralMapProps {
  currentIndex: number;
  totalEstimated: number;
}

export const ProgressNeuralMap: React.FC<ProgressNeuralMapProps> = ({
  currentIndex,
  totalEstimated,
}) => {
  const currentStep = Math.min(currentIndex + 1, totalEstimated);
  const totalSteps = Math.max(totalEstimated, 10);
  const stepArray = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold uppercase tracking-wider">
            Neural Pathway
          </span>
          <span className="text-slate-500 font-normal">|</span>
          <span className="text-slate-300">
            Node <span className="text-white font-bold">{String(currentStep).padStart(2, '0')}</span> / {String(totalSteps).padStart(2, '0')}
          </span>
        </div>
        <div className="text-[11px] text-cyan-300/80 font-mono">
          {Math.round((currentStep / totalSteps) * 100)}% Resolved
        </div>
      </div>

      {/* Pathway visualization */}
      <div className="relative w-full h-8 flex items-center justify-between px-2">
        {/* Background Connecting Wire */}
        <div className="absolute left-3 right-3 h-[2px] bg-space-800 rounded-full" />

        {/* Active Flowing Wire */}
        <motion.div
          className="absolute left-3 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full shadow-[0_0_12px_rgba(0,242,254,0.6)]"
          initial={{ width: '0%' }}
          animate={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Neural Nodes */}
        {stepArray.map((step) => {
          const isDone = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              <motion.div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-400 ring-4 ring-cyan-400/30 scale-125 shadow-[0_0_15px_#00f2fe]'
                    : isDone
                    ? 'bg-gradient-to-br from-cyan-400 to-purple-600 shadow-[0_0_8px_rgba(0,242,254,0.4)]'
                    : 'bg-space-800 border border-white/10'
                }`}
                animate={
                  isCurrent
                    ? {
                        scale: [1.1, 1.35, 1.1],
                        boxShadow: [
                          '0 0 10px #00f2fe',
                          '0 0 20px #00f2fe',
                          '0 0 10px #00f2fe',
                        ],
                      }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {isDone && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
                )}
                {isCurrent && (
                  <div className="w-1.5 h-1.5 rounded-full bg-space-950 animate-ping" />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
