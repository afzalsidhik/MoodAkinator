import { SessionHistoryItem, AnalysisResult } from '../types';

const STORAGE_KEY = 'moodakinator_history_v1';

export class StorageService {
  public static getHistory(): SessionHistoryItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Return demo seed history so the timeline isn't completely blank on first launch
        return this.getDemoSeedHistory();
      }
      return JSON.parse(raw);
    } catch {
      return this.getDemoSeedHistory();
    }
  }

  public static saveSession(result: AnalysisResult): SessionHistoryItem {
    const history = this.getHistory();
    const topFactor = result.contributingFactors[0]?.title || 'Daily Patterns';
    const confidence = result.contributingFactors[0]?.confidence || 'moderate signal';

    // Find highest scoring dimension
    const entries = Object.entries(result.dimensionScores) as [string, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const dominantDimension = entries[0]?.[0] || 'stress';

    const newItem: SessionHistoryItem = {
      id: result.id,
      timestamp: result.timestamp,
      moodId: result.initialMood.id,
      moodLabel: result.initialMood.label,
      moodEmoji: result.initialMood.emoji,
      primaryFactor: topFactor,
      confidence,
      dominantDimension,
      result,
    };

    const updated = [newItem, ...history.filter(h => h.id !== result.id)].slice(0, 30);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    return newItem;
  }

  public static deleteSession(id: string): SessionHistoryItem[] {
    const current = this.getHistory();
    const updated = current.filter(item => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return updated;
  }

  public static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('moodakinator_sound_muted');
  }

  private static getDemoSeedHistory(): SessionHistoryItem[] {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    return [
      {
        id: 'seed_1',
        timestamp: now - dayMs * 3,
        moodId: 'happy',
        moodLabel: 'Happy & Joyful',
        moodEmoji: '😊',
        primaryFactor: 'Goal Alignment & Vitality Surge',
        confidence: 'strong signal',
        dominantDimension: 'energy',
        result: null as unknown as AnalysisResult,
      },
      {
        id: 'seed_2',
        timestamp: now - dayMs * 2,
        moodId: 'stressed',
        moodLabel: 'Stressed & Overwhelmed',
        moodEmoji: '😫',
        primaryFactor: 'Academic & Performance Pressure',
        confidence: 'strong signal',
        dominantDimension: 'academic_work',
        result: null as unknown as AnalysisResult,
      },
      {
        id: 'seed_3',
        timestamp: now - dayMs * 1,
        moodId: 'drained',
        moodLabel: 'Drained & Burned Out',
        moodEmoji: '😴',
        primaryFactor: 'Sleep Rhythm Disruption & Energy Drain',
        confidence: 'moderate signal',
        dominantDimension: 'sleep',
        result: null as unknown as AnalysisResult,
      },
    ];
  }
}
