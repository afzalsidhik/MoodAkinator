import {
  MoodMeta,
  DimensionScores,
  UserAnswer,
  AnalysisResult,
  ContributingFactor,
  PositiveSignal,
  PracticalRecommendation,
  ReflectionQuestion,
} from '../types';

export class EmotionAnalysisService {
  /**
   * Main analysis execution pipeline:
   * 1. Extract Signals
   * 2. Pattern Matching & Contributing Factors
   * 3. Transparent Reasoning Trace
   * 4. Positive Signals Discovery
   * 5. Actionable Practical Suggestions
   * 6. Deep Reflection Prompts
   */
  public static async analyze(
    mood: MoodMeta,
    answers: UserAnswer[],
    scores: DimensionScores,
    customDescription?: string
  ): Promise<AnalysisResult> {
    // Artificial slight async delay to simulate neural pattern crunching
    await new Promise((resolve) => setTimeout(resolve, 800));

    const factorCandidates = this.extractContributingFactors(mood, answers, scores);
    const reasoningSummary = this.buildReasoningSummary(mood, answers, factorCandidates);
    const positiveSignals = this.extractPositiveSignals(answers, scores);
    const recommendations = this.generateRecommendations(factorCandidates, scores);
    const reflectionQuestions = this.generateReflectionQuestions(mood, factorCandidates, answers);

    const snapshot = this.generateSnapshotTitles(mood, factorCandidates, customDescription);

    return {
      id: 'res_' + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      initialMood: mood,
      customMoodDescription: customDescription,
      emotionalSnapshotTitle: snapshot.title,
      emotionalSnapshotSubtitle: snapshot.subtitle,
      contributingFactors: factorCandidates.slice(0, 4),
      reasoningSummary,
      positiveSignals,
      recommendations,
      reflectionQuestions,
      dimensionScores: scores,
      userAnswers: answers,
    };
  }

  // --- 1. Contributing Factors Deduction ---

  private static extractContributingFactors(
    mood: MoodMeta,
    answers: UserAnswer[],
    scores: DimensionScores
  ): ContributingFactor[] {
    const factors: ContributingFactor[] = [];
    const answerIds = new Set(answers.map((a) => a.selectedOptionId));

    // Academic / Work Pressure Factor
    if (
      scores.academic_work >= 45 ||
      answerIds.has('opt_drive_college') ||
      answerIds.has('opt_acad_deadlines') ||
      answerIds.has('opt_acad_exams') ||
      answerIds.has('opt_drive_work') ||
      answerIds.has('opt_work_workload')
    ) {
      const isExams = answerIds.has('opt_acad_exams');
      const isDeadlines = answerIds.has('opt_acad_deadlines');
      const isWorkload = answerIds.has('opt_work_workload');
      const isPlacements = answerIds.has('opt_acad_placements');

      const evidence: string[] = [];
      if (isExams) evidence.push('Reported looming exam performance pressure or high syllabus volume');
      if (isDeadlines) evidence.push('Indicated assignment backlogs and compression around deadlines');
      if (isWorkload) evidence.push('Reported relentless professional workload without sufficient breathing room');
      if (isPlacements) evidence.push('Indicated recruitment/interview anxiety and career benchmarking');
      if (evidence.length === 0) evidence.push('Academic/workload dimension scored significantly high across inquiries');

      factors.push({
        id: 'factor_academic_work',
        title: isWorkload ? 'Workplace Workload Compression' : 'Academic & Performance Pressure',
        confidence: scores.academic_work > 60 || evidence.length >= 2 ? 'strong signal' : 'moderate signal',
        summary:
          'Your answers suggest that upcoming deadlines, performance expectations, or piled tasks are exerting noticeable cognitive demand.',
        detailedAnalysis:
          'When obligations accumulate faster than restorative breaks occur, the nervous system shifts into sustained vigilance. Your responses reflect this pattern, where academic or professional demands are occupying significant focus.',
        evidence,
        colorTheme: '#f59e0b',
      });
    }

    // Sleep & Physiological Depletion Factor
    if (
      scores.sleep <= 35 ||
      scores.energy <= 35 ||
      answerIds.has('opt_slp_delayed') ||
      answerIds.has('opt_slp_interrupted') ||
      answerIds.has('opt_fat_sleep')
    ) {
      const isDelayed = answerIds.has('opt_slp_delayed');
      const isInterrupted = answerIds.has('opt_slp_interrupted');
      const isFatigue = answerIds.has('opt_fat_sleep') || answerIds.has('opt_slp_oversleep');

      const evidence: string[] = [];
      if (isDelayed) evidence.push('Noted late-night revenge bedtime procrastination or overthinking before sleep');
      if (isInterrupted) evidence.push('Reported fragmented sleep cycles leaving the brain in a vigilant state');
      if (isFatigue) evidence.push('Indicated waking up depleted despite spending hours in bed');
      if (evidence.length === 0) evidence.push('Physiological recovery markers indicated lower restorative sleep');

      factors.push({
        id: 'factor_sleep_disruption',
        title: 'Sleep Rhythm Disruption & Energy Drain',
        confidence: scores.sleep <= 25 ? 'strong signal' : 'moderate signal',
        summary:
          'You reported compromised sleep quality or irregular rest, which magnifies emotional reactivity and lowers distress tolerance.',
        detailedAnalysis:
          'Sleep directly recalibrates the prefrontal cortex and amygdala. Reduced REM and deep sleep cycles reduce patience, elevate emotional friction, and make everyday challenges feel twice as heavy.',
        evidence,
        colorTheme: '#6366f1',
      });
    }

    // Future Uncertainty & Timeline Expectations
    if (
      scores.future_uncertainty >= 50 ||
      answerIds.has('opt_drive_future') ||
      answerIds.has('opt_fut_direction') ||
      answerIds.has('opt_fut_comparison') ||
      answerIds.has('opt_exp_falling_behind')
    ) {
      const isComparison = answerIds.has('opt_fut_comparison');
      const isBehind = answerIds.has('opt_exp_falling_behind');
      const isDirection = answerIds.has('opt_fut_direction');

      const evidence: string[] = [];
      if (isBehind) evidence.push('Reported feeling behind your own internalized timeline and milestones');
      if (isComparison) evidence.push('Noticed peer comparison triggers exaggerating feelings of inadequacy');
      if (isDirection) evidence.push('Identified lack of clarity regarding long-term career or life choices');
      if (evidence.length === 0) evidence.push('Future horizon inquiries showed elevated anticipation tension');

      factors.push({
        id: 'factor_future_uncertainty',
        title: 'Future Ambiguity & Timeline Pressure',
        confidence: scores.future_uncertainty > 65 ? 'strong signal' : 'moderate signal',
        summary:
          'Your responses suggest that uncertainty about next steps and comparison against internal milestones are adding underlying weight.',
        detailedAnalysis:
          'Human cognition naturally dislikes ambiguity. When the future feels undefined or when we compare our behind-the-scenes to others’ highlight reels, an ongoing background anxiety is generated.',
        evidence,
        colorTheme: '#8b5cf6',
      });
    }

    // Interpersonal & Social Dynamic Factor
    if (
      scores.relationships >= 45 ||
      scores.social <= 35 ||
      answerIds.has('opt_drive_relationships') ||
      answerIds.has('opt_rel_unresolved') ||
      answerIds.has('opt_rel_misunderstood') ||
      answerIds.has('opt_soc_withdrawn')
    ) {
      const isUnresolved = answerIds.has('opt_rel_unresolved');
      const isMisunderstood = answerIds.has('opt_rel_misunderstood');
      const isWithdrawn = answerIds.has('opt_soc_withdrawn');

      const evidence: string[] = [];
      if (isUnresolved) evidence.push('Indicated lingering interpersonal tension or unspoken friction');
      if (isMisunderstood) evidence.push('Expressed feeling emotionally unseen or solitary among peers');
      if (isWithdrawn) evidence.push('Noted recent social withdrawal and avoidance of outreach');

      factors.push({
        id: 'factor_relationship_dynamics',
        title: 'Interpersonal Friction or Disconnection',
        confidence: isUnresolved || isWithdrawn ? 'strong signal' : 'moderate signal',
        summary:
          'Patterns in your responses point toward relational friction, feeling unheard, or a temporary lack of deep emotional safety.',
        detailedAnalysis:
          'Social connection is a biological stabilizer. When important relationships feel strained or distant, the brain perceives this as a loss of safety, heightening internal loneliness or frustration.',
        evidence,
        colorTheme: '#ec4899',
      });
    }

    // Digital Overload & Comparison Loop
    if (
      answerIds.has('opt_dig_doomscroll') ||
      answerIds.has('opt_dig_comparison') ||
      answerIds.has('opt_dig_escape') ||
      answerIds.has('opt_fat_sensory')
    ) {
      const evidence: string[] = [];
      if (answerIds.has('opt_dig_doomscroll')) evidence.push('Compulsive phone checking and late-night scrolling habits');
      if (answerIds.has('opt_dig_comparison')) evidence.push('Exposure to algorithmic social media feeds causing contrast bias');
      if (answerIds.has('opt_dig_escape')) evidence.push('Using screen bingeing as an avoidance mechanism for stressful tasks');

      factors.push({
        id: 'factor_digital_overload',
        title: 'Digital Overstimulation & Comparison Loops',
        confidence: answerIds.has('opt_dig_doomscroll') ? 'strong signal' : 'moderate signal',
        summary:
          'Your answers indicate high screen density, algorithmic comparison, or digital numbing habits.',
        detailedAnalysis:
          'Continuous rapid micro-rewards from short-form feeds deplete dopamine baselines and amplify feelings of cognitive fog, making quiet reflection feel uncomfortable.',
        evidence,
        colorTheme: '#06b6d4',
      });
    }

    // Internal Self-Criticism Factor
    if (
      scores.confidence <= 35 ||
      answerIds.has('opt_self_critical') ||
      answerIds.has('opt_self_doubt') ||
      answerIds.has('opt_work_imposter')
    ) {
      const evidence: string[] = [];
      if (answerIds.has('opt_self_critical')) evidence.push('Self-talk characterized by harsh judgment and impatient standards');
      if (answerIds.has('opt_self_doubt')) evidence.push('Frequent second-guessing and self-trust erosion during decisions');
      if (answerIds.has('opt_work_imposter')) evidence.push('Imposter tendencies discounting personal accomplishments');

      factors.push({
        id: 'factor_self_criticism',
        title: 'Elevated Internal Self-Criticism',
        confidence: answerIds.has('opt_self_critical') ? 'strong signal' : 'moderate signal',
        summary:
          'A pattern of rigorous internal standards and self-blame is likely compounding existing external stress.',
        detailedAnalysis:
          'When we encounter external obstacles with an internal inner critic, the emotional cost doubles: we deal with the external problem plus internal punishment.',
        evidence,
        colorTheme: '#f43f5e',
      });
    }

    // Positive Milestone & Goal Momentum (For Happy / Motivated moods)
    if (
      mood.id === 'happy' ||
      mood.id === 'motivated' ||
      mood.id === 'excited' ||
      answerIds.has('opt_pos_achievement') ||
      answerIds.has('opt_pos_connection')
    ) {
      const evidence: string[] = [];
      if (answerIds.has('opt_pos_achievement')) evidence.push('Recent tangible achievement or goal execution');
      if (answerIds.has('opt_pos_connection')) evidence.push('Warm and reciprocal social resonance');
      if (scores.energy >= 70) evidence.push('High physical and cognitive energy reserves');

      factors.push({
        id: 'factor_positive_momentum',
        title: 'Goal Alignment & Vitality Surge',
        confidence: 'strong signal',
        summary:
          'Your answers reflect strong agency, recent wins, or restorative connections fueling positive emotional momentum.',
        detailedAnalysis:
          'When effort aligns with tangible results or social warmth, the dopaminergic and serotonergic systems create a sustained sense of optimism and enthusiasm.',
        evidence,
        colorTheme: '#10b981',
      });
    }

    // Fallback if very few matched
    if (factors.length === 0) {
      factors.push({
        id: 'factor_general_stress',
        title: 'Multifactorial Daily Friction',
        confidence: 'moderate signal',
        summary:
          'Your answers suggest a combination of small routine stressors rather than one single overwhelming driver.',
        detailedAnalysis:
          'Small micro-stressors across sleep, schedule, and environment can quietly stack up to produce emotional heaviness.',
        evidence: ['Accumulated micro-strains across multiple daily life dimensions'],
        colorTheme: '#00f2fe',
      });
    }

    return factors;
  }

  // --- 2. Reasoning Summary ---

  private static buildReasoningSummary(
    mood: MoodMeta,
    answers: UserAnswer[],
    factors: ContributingFactor[]
  ): string {
    const factorNames = factors.map((f) => f.title.toLowerCase()).join(', ');
    return `Based on your selection of feeling "${mood.label}" and your specific answers regarding ${answers
      .slice(0, 4)
      .map((a) => a.category.toLowerCase())
      .join(', ')}, the AI isolated patterns consistent with ${factorNames}. Rather than an isolated incident, these responses show how physiological rhythm, cognitive load, and environment interact to shape your current state.`;
  }

  // --- 3. Positive Signals Discovery ---

  private static extractPositiveSignals(
    answers: UserAnswer[],
    scores: DimensionScores
  ): PositiveSignal[] {
    const signals: PositiveSignal[] = [];
    const answerIds = new Set(answers.map((a) => a.selectedOptionId));

    // Self-Awareness & Engagement
    signals.push({
      id: 'pos_awareness',
      title: 'High Emotional Self-Awareness',
      description: 'You took the intentional step to inspect, articulate, and understand what you are feeling.',
      iconEmoji: '🧭',
    });

    if (answerIds.has('opt_anc_support') || scores.social >= 55) {
      signals.push({
        id: 'pos_support',
        title: 'Presence of Social Anchor',
        description: 'You recognize individuals in your circle who offer genuine listening and warmth.',
        iconEmoji: '🤝',
      });
    }

    if (answerIds.has('opt_anc_resilience') || scores.confidence >= 45) {
      signals.push({
        id: 'pos_resilience',
        title: 'Demonstrated Adaptability',
        description: 'You hold an implicit track record of navigating through past turbulent periods.',
        iconEmoji: '🛡️',
      });
    }

    if (answerIds.has('opt_anc_interests')) {
      signals.push({
        id: 'pos_hobbies',
        title: 'Active Creative/Personal Sanctuary',
        description: 'You preserve personal interests and passions outside of external demands.',
        iconEmoji: '🎨',
      });
    }

    if (answerIds.has('opt_self_compassionate')) {
      signals.push({
        id: 'pos_compassion',
        title: 'Constructive Self-Compassion',
        description: 'Your internal voice is capable of providing patience and kindness during challenges.',
        iconEmoji: '🌱',
      });
    }

    if (signals.length < 3) {
      signals.push({
        id: 'pos_reflection',
        title: 'Active Problem-Solving Readiness',
        description: 'By exploring your patterns, you are proactively moving toward mental clarity.',
        iconEmoji: '✨',
      });
    }

    return signals.slice(0, 4);
  }

  // --- 4. Practical Recommendations ---

  private static generateRecommendations(
    factors: ContributingFactor[],
    scores: DimensionScores
  ): PracticalRecommendation[] {
    const recs: PracticalRecommendation[] = [];
    const factorIds = new Set(factors.map((f) => f.id));

    if (factorIds.has('factor_academic_work')) {
      recs.push({
        id: 'rec_deconstruct',
        title: 'Deconstruct Work into Micro-Milestones',
        subtitle: 'Tackle the paralysis of large accumulated backlogs',
        category: 'Focus & Productivity',
        actions: [
          'Choose the single most nagging task and write down only the very next 10-minute action.',
          'Adopt the "Pomodoro Sprint": Work in 25-minute focused blocks with 5-minute complete detachment.',
          'Schedule an honest boundary time today where studying/work strictly stops.',
        ],
        durationTag: '15 min setup',
        iconName: 'Sparkles',
      });
    }

    if (factorIds.has('factor_sleep_disruption')) {
      recs.push({
        id: 'rec_sleep_buffer',
        title: 'Establish a 30-Minute Screen-Free Sunset Buffer',
        subtitle: 'Reset physiological melatonin and lower nervous system tone',
        category: 'Physical Restoration',
        actions: [
          'Set a gentle alarm 45 minutes before sleep to put phones in a charging spot away from the bed.',
          'Dim overhead lighting to low warm lamps to signal circadian transition to the brain.',
          'Do 5 minutes of gentle body stretches or deep diaphragmatic breathing in dim light.',
        ],
        durationTag: '30 min nightly',
        iconName: 'Moon',
      });
    }

    if (factorIds.has('factor_future_uncertainty')) {
      recs.push({
        id: 'rec_control_circle',
        title: 'Draw the "Circle of Direct Control"',
        subtitle: 'Separate actionable immediate steps from unanswerable long-term what-ifs',
        category: 'Mental Clarity',
        actions: [
          'Take a blank sheet and draw two concentric circles: "Direct Control" and "Out of My Hands".',
          'Place all looming worries into their respective zones to free up mental RAM.',
          'Focus 90% of today\'s attention strictly on the items inside your immediate circle.',
        ],
        durationTag: '10 min exercise',
        iconName: 'Compass',
      });
    }

    if (factorIds.has('factor_relationship_dynamics')) {
      recs.push({
        id: 'rec_rel_clarity',
        title: 'Low-Pressure Connection or Boundary Setting',
        subtitle: 'Ease social tension without exhausting confrontation',
        category: 'Relational Health',
        actions: [
          'Send a short, low-stakes text to one person you feel comfortable with, without needing to perform.',
          'If carrying someone else\'s load, permit yourself a temporary quiet window before replying.',
          'Draft what you actually need to communicate in your private notes before having a tricky conversation.',
        ],
        durationTag: '5 min action',
        iconName: 'Heart',
      });
    }

    if (factorIds.has('factor_digital_overload')) {
      recs.push({
        id: 'rec_digital_fast',
        title: 'Implement a 2-Hour Dopamine Fast',
        subtitle: 'Clear the mental chatter caused by rapid algorithmic switching',
        category: 'Digital Wellbeing',
        actions: [
          'Turn phone screen to Grayscale (Monochrome) mode in accessibility settings.',
          'Take a 20-minute walk outside without headphones or podcast audio.',
          'Allow yourself to experience 5 minutes of idle daydreaming without reaching for stimulation.',
        ],
        durationTag: '20 min walk',
        iconName: 'SmartphoneOff',
      });
    }

    // Universal default
    if (recs.length < 3) {
      recs.push({
        id: 'rec_physiological_sigh',
        title: 'Perform the Physiological Sigh Reset',
        subtitle: 'Neurobiologically proven quickest way to downshift acute stress',
        category: 'Nervous System',
        actions: [
          'Take two deep inhales through the nose (one deep breath, then a sharp top-off inhale).',
          'Release with a long, slow sigh through the mouth for 6 to 8 seconds.',
          'Repeat this cycle 3 to 5 times whenever tension peaks.',
        ],
        durationTag: '2 min exercise',
        iconName: 'Wind',
      });
    }

    return recs.slice(0, 3);
  }

  // --- 5. Reflection Questions ("Ask Yourself") ---

  private static generateReflectionQuestions(
    mood: MoodMeta,
    factors: ContributingFactor[],
    answers: UserAnswer[]
  ): ReflectionQuestion[] {
    const factorIds = new Set(factors.map((f) => f.id));
    const qs: ReflectionQuestion[] = [];

    if (factorIds.has('factor_future_uncertainty')) {
      qs.push({
        id: 'ref_control',
        question: 'What is one concrete thing that is 100% within your control in the next 24 hours?',
        contextHint: 'Focus on immediate agency rather than solving your whole 5-year trajectory today.',
      });
    }

    if (factorIds.has('factor_academic_work') || factorIds.has('factor_self_criticism')) {
      qs.push({
        id: 'ref_expectations',
        question: 'Is the heaviest pressure coming from your own internal expectations, or from someone else?',
        contextHint: 'Notice whether perfectionism is demanding more than what is realistically human.',
      });
    }

    if (factorIds.has('factor_sleep_disruption') || factorIds.has('factor_digital_overload')) {
      qs.push({
        id: 'ref_tomorrow_ease',
        question: 'What small friction could you remove today to make tomorrow 10% easier?',
        contextHint: 'A small proactive adjustment (e.g. going to bed 30 mins earlier, prepping breakfast).',
      });
    }

    if (qs.length < 3) {
      qs.push({
        id: 'ref_friend_advice',
        question: 'If your closest friend felt the exact same way you do right now, what would you say to them?',
        contextHint: 'Notice how much more gentle, understanding, and realistic you are with others.',
      });
    }

    return qs.slice(0, 3);
  }

  // --- 6. Emotional Snapshot Title & Subtitle ---

  private static generateSnapshotTitles(
    mood: MoodMeta,
    factors: ContributingFactor[],
    customDescription?: string
  ): { title: string; subtitle: string } {
    if (customDescription && customDescription.trim().length > 0) {
      return {
        title: `Nuanced State: "${customDescription.trim().slice(0, 40)}"`,
        subtitle: `Inferred patterns behind your custom emotional description.`,
      };
    }

    const topFactor = factors[0];
    const factorName = topFactor ? topFactor.title : 'Complex Daily Strains';

    switch (mood.id) {
      case 'stressed':
        return {
          title: 'Emotionally Overwhelmed & High Cognitive Load',
          subtitle: `Driven primarily by ${factorName} with reduced buffer space.`,
        };
      case 'anxious':
        return {
          title: 'Vigilant Anticipation & Mental Acceleration',
          subtitle: `Linked with ${factorName} and elevated background uncertainty.`,
        };
      case 'drained':
        return {
          title: 'Depleted Energy Reserves & Cognitive Fatigue',
          subtitle: `Characterized by ${factorName} and physiological sleep/rest deficits.`,
        };
      case 'lonely':
        return {
          title: 'Relational Isolation & Need for Safe Resonance',
          subtitle: `Associated with ${factorName} and reduced emotional buffering.`,
        };
      case 'sad':
        return {
          title: 'Quiet Heartache & Low Energy Submersion',
          subtitle: `Reflecting patterns of ${factorName} and internalized strain.`,
        };
      case 'angry':
        return {
          title: 'Friction Heat & Boundary Sensitivity',
          subtitle: `Stimulated by ${factorName} and perceived unfairness/blockages.`,
        };
      case 'confused':
        return {
          title: 'Decision Crossroads & Information Overload',
          subtitle: `Surrounding ${factorName} and conflicting pathways.`,
        };
      case 'motivated':
      case 'excited':
      case 'happy':
        return {
          title: 'Expansive Vitality & Positive Forward Momentum',
          subtitle: `Supported by strong alignment, personal agency, and rewarding milestones.`,
        };
      case 'numb':
        return {
          title: 'Protective Autopilot & Emotional Dampening',
          subtitle: `An adaptive defense response against prolonged ${factorName}.`,
        };
      default:
        return {
          title: `Emotional State: ${mood.label}`,
          subtitle: `Patterns indicate strong interplay with ${factorName}.`,
        };
    }
  }
}
