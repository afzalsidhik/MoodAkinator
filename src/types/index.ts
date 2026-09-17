export type MoodId = 
  | 'happy'
  | 'sad'
  | 'angry'
  | 'anxious'
  | 'stressed'
  | 'lonely'
  | 'confused'
  | 'drained'
  | 'motivated'
  | 'excited'
  | 'numb'
  | 'custom';

export interface MoodMeta {
  id: MoodId;
  label: string;
  emoji: string;
  description: string;
  primaryColor: string; // Hex for Tailwind & 3D
  secondaryColor: string;
  accentGlow: string;
  themeHue: number;
  particles: string;
}

export type DimensionId = 
  | 'stress'
  | 'energy'
  | 'social'
  | 'sleep'
  | 'academic_work'
  | 'relationships'
  | 'confidence'
  | 'future_uncertainty';

export type DimensionScores = Record<DimensionId, number>;

export type QuestionCategory = 
  | 'Emotional'
  | 'Time'
  | 'Sleep'
  | 'Academic / Work'
  | 'Social'
  | 'Relationships'
  | 'Physical'
  | 'Digital habits'
  | 'Environment'
  | 'Expectations'
  | 'Recent events'
  | 'Self-perception'
  | 'Deep Dive';

export interface AnswerOption {
  id: string;
  label: string;
  shortcut?: string; // e.g., "1", "2"
  icon?: string;
  subtitle?: string;
  scoreImpact?: Partial<Record<DimensionId, number>>;
  branchNextQuestionId?: string;
  isCrisisTrigger?: boolean;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  text: string;
  subtitle?: string;
  options: AnswerOption[];
  isBranchingRoot?: boolean;
}

export interface UserAnswer {
  questionId: string;
  questionText: string;
  category: QuestionCategory;
  selectedOptionId: string;
  selectedLabel: string;
  scoreImpact?: Partial<Record<DimensionId, number>>;
}

export type ConfidenceSignal = 'strong signal' | 'moderate signal' | 'weak signal';

export interface ContributingFactor {
  id: string;
  title: string;
  confidence: ConfidenceSignal;
  summary: string;
  detailedAnalysis: string;
  evidence: string[];
  colorTheme: string;
}

export interface PositiveSignal {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
}

export interface PracticalRecommendation {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  actions: string[];
  durationTag: string;
  iconName: string;
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  contextHint: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  initialMood: MoodMeta;
  customMoodDescription?: string;
  emotionalSnapshotTitle: string;
  emotionalSnapshotSubtitle: string;
  contributingFactors: ContributingFactor[];
  reasoningSummary: string;
  positiveSignals: PositiveSignal[];
  recommendations: PracticalRecommendation[];
  reflectionQuestions: ReflectionQuestion[];
  dimensionScores: DimensionScores;
  userAnswers: UserAnswer[];
}

export interface SessionHistoryItem {
  id: string;
  timestamp: number;
  moodId: MoodId;
  moodLabel: string;
  moodEmoji: string;
  primaryFactor: string;
  confidence: ConfidenceSignal;
  dominantDimension: string;
  result: AnalysisResult;
}
