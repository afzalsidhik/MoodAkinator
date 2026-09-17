import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '../services/soundEffects';
import { ShieldAlert, Phone, Wind, ArrowLeft, ExternalLink } from 'lucide-react';

interface SafetyPanelProps {
  onClose: () => void;
  isTriggered?: boolean;
}

export const SafetyPanel: React.FC<SafetyPanelProps> = ({
  onClose,
  isTriggered = false,
}) => {

  const crisisResources = [
    { country: 'United States & Canada', service: 'Suicide & Crisis Lifeline', contact: 'Call or Text 988', link: 'tel:988' },
    { country: 'United Kingdom', service: 'NHS Mental Health / Samaritans', contact: 'Call 111 (NHS) or 116 123 (Samaritans)', link: 'tel:116123' },
    { country: 'India', service: 'Vandrevala Foundation / KIRAN', contact: '+91 9999 666 555 / 1800-599-0019', link: 'tel:+919999666555' },
    { country: 'Australia', service: 'Lifeline Australia', contact: 'Call 13 11 14', link: 'tel:131114' },
    { country: 'Europe / International', service: 'Befrienders Worldwide & 112 Emergency', contact: 'Call 112 or visit befrienders.org', link: 'https://www.befrienders.org' },
    { country: 'Crisis Text Line', service: '24/7 Confidential Text Support', contact: 'Text HOME to 741741', link: 'sms:741741' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.25)] space-y-6 my-auto text-left"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                You don&apos;t have to handle this alone.
              </h2>
              <p className="text-xs text-rose-300/80 font-mono mt-0.5">
                Immediate Supportive Support & Crisis Resources
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playHover();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Supportive Message */}
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
          <p>
            If you are going through immense pain, feeling overwhelmed, or having thoughts of self-harm, please know there are kind, trained people ready to listen and support you right now.
          </p>
          <p className="text-rose-200 font-semibold">
            MOODAKINATOR AI is an experimental reflective tool and cannot provide crisis or clinical care. Please connect with immediate professional help or someone you trust.
          </p>
        </div>

        {/* Crisis Hotlines List */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Phone size={14} className="text-cyan-400" /> Free & Confidential 24/7 Hotlines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {crisisResources.map((res, i) => (
              <a
                key={i}
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-space-900/80 border border-white/5 hover:border-cyan-400/40 transition-all flex flex-col justify-between group text-xs"
              >
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                    {res.country}
                  </span>
                  <h4 className="text-white font-medium text-xs mt-0.5">
                    {res.service}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-cyan-300 font-bold font-mono mt-2 text-[11px]">
                  <span>{res.contact}</span>
                  <ExternalLink size={12} className="opacity-60 group-hover:opacity-100" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Grounding Exercise (Box Breathing) */}
        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-semibold">
              <Wind size={15} />
              <span>Immediate Grounding • 4-4-4-4 Box Breathing</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-300">
              1. Inhale (4s)
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-purple-300">
              2. Hold (4s)
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-pink-300">
              3. Exhale (4s)
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300">
              4. Rest (4s)
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              sound.playHover();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Application</span>
          </button>

          <span className="text-[10px] font-mono text-slate-500">
            Confidential • Always Available
          </span>
        </div>
      </motion.div>
    </div>
  );
};
