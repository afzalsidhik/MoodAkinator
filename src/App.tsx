import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MoodMeta,
  DimensionScores,
  UserAnswer,
  Question,
  AnswerOption,
  AnalysisResult,
  SessionHistoryItem,
} from './types';
import { QuestionEngine } from './services/questionEngine';
import { EmotionAnalysisService } from './services/emotionAnalysisService';
import { StorageService } from './services/storageService';
import { sound } from './services/soundEffects';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingHero } from './components/LandingHero';
import { MoodSelector } from './components/MoodSelector';
import { QuestionView } from './components/QuestionView';
import { AnalysisTransition } from './components/AnalysisTransition';
import { ResultDashboard } from './components/ResultDashboard';
import { EmotionTimeline } from './components/EmotionTimeline';
import { PrivacyPanel } from './components/PrivacyPanel';
import { SafetyPanel } from './components/SafetyPanel';
import { HowItWorksModal } from './components/HowItWorksModal';

type AppView = 'landing' | 'mood-selection' | 'questioning' | 'analyzing' | 'result' | 'timeline';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedMood, setSelectedMood] = useState<MoodMeta | null>(null);
  const [customMoodText, setCustomMoodText] = useState<string>('');
  
  // Questioning state
  const [dimensionScores, setDimensionScores] = useState<DimensionScores>(
    QuestionEngine.getInitialDimensionScores('anxious')
  );
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionStack, setQuestionStack] = useState<Question[]>([]);

  // Result state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isSavedInHistory, setIsSavedInHistory] = useState(false);

  // History & Modals
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isCrisisTriggered, setIsCrisisTriggered] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = StorageService.getHistory();
    setHistory(saved);
  }, []);

  // --- Actions ---

  const handleStartAnalysis = () => {
    setCurrentView('mood-selection');
  };

  const handleSelectMood = (mood: MoodMeta, customText?: string) => {
    setSelectedMood(mood);
    setCustomMoodText(customText || '');
    
    // Initialize dimension scores
    const initialScores = QuestionEngine.getInitialDimensionScores(mood.id);
    setDimensionScores(initialScores);
    setUserAnswers([]);
    setQuestionStack([]);

    // Fetch first question
    const firstQ = QuestionEngine.getNextQuestion(mood.id, [], initialScores);
    if (firstQ) {
      setCurrentQuestion(firstQ);
      setQuestionStack([firstQ]);
      setCurrentView('questioning');
    }
  };

  const handleAnswerOption = async (option: AnswerOption) => {
    if (!selectedMood || !currentQuestion) return;

    // Check crisis intercept
    if (option.isCrisisTrigger) {
      setIsCrisisTriggered(true);
      setIsSafetyOpen(true);
      return;
    }

    // Apply dimensional score impact
    const updatedScores: DimensionScores = { ...dimensionScores };
    if (option.scoreImpact) {
      Object.entries(option.scoreImpact).forEach(([key, val]) => {
        const dim = key as keyof DimensionScores;
        if (typeof val === 'number') {
          updatedScores[dim] = Math.max(0, Math.min(100, (updatedScores[dim] || 50) + val));
        }
      });
    }
    setDimensionScores(updatedScores);

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      category: currentQuestion.category,
      selectedOptionId: option.id,
      selectedLabel: option.label,
      scoreImpact: option.scoreImpact,
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    // Get next question from Akinator engine
    const nextQ = QuestionEngine.getNextQuestion(selectedMood.id, updatedAnswers, updatedScores);

    if (nextQ) {
      setCurrentQuestion(nextQ);
      setQuestionStack((prev) => [...prev, nextQ]);
    } else {
      // Questions complete -> Go to cinematic AI analysis screen
      setCurrentView('analyzing');
    }
  };

  const handleAnalysisComplete = async () => {
    if (!selectedMood) return;

    const result = await EmotionAnalysisService.analyze(
      selectedMood,
      userAnswers,
      dimensionScores,
      customMoodText
    );

    setAnalysisResult(result);
    setIsSavedInHistory(false);
    setCurrentView('result');
  };

  const handleQuestionBack = () => {
    if (userAnswers.length === 0 || questionStack.length <= 1) {
      setCurrentView('mood-selection');
      return;
    }

    // Pop the last answer and previous question
    const newAnswers = userAnswers.slice(0, -1);
    const newStack = questionStack.slice(0, -1);
    const prevQ = newStack[newStack.length - 1];

    setUserAnswers(newAnswers);
    setQuestionStack(newStack);
    setCurrentQuestion(prevQ);
  };

  const handleQuestionSkip = () => {
    if (!selectedMood || !currentQuestion) return;

    const nextQ = QuestionEngine.getNextQuestion(selectedMood.id, userAnswers, dimensionScores);
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setQuestionStack((prev) => [...prev, nextQ]);
    } else {
      setCurrentView('analyzing');
    }
  };

  const handleSaveToHistory = () => {
    if (!analysisResult) return;
    StorageService.saveSession(analysisResult);
    setHistory(StorageService.getHistory());
    setIsSavedInHistory(true);
  };

  const handleDeleteSession = (id: string) => {
    const updated = StorageService.deleteSession(id);
    setHistory(updated);
  };

  const handleSelectPastSession = (item: SessionHistoryItem) => {
    if (item.result) {
      setAnalysisResult(item.result);
      setSelectedMood(item.result.initialMood);
      setIsSavedInHistory(true);
      setCurrentView('result');
    }
  };

  const handleClearAllData = () => {
    StorageService.clearAllData();
    setHistory([]);
  };

  const handleRestart = () => {
    setUserAnswers([]);
    setQuestionStack([]);
    setCurrentQuestion(null);
    setAnalysisResult(null);
    setIsSavedInHistory(false);
    setSelectedMood(null);
    setCustomMoodText('');
    setCurrentView('mood-selection');
  };

  const handleGoHome = () => {
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-space-950 text-slate-100 relative selection:bg-cyan-500 selection:text-space-950">
      {/* Background Radial Glow */}
      <div className="fixed inset-0 radial-vignette pointer-events-none z-0" />

      {/* Navigation Header */}
      <Navbar
        onGoHome={handleGoHome}
        onOpenHistory={() => setCurrentView('timeline')}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenSafety={() => {
          setIsCrisisTriggered(false);
          setIsSafetyOpen(true);
        }}
        historyCount={history.length}
      />

      {/* Main Screen Router */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingHero
                onStart={handleStartAnalysis}
                onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
                onOpenPrivacy={() => setIsPrivacyOpen(true)}
              />
            </motion.div>
          )}

          {currentView === 'mood-selection' && (
            <motion.div
              key="mood-selection"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <MoodSelector
                onSelectMood={handleSelectMood}
                onBack={handleGoHome}
              />
            </motion.div>
          )}

          {currentView === 'questioning' && currentQuestion && selectedMood && (
            <motion.div
              key="questioning"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionView
                question={currentQuestion}
                questionIndex={userAnswers.length}
                totalEstimated={11}
                scores={dimensionScores}
                mood={selectedMood}
                onAnswer={handleAnswerOption}
                onBack={handleQuestionBack}
                onSkip={handleQuestionSkip}
              />
            </motion.div>
          )}

          {currentView === 'analyzing' && selectedMood && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnalysisTransition
                mood={selectedMood}
                onComplete={handleAnalysisComplete}
              />
            </motion.div>
          )}

          {currentView === 'result' && analysisResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ResultDashboard
                result={analysisResult}
                onRestart={handleRestart}
                onSaveToHistory={handleSaveToHistory}
                isSaved={isSavedInHistory}
              />
            </motion.div>
          )}

          {currentView === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <EmotionTimeline
                history={history}
                onSelectSession={handleSelectPastSession}
                onDeleteSession={handleDeleteSession}
                onBack={handleGoHome}
                onStartNew={handleStartAnalysis}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenSafety={() => {
          setIsCrisisTriggered(false);
          setIsSafetyOpen(true);
        }}
      />

      {/* Modal Overlays */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <PrivacyPanel
            onClose={() => setIsPrivacyOpen(false)}
            onClearData={handleClearAllData}
          />
        )}

        {isSafetyOpen && (
          <SafetyPanel
            onClose={() => setIsSafetyOpen(false)}
            isTriggered={isCrisisTriggered}
          />
        )}

        {isHowItWorksOpen && (
          <HowItWorksModal
            onClose={() => setIsHowItWorksOpen(false)}
            onStart={() => {
              setIsHowItWorksOpen(false);
              setCurrentView('mood-selection');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
