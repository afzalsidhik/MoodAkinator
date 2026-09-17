import React, { useEffect, useRef } from 'react';
import { DimensionScores, DimensionId } from '../../types';
import { Activity, ShieldAlert, Zap, Moon, Users, Heart, Brain, Compass } from 'lucide-react';

interface EmotionalSignalMapProps {
  scores: DimensionScores;
  compact?: boolean;
}

interface DimensionConfig {
  id: DimensionId;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  angle: number; // in radians
}

const DIMENSIONS: DimensionConfig[] = [
  { id: 'stress', label: 'Stress', icon: Activity, color: '#f59e0b', angle: 0 },
  { id: 'energy', label: 'Energy', icon: Zap, color: '#10b981', angle: Math.PI * 0.25 },
  { id: 'social', label: 'Social', icon: Users, color: '#3b82f6', angle: Math.PI * 0.5 },
  { id: 'sleep', label: 'Sleep Quality', icon: Moon, color: '#6366f1', angle: Math.PI * 0.75 },
  { id: 'academic_work', label: 'Work/Studies', icon: Brain, color: '#ec4899', angle: Math.PI },
  { id: 'relationships', label: 'Relationship', icon: Heart, color: '#f43f5e', angle: Math.PI * 1.25 },
  { id: 'confidence', label: 'Confidence', icon: ShieldAlert, color: '#00f2fe', angle: Math.PI * 1.5 },
  { id: 'future_uncertainty', label: 'Future Horizon', icon: Compass, color: '#8b5cf6', angle: Math.PI * 1.75 },
];

export const EmotionalSignalMap: React.FC<EmotionalSignalMapProps> = ({
  scores,
  compact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) - 26;

      ctx.clearRect(0, 0, width, height);

      // 1. Concentric Guide Webs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      [0.3, 0.6, 1.0].forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * ratio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 2. Cross Axes
      DIMENSIONS.forEach((dim) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const x = centerX + Math.cos(dim.angle) * maxRadius;
        const y = centerY + Math.sin(dim.angle) * maxRadius;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineTo(x, y);
        ctx.stroke();
      });

      // 3. Dynamic Polygon filled with glowing gradient
      const points: { x: number; y: number; val: number; color: string }[] = [];

      DIMENSIONS.forEach((dim) => {
        const rawScore = scores[dim.id] ?? 50;
        const clampedScore = Math.max(15, Math.min(95, rawScore));
        const normalized = clampedScore / 100;
        // Subtle organic breathing jitter
        const jitter = Math.sin(time * 2 + dim.angle * 3) * 0.03;
        const r = maxRadius * (normalized + jitter);

        const x = centerX + Math.cos(dim.angle) * r;
        const y = centerY + Math.sin(dim.angle) * r;
        points.push({ x, y, val: rawScore, color: dim.color });
      });

      // Draw Polygon Fill
      ctx.beginPath();
      points.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();

      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, maxRadius);
      grad.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
      grad.addColorStop(0.6, 'rgba(121, 40, 202, 0.2)');
      grad.addColorStop(1, 'rgba(255, 0, 128, 0.05)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. Draw Animated Nodes & Pulses
      points.forEach((p) => {
        // Outer glowing pulse
        const pulseSize = 4 + Math.sin(time * 3) * 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseSize + 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.2)';
        ctx.fill();

        // Solid Node
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [scores]);

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col items-center relative overflow-hidden border border-cyan-500/20 shadow-glass-card">
      <div className="w-full flex items-center justify-between pb-2 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-mono text-cyan-300 font-semibold">
            Emotional Signal Map
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
          Live Pattern
        </span>
      </div>

      <div className="relative my-1 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={compact ? 220 : 260}
          height={compact ? 220 : 260}
          className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px]"
        />
      </div>

      <div className="w-full grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-white/5 text-[11px]">
        {DIMENSIONS.slice(0, 6).map((dim) => {
          const val = scores[dim.id] ?? 50;
          return (
            <div
              key={dim.id}
              className="flex items-center justify-between px-2 py-1 rounded-lg bg-space-900/60 border border-white/5"
            >
              <div className="flex items-center gap-1.5 truncate">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: dim.color }}
                />
                <span className="text-slate-300 truncate font-mono text-[10px]">
                  {dim.label}
                </span>
              </div>
              <span className="font-mono font-bold text-[10px] text-cyan-300">
                {val}%
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[9px] text-slate-400 text-center mt-2 italic">
        Inferred patterns from responses • Not a medical score
      </p>
    </div>
  );
};
