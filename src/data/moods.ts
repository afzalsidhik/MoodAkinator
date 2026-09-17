import { MoodMeta, MoodId } from '../types';

export const MOODS: Record<MoodId, MoodMeta> = {
  happy: {
    id: 'happy',
    label: 'Happy & Joyful',
    emoji: '😊',
    description: 'Feeling positive, lighthearted, and pleased with current circumstances.',
    primaryColor: '#10b981', // emerald
    secondaryColor: '#06b6d4', // cyan
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    themeHue: 160,
    particles: 'emerald',
  },
  sad: {
    id: 'sad',
    label: 'Sad & Heavy',
    emoji: '😔',
    description: 'Experiencing low spirits, gloom, melancholy, or quiet heartache.',
    primaryColor: '#3b82f6', // blue
    secondaryColor: '#6366f1', // indigo
    accentGlow: 'rgba(59, 130, 246, 0.4)',
    themeHue: 220,
    particles: 'blue',
  },
  angry: {
    id: 'angry',
    label: 'Angry & Frustrated',
    emoji: '😡',
    description: 'Feeling agitation, irritation, resentment, or inner heat.',
    primaryColor: '#ef4444', // red
    secondaryColor: '#f97316', // orange
    accentGlow: 'rgba(239, 68, 68, 0.45)',
    themeHue: 10,
    particles: 'red',
  },
  anxious: {
    id: 'anxious',
    label: 'Anxious & On Edge',
    emoji: '😰',
    description: 'A racing mind, nervous anticipation, or looming unease.',
    primaryColor: '#a855f7', // purple
    secondaryColor: '#ec4899', // pink
    accentGlow: 'rgba(168, 85, 247, 0.45)',
    themeHue: 280,
    particles: 'purple',
  },
  stressed: {
    id: 'stressed',
    label: 'Stressed & Overwhelmed',
    emoji: '😫',
    description: 'Carrying too much cognitive load, tight deadlines, or pressure.',
    primaryColor: '#f59e0b', // amber
    secondaryColor: '#ef4444', // red-amber
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    themeHue: 38,
    particles: 'amber',
  },
  lonely: {
    id: 'lonely',
    label: 'Lonely & Disconnected',
    emoji: '💭',
    description: 'Feeling emotionally distant, solitary, or unsupported by surroundings.',
    primaryColor: '#6366f1', // indigo
    secondaryColor: '#8b5cf6', // violet
    accentGlow: 'rgba(99, 102, 241, 0.4)',
    themeHue: 245,
    particles: 'indigo',
  },
  confused: {
    id: 'confused',
    label: 'Confused & Uncertain',
    emoji: '😵‍💫',
    description: 'Foggy thoughts, conflicting choices, or lack of clear direction.',
    primaryColor: '#06b6d4', // cyan
    secondaryColor: '#8b5cf6', // violet
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    themeHue: 190,
    particles: 'cyan',
  },
  drained: {
    id: 'drained',
    label: 'Drained & Burned Out',
    emoji: '😴',
    description: 'Depleted mental or physical battery, running on low reserves.',
    primaryColor: '#64748b', // slate
    secondaryColor: '#475569', // dark slate
    accentGlow: 'rgba(100, 116, 139, 0.4)',
    themeHue: 215,
    particles: 'slate',
  },
  motivated: {
    id: 'motivated',
    label: 'Motivated & Driven',
    emoji: '🔥',
    description: 'High momentum, creative spark, and clarity on goals.',
    primaryColor: '#f97316', // orange
    secondaryColor: '#eab308', // yellow
    accentGlow: 'rgba(249, 115, 22, 0.45)',
    themeHue: 25,
    particles: 'orange',
  },
  excited: {
    id: 'excited',
    label: 'Excited & Electric',
    emoji: '✨',
    description: 'Anticipation for what is coming, vibrant buzz, and curiosity.',
    primaryColor: '#ec4899', // pink
    secondaryColor: '#00f2fe', // cyan
    accentGlow: 'rgba(236, 72, 153, 0.45)',
    themeHue: 330,
    particles: 'pink',
  },
  numb: {
    id: 'numb',
    label: 'Numb & Detached',
    emoji: '😐',
    description: 'A flat emotional landscape, indifference, or sensory autopilot.',
    primaryColor: '#475569', // slate
    secondaryColor: '#334155', // dark slate
    accentGlow: 'rgba(71, 85, 105, 0.35)',
    themeHue: 210,
    particles: 'zinc',
  },
  custom: {
    id: 'custom',
    label: 'Custom Mood',
    emoji: '🔮',
    description: 'Your own nuanced emotional spectrum described in your exact words.',
    primaryColor: '#00f2fe',
    secondaryColor: '#7928ca',
    accentGlow: 'rgba(0, 242, 254, 0.45)',
    themeHue: 270,
    particles: 'cyan-purple',
  }
};

export const MOOD_LIST = Object.values(MOODS).filter(m => m.id !== 'custom');
