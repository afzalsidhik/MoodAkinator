import { Question, MoodId, DimensionScores, UserAnswer } from '../types';

export class QuestionEngine {
  // Initial baseline scores across dimensions
  public static getInitialDimensionScores(moodId: MoodId): DimensionScores {
    const base: DimensionScores = {
      stress: 20,
      energy: 50,
      social: 50,
      sleep: 50,
      academic_work: 20,
      relationships: 20,
      confidence: 50,
      future_uncertainty: 25,
    };

    switch (moodId) {
      case 'happy':
      case 'excited':
        base.energy = 85;
        base.confidence = 80;
        base.social = 75;
        base.stress = 10;
        break;
      case 'motivated':
        base.energy = 90;
        base.confidence = 85;
        base.academic_work = 40;
        base.stress = 25;
        break;
      case 'stressed':
        base.stress = 80;
        base.academic_work = 70;
        base.energy = 35;
        base.future_uncertainty = 60;
        break;
      case 'anxious':
        base.stress = 75;
        base.future_uncertainty = 85;
        base.confidence = 30;
        base.sleep = 30;
        break;
      case 'drained':
        base.energy = 15;
        base.sleep = 20;
        base.stress = 60;
        break;
      case 'lonely':
        base.social = 15;
        base.relationships = 65;
        base.confidence = 35;
        break;
      case 'angry':
        base.stress = 70;
        base.relationships = 60;
        base.energy = 70;
        break;
      case 'sad':
        base.energy = 25;
        base.social = 30;
        base.confidence = 30;
        base.stress = 50;
        break;
      case 'confused':
        base.future_uncertainty = 80;
        base.confidence = 35;
        base.academic_work = 50;
        break;
      case 'numb':
        base.energy = 20;
        base.social = 25;
        base.stress = 40;
        break;
      default:
        break;
    }

    return base;
  }

  // Generate the dynamic question flow based on mood and previous answers
  public static getNextQuestion(
    moodId: MoodId,
    answeredQuestions: UserAnswer[],
    currentScores: DimensionScores
  ): Question | null {
    const answeredIds = new Set(answeredQuestions.map(a => a.questionId));
    const totalAnswered = answeredQuestions.length;

    // Safety check: if last answer triggered crisis, engine stops immediately
    const lastAnswer = answeredQuestions[answeredQuestions.length - 1];
    if (lastAnswer && lastAnswer.selectedOptionId === 'opt_crisis') {
      return null;
    }

    // Check branch pointer from the latest answer
    const branchNextId = this.findBranchPointer(answeredQuestions);

    if (branchNextId && !answeredIds.has(branchNextId)) {
      const branchedQuestion = this.getQuestionById(branchNextId, moodId);
      if (branchedQuestion) return branchedQuestion;
    }

    // If reached 10-12 questions or high signal resolution, terminate
    if (totalAnswered >= 11) {
      return null;
    }

    // Adaptive Question Flow Progression:
    // Step 0: Intensity & Timeline
    if (!answeredIds.has('q_intensity')) {
      return this.getIntensityQuestion(moodId);
    }

    if (!answeredIds.has('q_time_onset')) {
      return this.getTimeOnsetQuestion(moodId);
    }

    // Step 1: Core Primary Root Driver (Narrowing Step 1)
    if (!answeredIds.has('q_primary_driver')) {
      return this.getPrimaryDriverQuestion(moodId);
    }

    // Step 2: Biological & Physical Foundation (Sleep & Energy)
    if (!answeredIds.has('q_sleep_state')) {
      return this.getSleepQuestion();
    }

    // Step 3: Social & Interpersonal Atmosphere
    if (!answeredIds.has('q_social_connection')) {
      return this.getSocialQuestion(moodId);
    }

    // Step 4: Digital & Cognitive Overload
    if (!answeredIds.has('q_digital_habits') && (currentScores.stress > 40 || currentScores.energy < 40)) {
      return this.getDigitalHabitsQuestion();
    }

    // Step 5: Internal Monologue & Expectations
    if (!answeredIds.has('q_internal_monologue')) {
      return this.getInternalMonologueQuestion();
    }

    // Step 6: Environment & Sensory Space
    if (!answeredIds.has('q_environment') && totalAnswered < 8) {
      return this.getEnvironmentQuestion();
    }

    // Step 7: Future Outlook & Horizons
    if (!answeredIds.has('q_future_horizon')) {
      return this.getFutureOutlookQuestion();
    }

    // Step 8: Positive Anchors & Resilience (What's helping right now)
    if (!answeredIds.has('q_positive_anchor')) {
      return this.getPositiveAnchorQuestion(moodId);
    }

    // Default termination after sufficient depth
    return null;
  }

  private static findBranchPointer(answeredQuestions: UserAnswer[]): string | null {
    // Look backwards through recent answers for a branch target
    for (let i = answeredQuestions.length - 1; i >= 0; i--) {
      const answer = answeredQuestions[i];
      const opt = this.getAllOptions().find(o => o.id === answer.selectedOptionId);
      if (opt && opt.branchNextQuestionId) {
        return opt.branchNextQuestionId;
      }
    }
    return null;
  }

  // --- Dynamic Question Generators ---

  private static getIntensityQuestion(moodId: MoodId): Question {
    return {
      id: 'q_intensity',
      category: 'Emotional',
      text: 'How intensely are you feeling this emotional state right now?',
      subtitle: 'Tune in to the present moment and sense the internal volume of this emotion.',
      options: [
        {
          id: 'opt_int_low',
          label: 'Subtle background hum',
          subtitle: 'Present, but easily manageable in daily flow',
          scoreImpact: { stress: -5, energy: +5 },
          shortcut: '1'
        },
        {
          id: 'opt_int_med',
          label: 'Noticeably present',
          subtitle: 'Takes up active mental real estate',
          scoreImpact: { stress: +10 },
          shortcut: '2'
        },
        {
          id: 'opt_int_high',
          label: 'Quite strong & loud',
          subtitle: 'Affects focus, conversations, or decisions',
          scoreImpact: { stress: +20, energy: -10 },
          shortcut: '3'
        },
        {
          id: 'opt_int_overwhelm',
          label: 'Completely overwhelming',
          subtitle: 'Dominates almost all thoughts and feelings',
          scoreImpact: { stress: +35, energy: -20 },
          shortcut: '4'
        }
      ]
    };
  }

  private static getTimeOnsetQuestion(moodId: MoodId): Question {
    return {
      id: 'q_time_onset',
      category: 'Time',
      text: 'When did this specific feeling start taking shape?',
      subtitle: 'Understanding the timeline helps isolate whether this is an acute reaction or a gradual accumulation.',
      options: [
        {
          id: 'opt_time_today',
          label: 'Just today / A few hours ago',
          subtitle: 'Triggered by a specific recent moment or thought',
          scoreImpact: { stress: +5 },
          shortcut: '1'
        },
        {
          id: 'opt_time_days',
          label: 'Over the last 2 to 4 days',
          subtitle: 'Gradually built up throughout the week',
          scoreImpact: { stress: +10, energy: -5 },
          shortcut: '2'
        },
        {
          id: 'opt_time_weeks',
          label: 'Persistently for a couple of weeks',
          subtitle: 'A steady pattern that has not cleared up',
          scoreImpact: { stress: +20, sleep: -10 },
          shortcut: '3'
        },
        {
          id: 'opt_time_long',
          label: 'It feels like it has been here for months',
          subtitle: 'A longer-standing baseline state',
          scoreImpact: { stress: +25, energy: -15, future_uncertainty: +15 },
          shortcut: '4'
        }
      ]
    };
  }

  private static getPrimaryDriverQuestion(moodId: MoodId): Question {
    const isPositive = moodId === 'happy' || moodId === 'motivated' || moodId === 'excited';

    if (isPositive) {
      return {
        id: 'q_primary_driver',
        category: 'Emotional',
        text: 'What is currently providing the biggest lift to your spirit?',
        subtitle: 'Let’s identify what is generating this positive momentum.',
        options: [
          {
            id: 'opt_pos_achievement',
            label: 'A personal or academic milestone',
            subtitle: 'Completed a project, exam, or goal',
            scoreImpact: { confidence: +25, energy: +15 },
            branchNextQuestionId: 'q_branch_college',
            shortcut: '1'
          },
          {
            id: 'opt_pos_connection',
            label: 'Heartwarming social or relationship moment',
            subtitle: 'Meaningful time with friends, partner, or family',
            scoreImpact: { social: +30, relationships: +20 },
            branchNextQuestionId: 'q_branch_relationships',
            shortcut: '2'
          },
          {
            id: 'opt_pos_clarity',
            label: 'Clarity & peace of mind',
            subtitle: 'Resolved an uncertainty or established good habits',
            scoreImpact: { confidence: +20, future_uncertainty: -20 },
            shortcut: '3'
          },
          {
            id: 'opt_pos_spontaneous',
            label: 'Just a naturally great day & fresh energy',
            subtitle: 'Good sleep, good weather, positive headspace',
            scoreImpact: { energy: +20, sleep: +20 },
            shortcut: '4'
          }
        ]
      };
    }

    return {
      id: 'q_primary_driver',
      category: 'Emotional',
      text: 'If you had to point to one primary area, where is the pressure centered?',
      subtitle: 'MOODAKINATOR will branch deeper into this specific area to narrow down the core factors.',
      options: [
        {
          id: 'opt_drive_college',
          label: 'College & Studies',
          subtitle: 'Exams, assignments, grades, attendance, or professors',
          scoreImpact: { academic_work: +35, stress: +20 },
          branchNextQuestionId: 'q_branch_college',
          shortcut: '1'
        },
        {
          id: 'opt_drive_work',
          label: 'Work & Career / Job Search',
          subtitle: 'Deadlines, interviews, workplace dynamics, or job hunting',
          scoreImpact: { academic_work: +35, future_uncertainty: +25 },
          branchNextQuestionId: 'q_branch_work',
          shortcut: '2'
        },
        {
          id: 'opt_drive_relationships',
          label: 'Relationships & Social Dynamics',
          subtitle: 'Partner, close friends, family friction, or loneliness',
          scoreImpact: { relationships: +35, social: -15 },
          branchNextQuestionId: 'q_branch_relationships',
          shortcut: '3'
        },
        {
          id: 'opt_drive_future',
          label: 'Future Uncertainty & Existential Direction',
          subtitle: 'Not knowing what comes next, career doubts, life path',
          scoreImpact: { future_uncertainty: +40, confidence: -20 },
          branchNextQuestionId: 'q_branch_future',
          shortcut: '4'
        },
        {
          id: 'opt_drive_physical',
          label: 'Physical Exhaustion & Sleep Deficit',
          subtitle: 'Burnout, insomnia, illness, or bodily fatigue',
          scoreImpact: { energy: -35, sleep: -30 },
          branchNextQuestionId: 'q_branch_fatigue',
          shortcut: '5'
        },
        {
          id: 'opt_drive_diffuse',
          label: 'A mix of everything / Hard to separate',
          subtitle: 'Multiple small things colliding at once',
          scoreImpact: { stress: +25, future_uncertainty: +20 },
          shortcut: '6'
        }
      ]
    };
  }

  // Branch Questions for Akinator Narrowing Effect
  private static getQuestionById(id: string, moodId: MoodId): Question | null {
    switch (id) {
      case 'q_branch_college':
        return {
          id: 'q_branch_college',
          category: 'Academic / Work',
          text: 'Which specific aspect of college is weighing on you the most?',
          subtitle: 'Narrowing down the exact academic friction point.',
          options: [
            {
              id: 'opt_acad_exams',
              label: 'Upcoming exams or test performance',
              subtitle: 'Fear of underperforming or syllabus volume',
              scoreImpact: { academic_work: +25, stress: +20 },
              shortcut: '1'
            },
            {
              id: 'opt_acad_deadlines',
              label: 'Piled-up assignments & project submissions',
              subtitle: 'Procrastination loop or sudden deadline crunch',
              scoreImpact: { academic_work: +20, energy: -15 },
              shortcut: '2'
            },
            {
              id: 'opt_acad_placements',
              label: 'Placements, internships, or campus hiring',
              subtitle: 'Resume anxiety, interviews, or peer comparison',
              scoreImpact: { future_uncertainty: +35, confidence: -20 },
              shortcut: '3'
            },
            {
              id: 'opt_acad_attendance',
              label: 'Attendance shortages or strict faculty/rules',
              subtitle: 'Institutional friction and loss of autonomy',
              scoreImpact: { stress: +20 },
              shortcut: '4'
            },
            {
              id: 'opt_acad_disconnection',
              label: 'Feeling disconnected from what I am studying',
              subtitle: 'Lack of interest, purpose, or enthusiasm for the major',
              scoreImpact: { future_uncertainty: +30, energy: -20 },
              shortcut: '5'
            }
          ]
        };

      case 'q_branch_work':
        return {
          id: 'q_branch_work',
          category: 'Academic / Work',
          text: 'What part of your work or professional life is generating the most strain?',
          subtitle: 'Identifying the primary workplace stressor.',
          options: [
            {
              id: 'opt_work_workload',
              label: 'Unrealistic workload or back-to-back deadlines',
              subtitle: 'Feeling constantly rushed with no breathing room',
              scoreImpact: { academic_work: +30, energy: -20 },
              shortcut: '1'
            },
            {
              id: 'opt_work_manager',
              label: 'Interpersonal friction with manager or team',
              subtitle: 'Micromanagement, lack of appreciation, or politics',
              scoreImpact: { relationships: +25, confidence: -15 },
              shortcut: '2'
            },
            {
              id: 'opt_work_imposter',
              label: 'Imposter feelings or fear of making mistakes',
              subtitle: 'Doubting competence despite delivering results',
              scoreImpact: { confidence: -35, stress: +25 },
              shortcut: '3'
            },
            {
              id: 'opt_work_boundary',
              label: 'Work bleeding into evenings and weekends',
              subtitle: 'Inability to fully disconnect when off the clock',
              scoreImpact: { sleep: -20, energy: -20 },
              shortcut: '4'
            }
          ]
        };

      case 'q_branch_relationships':
        return {
          id: 'q_branch_relationships',
          category: 'Relationships',
          text: 'What feels most tender or difficult in your relationships right now?',
          subtitle: 'Unpacking interpersonal dynamics and connection.',
          options: [
            {
              id: 'opt_rel_unresolved',
              label: 'An unresolved argument or awkward tension',
              subtitle: 'Words left unsaid or brewing resentment',
              scoreImpact: { relationships: +30, stress: +20 },
              shortcut: '1'
            },
            {
              id: 'opt_rel_misunderstood',
              label: 'Feeling emotionally misunderstood or unheard',
              subtitle: 'Surrounded by people yet feeling invisible',
              scoreImpact: { social: -25, confidence: -20 },
              shortcut: '2'
            },
            {
              id: 'opt_rel_distance',
              label: 'Drifting apart from friends or romantic partner',
              subtitle: 'Less communication, changes in life stages',
              scoreImpact: { social: -30, relationships: +20 },
              shortcut: '3'
            },
            {
              id: 'opt_rel_overgiving',
              label: 'Carrying everyone else\'s emotional problems',
              subtitle: 'Constantly supporting others while ignoring self-care',
              scoreImpact: { energy: -25, stress: +20 },
              shortcut: '4'
            }
          ]
        };

      case 'q_branch_future':
        return {
          id: 'q_branch_future',
          category: 'Expectations',
          text: 'When you look at the next 6 to 12 months, what triggers the unease?',
          subtitle: 'Dissecting future anticipation and life direction.',
          options: [
            {
              id: 'opt_fut_comparison',
              label: 'Seeing peers progress faster than me',
              subtitle: 'Comparing career milestones or social achievements',
              scoreImpact: { confidence: -30, future_uncertainty: +25 },
              shortcut: '1'
            },
            {
              id: 'opt_fut_direction',
              label: 'Uncertainty about which path to choose',
              subtitle: 'Too many options or lack of clear passion',
              scoreImpact: { future_uncertainty: +35 },
              shortcut: '2'
            },
            {
              id: 'opt_fut_finances',
              label: 'Financial stability & independent living',
              subtitle: 'Expenses, student debt, or income security',
              scoreImpact: { stress: +30, future_uncertainty: +25 },
              shortcut: '3'
            },
            {
              id: 'opt_fut_fear_failure',
              label: 'Fear of letting down family or myself',
              subtitle: 'High internal or external perfectionism bar',
              scoreImpact: { confidence: -25, stress: +30 },
              shortcut: '4'
            }
          ]
        };

      case 'q_branch_fatigue':
        return {
          id: 'q_branch_fatigue',
          category: 'Physical',
          text: 'What kind of exhaustion is dominating your physical sensation?',
          subtitle: 'Separating cognitive burnout from physiological sleep debt.',
          options: [
            {
              id: 'opt_fat_sleep',
              label: 'Severe lack of quality sleep / Insomnia',
              subtitle: 'Tossing and turning, waking up unrested',
              scoreImpact: { sleep: -40, energy: -30 },
              shortcut: '1'
            },
            {
              id: 'opt_fat_sensory',
              label: 'Digital / Screen overload & eye strain',
              subtitle: 'Staring at screens 10+ hours without fresh air',
              scoreImpact: { energy: -20, stress: +15 },
              shortcut: '2'
            },
            {
              id: 'opt_fat_mental',
              label: 'Mental overdrive with zero quiet time',
              subtitle: 'Brain running in the background non-stop',
              scoreImpact: { stress: +30, energy: -25 },
              shortcut: '3'
            },
            {
              id: 'opt_fat_sedentary',
              label: 'Stagnant routine & low movement',
              subtitle: 'Staying in the same room for days on end',
              scoreImpact: { energy: -20, confidence: -10 },
              shortcut: '4'
            }
          ]
        };

      default:
        return null;
    }
  }

  private static getSleepQuestion(): Question {
    return {
      id: 'q_sleep_state',
      category: 'Sleep',
      text: 'How has your sleep rhythm felt over the past few nights?',
      subtitle: 'Sleep is the foundation for cognitive regulation and emotional resilience.',
      options: [
        {
          id: 'opt_slp_good',
          label: 'Deep, regular, and restful',
          subtitle: 'Waking up refreshed with stable energy',
          scoreImpact: { sleep: +30, energy: +20, stress: -15 },
          shortcut: '1'
        },
        {
          id: 'opt_slp_delayed',
          label: 'Staying up very late scrolling / overthinking',
          subtitle: 'Delayed sleep onset, waking up groggy',
          scoreImpact: { sleep: -25, energy: -20, stress: +15 },
          shortcut: '2'
        },
        {
          id: 'opt_slp_interrupted',
          label: 'Broken, light sleep with frequent wakeups',
          subtitle: 'Brain remains vigilant even while sleeping',
          scoreImpact: { sleep: -35, stress: +20 },
          shortcut: '3'
        },
        {
          id: 'opt_slp_oversleep',
          label: 'Sleeping a lot but still feeling exhausted',
          subtitle: 'Low restorative power, lingering fatigue',
          scoreImpact: { energy: -30, sleep: -15 },
          shortcut: '4'
        }
      ]
    };
  }

  private static getSocialQuestion(moodId: MoodId): Question {
    return {
      id: 'q_social_connection',
      category: 'Social',
      text: 'Have you had meaningful connection with people you trust recently?',
      subtitle: 'Social buffering drastically alters how our nervous system processes stress.',
      options: [
        {
          id: 'opt_soc_strong',
          label: 'Yes, I feel warmly supported and heard',
          subtitle: 'People around me understand and have my back',
          scoreImpact: { social: +35, confidence: +20, stress: -15 },
          shortcut: '1'
        },
        {
          id: 'opt_soc_surface',
          label: 'Interacting regularly, but mostly surface-level',
          subtitle: 'Polite small talk, but not sharing real thoughts',
          scoreImpact: { social: +5, relationships: +10 },
          shortcut: '2'
        },
        {
          id: 'opt_soc_withdrawn',
          label: 'I\'ve been pulling away and isolating myself',
          subtitle: 'Avoiding texts, canceling plans, staying in my shell',
          scoreImpact: { social: -35, confidence: -15, stress: +15 },
          shortcut: '3'
        },
        {
          id: 'opt_soc_drained',
          label: 'Socializing feels like a draining performance',
          subtitle: 'Masking my true state to avoid worrying others',
          scoreImpact: { energy: -25, social: -15, stress: +20 },
          shortcut: '4'
        }
      ]
    };
  }

  private static getDigitalHabitsQuestion(): Question {
    return {
      id: 'q_digital_habits',
      category: 'Digital habits',
      text: 'What has your relationship with your phone or screen time looked like lately?',
      subtitle: 'Excessive dopamine spikes and algorithmic comparison directly feed emotional fog.',
      options: [
        {
          id: 'opt_dig_doomscroll',
          label: 'Compulsive doomscrolling & mindless phone checks',
          subtitle: 'Reaching for phone first thing in morning & before bed',
          scoreImpact: { stress: +20, energy: -15, confidence: -15 },
          shortcut: '1'
        },
        {
          id: 'opt_dig_comparison',
          label: 'Triggered by seeing highlight reels of others',
          subtitle: 'Feeling left behind or inadequate after scrolling',
          scoreImpact: { confidence: -30, future_uncertainty: +20 },
          shortcut: '2'
        },
        {
          id: 'opt_dig_escape',
          label: 'Using content (YouTube, gaming, reels) as an escape',
          subtitle: 'Avoiding difficult tasks or emotions via bingeing',
          scoreImpact: { academic_work: +20, stress: +15 },
          shortcut: '3'
        },
        {
          id: 'opt_dig_balanced',
          label: 'Healthy & intentional screen time',
          subtitle: 'Using tech as a tool without getting sucked in',
          scoreImpact: { energy: +10, confidence: +10 },
          shortcut: '4'
        }
      ]
    };
  }

  private static getInternalMonologueQuestion(): Question {
    return {
      id: 'q_internal_monologue',
      category: 'Self-perception',
      text: 'How has your internal voice spoken to you when you hit obstacles lately?',
      subtitle: 'The tone of self-talk is one of the clearest mirrors of underlying stress.',
      options: [
        {
          id: 'opt_self_critical',
          label: 'Harsh, impatient, and self-blaming',
          subtitle: 'Telling myself "you should have done better" or "why are you like this"',
          scoreImpact: { confidence: -35, stress: +25 },
          shortcut: '1'
        },
        {
          id: 'opt_self_doubt',
          label: 'Hesitant and second-guessing every choice',
          subtitle: 'Analysis paralysis and lack of trust in own decisions',
          scoreImpact: { confidence: -25, future_uncertainty: +25 },
          shortcut: '2'
        },
        {
          id: 'opt_self_compassionate',
          label: 'Kind, patient, and understanding',
          subtitle: 'Giving myself grace and acknowledging that things take time',
          scoreImpact: { confidence: +25, stress: -15 },
          shortcut: '3'
        },
        {
          id: 'opt_self_detached',
          label: 'Quiet / Numb / Autopilot',
          subtitle: 'Not much emotional commentary, just pushing through',
          scoreImpact: { energy: -15 },
          shortcut: '4'
        }
      ]
    };
  }

  private static getEnvironmentQuestion(): Question {
    return {
      id: 'q_environment',
      category: 'Environment',
      text: 'How does your physical living / study environment feel right now?',
      subtitle: 'Surrounding chaos often mirrors or amplifies cognitive clutter.',
      options: [
        {
          id: 'opt_env_cluttered',
          label: 'Cluttered desk/room, laundry or papers accumulating',
          subtitle: 'Visual clutter making it hard to settle the mind',
          scoreImpact: { stress: +15, energy: -10 },
          shortcut: '1'
        },
        {
          id: 'opt_env_confined',
          label: 'Stuck indoors / Cabin fever',
          subtitle: 'Lack of sunlight, nature, or changes in scenery',
          scoreImpact: { energy: -20, social: -10 },
          shortcut: '2'
        },
        {
          id: 'opt_env_noisy',
          label: 'Noisy, chaotic, or lack of private quiet space',
          subtitle: 'Difficulty finding peace without interruptions',
          scoreImpact: { stress: +20 },
          shortcut: '3'
        },
        {
          id: 'opt_env_peaceful',
          label: 'Clean, comfortable, and organized space',
          subtitle: 'A calming environment that feels supportive',
          scoreImpact: { stress: -15, energy: +10 },
          shortcut: '4'
        }
      ]
    };
  }

  private static getFutureOutlookQuestion(): Question {
    return {
      id: 'q_future_horizon',
      category: 'Expectations',
      text: 'Do you feel you are meeting your own internal expectations?',
      subtitle: 'The gap between where we are and where we think we "should" be.',
      options: [
        {
          id: 'opt_exp_falling_behind',
          label: 'I feel noticeably behind where I expected to be',
          subtitle: 'An internalized pressure that time is slipping away',
          scoreImpact: { confidence: -30, future_uncertainty: +30 },
          shortcut: '1'
        },
        {
          id: 'opt_exp_on_track',
          label: 'Generally progressing at a reasonable pace',
          subtitle: 'There are hiccups, but the trajectory is okay',
          scoreImpact: { confidence: +20, future_uncertainty: -15 },
          shortcut: '2'
        },
        {
          id: 'opt_exp_lost',
          label: 'I honestly do not know what my expectations are anymore',
          subtitle: 'Shifting goals or questioning earlier assumptions',
          scoreImpact: { future_uncertainty: +35 },
          shortcut: '3'
        },
        {
          id: 'opt_exp_external',
          label: 'Trying to meet everyone else\'s high expectations',
          subtitle: 'Living under family, peer, or cultural pressure',
          scoreImpact: { stress: +30, confidence: -15 },
          shortcut: '4'
        }
      ]
    };
  }

  private static getPositiveAnchorQuestion(moodId: MoodId): Question {
    return {
      id: 'q_positive_anchor',
      category: 'Emotional',
      text: 'Even amidst your current feelings, what is something that is still working for you?',
      subtitle: 'Identifying latent resilience anchors and positive ground.',
      options: [
        {
          id: 'opt_anc_support',
          label: 'Having at least one reliable friend or family member',
          subtitle: 'Someone who listens without judgment',
          scoreImpact: { social: +25, confidence: +15 },
          shortcut: '1'
        },
        {
          id: 'opt_anc_resilience',
          label: 'My ability to adapt and figure things out eventually',
          subtitle: 'Past proof that I have handled tough times before',
          scoreImpact: { confidence: +30, energy: +15 },
          shortcut: '2'
        },
        {
          id: 'opt_anc_interests',
          label: 'A personal hobby, music, fitness, or creative outlet',
          subtitle: 'A small sanctuary where I feel like myself',
          scoreImpact: { energy: +20, stress: -15 },
          shortcut: '3'
        },
        {
          id: 'opt_anc_awareness',
          label: 'Being self-aware enough to reflect on this right now',
          subtitle: 'Actively seeking clarity instead of remaining numb',
          scoreImpact: { confidence: +20, future_uncertainty: -10 },
          shortcut: '4'
        }
      ]
    };
  }

  private static getAllOptions() {
    // Collect all options for fast lookup
    return [
      { id: 'opt_drive_college', branchNextQuestionId: 'q_branch_college' },
      { id: 'opt_pos_achievement', branchNextQuestionId: 'q_branch_college' },
      { id: 'opt_drive_work', branchNextQuestionId: 'q_branch_work' },
      { id: 'opt_drive_relationships', branchNextQuestionId: 'q_branch_relationships' },
      { id: 'opt_pos_connection', branchNextQuestionId: 'q_branch_relationships' },
      { id: 'opt_drive_future', branchNextQuestionId: 'q_branch_future' },
      { id: 'opt_drive_physical', branchNextQuestionId: 'q_branch_fatigue' },
    ];
  }
}
