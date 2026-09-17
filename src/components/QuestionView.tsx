import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, AnswerOption, DimensionScores, MoodMeta } from '../types';
import { ProgressNeuralMap } from './3d/ProgressNeuralMap';
import { EmotionalSignalMap } from './3d/EmotionalSignalMap';
import { sound } from '../services/soundEffects';
import { ArrowLeft, SkipForward, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface QuestionViewProps {
  question: Question;
  questionIndex: number;
  totalEstimated: number;
  scores: DimensionScores;
  mood: MoodMeta;
  onAnswer: (option: AnswerOption) => void;
  onBack: () => void;
  onSkip: () => void;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  questionIndex,
  totalEstimated,
  scores,
  mood,
  onAnswer,
  onBack,
  onSkip,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Keyboard shortcut support (1-9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in text inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= question.options.length) {
        const targetOption = question.options[num - 1];
        if (targetOption) {
          handleSelectOption(targetOption);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question]);

  const handleSelectOption = (option: AnswerOption) => {
    setSelectedOptionId(option.id);
    sound.playSelect();

    setTimeout(() => {
      onAnswer(option);
      setSelectedOptionId(null);
    }, 280);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6">
      {/* Top Navigation & Progress Bar */}
      <div className="w-full space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              sound.playHover();
              onBack();
            }}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Previous Question</span>
          </button>

          {/* Active Mood Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 text-xs text-slate-300 font-mono">
            <span>{mood.emoji}</span>
            <span>Investigating: {mood.label.split(' ')[0]}</span>
          </div>

          <button
            onClick={() => {
              sound.playHover();
              onSkip();
            }}
            className="flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            <span>Skip</span>
            <SkipForward size={13} />
          </button>
        </div>

        {/* Neural Pathway Progress */}
        <ProgressNeuralMap
          currentIndex={questionIndex}
          totalEstimated={totalEstimated}
        />
      </div>

      {/* Main Content Grid: Question Area (Left) + Live Signal Map (Right) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
        {/* Left Column: Question Card & Answer Options */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Category Pill */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono uppercase tracking-wider font-semibold">
                  {question.category} Analysis
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Question {String(questionIndex + 1).padStart(2, '0')} / {String(totalEstimated).padStart(2, '0')}
                </span>
              </div>

              {/* Question Heading */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
                  {question.text}
                </h2>
                {question.subtitle && (
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {question.subtitle}
                  </p>
                )}
              </div>

              {/* Interactive 3D Answer Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOptionId === option.id;
                  const shortcutKey = option.shortcut || String(idx + 1);

                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={() => sound.playHover()}
                      onClick={() => handleSelectOption(option)}
                      className={`relative group p-4 sm:p-5 rounded-2xl text-left flex flex-col justify-between min-h-[105px] sm:min-h-[115px] border transition-all duration-200 overflow-hidden ${
                        isSelected
                          ? 'glass-panel-glow border-cyan-400 bg-cyan-500/20 shadow-glow-cyan'
                          : 'glass-card-interactive border-white/10 hover:border-cyan-400/40'
                      }`}
                    >
                      {/* Ambient background hover glow */}
                      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-cyan-400/15 via-purple-500/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <div className="flex items-start justify-between w-full gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-white/10 group-hover:bg-cyan-400 group-hover:text-slate-950 text-slate-400 font-mono text-[11px] font-bold flex items-center justify-center transition-colors">
                            {shortcutKey}
                          </span>
                          <span className="font-semibold text-sm sm:text-base text-white group-hover:text-cyan-200 transition-colors">
                            {option.label}
                          </span>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5"
                        />
                      </div>

                      {option.subtitle && (
                        <p className="text-xs text-slate-400 group-hover:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                          {option.subtitle}
                        </p>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Live Inferred Signal Map */}
        <div className="lg:col-span-4 w-full flex flex-col space-y-4">
          <EmotionalSignalMap scores={scores} compact={false} />

          {/* Quick Tip Pill */}
          <div className="p-3 rounded-xl bg-space-900/60 border border-white/5 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
            <Sparkles size={14} className="text-purple-400 flex-shrink-0" />
            <span>Tip: Press keys 1-{question.options.length} on your keyboard for fast answering.</span>
          </div>
        </div>
      </div>

      {/* Bottom status note */}
      <div className="w-full text-center text-[10px] text-slate-400 font-mono pt-4">
        Akinator Engine narrowing down underlying factors • 100% Private Client Analysis
      </div>
    </div>
  );
};
