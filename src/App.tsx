import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Globe,
  BookOpen,
  CheckCheck,
  ClipboardList,
  Layers,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Loader2,
  PartyPopper,
  NotebookPen,
  StickyNote,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Unlock,
  Send,
} from 'lucide-react';
import {
  ActiveTab,
  CustomFlashcard,
  FlashcardDifficulty,
  Language,
  MistakeReasonTagId,
  QuestionEvaluation,
  QuestionItem,
  RoundNumber,
} from './types/exam';
import {
  DEFAULT_LATEST_EDITION_ID,
  EXAM_EDITIONS,
  evaluateQuestionItem,
  getEditionById,
  i18n,
} from './data/examRegistry';
import {
  playCorrectSound,
  playPartialSound,
  playWrongSound,
  playApplauseSound,
} from './utils/soundEffects';
import { CelebrationFireworks } from './components/CelebrationFireworks';
import {
  DIFFICULTY_TICKET_WEIGHT,
  FlashcardReviewTab,
  QuestionAdvancedToolbar,
  renderRedHighlightedText,
} from './components/FlashcardStudyPanel';
import {
  TelegramResultModal,
  WorkerAuthModal,
  WorkerHouseCheckScreen,
} from './components/WorkerTelegramModal';

export default function App() {
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [hasCompletedWorkerCheckStep, setHasCompletedWorkerCheckStep] =
    useState<boolean>(false);
  const [currentEditionId, setCurrentEditionId] = useState<string>(
    DEFAULT_LATEST_EDITION_ID
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>(1);
  const [roundSeed, setRoundSeed] = useState<number>(0);

  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<
    Record<number, QuestionEvaluation>
  >({});
  const [isAllGraded, setIsAllGraded] = useState(false);

  // Sound mute state (persisted in localStorage)
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('exam_sound_muted') === 'true';
    } catch {
      return false;
    }
  });

  // Advanced Study Mode state (persisted in localStorage)
  const [isAdvancedStudyOn, setIsAdvancedStudyOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('exam_advanced_study_on') === 'true';
    } catch {
      return false;
    }
  });

  // Ecuador Worker House mode state (unlocked via secret code 144000)
  const [isWorkerModeUnlocked, setIsWorkerModeUnlocked] = useState<boolean>(
    () => {
      try {
        return localStorage.getItem('exam_worker_mode_unlocked') === 'true';
      } catch {
        return false;
      }
    }
  );
  const [isWorkerAuthModalOpen, setIsWorkerAuthModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  // Persistent study notes map: key = `${editionId}_${lang}_${questionId}`
  const [studyNotes, setStudyNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('exam_study_notes_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persistent mistake reason tags map: key = `${editionId}_${lang}_${questionId}`
  const [mistakeTagsByKey, setMistakeTagsByKey] = useState<
    Record<string, MistakeReasonTagId[]>
  >(() => {
    try {
      const saved = localStorage.getItem('exam_mistake_tags_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persistent frequently missed keywords counter map: key = `${editionId}_${lang}_${questionId}` -> { [keyword]: count }
  const [missedKeywordsByKey, setMissedKeywordsByKey] = useState<
    Record<string, Record<string, number>>
  >(() => {
    try {
      const saved = localStorage.getItem('exam_missed_keywords_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persistent self-made flashcards array
  const [customFlashcards, setCustomFlashcards] = useState<CustomFlashcard[]>(
    () => {
      try {
        const saved = localStorage.getItem('exam_custom_flashcards_v1');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
  );

  // Notes tab filter ('all' | 'written') and model answer visibility toggle
  const [notesFilter, setNotesFilter] = useState<'all' | 'written'>('all');
  const [showAnswersInNotes, setShowAnswersInNotes] = useState<boolean>(true);

  // Track which question IDs have their inline note editor open (strictly 1 box at a time)
  const [openNoteEditors, setOpenNoteEditors] = useState<
    Record<number, boolean>
  >({});

  const toggleNoteEditor = (questionId: number) => {
    setOpenNoteEditors((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Loading spinner state for "Grade All" button (1 second delay)
  const [isGradingAll, setIsGradingAll] = useState(false);
  const gradeTimerRef = useRef<number | null>(null);

  // Animation states for smooth card vertical bounce and perfect score fireworks
  const [bouncingAllCards, setBouncingAllCards] = useState(false);
  const [bouncingSingleId, setBouncingSingleId] = useState<number | null>(null);
  const bounceResetTimerRef = useRef<number | null>(null);
  const [celebrationKey, setCelebrationKey] = useState(0);

  // Track whether the bottom-right edition switcher menu is open
  const [isEditionMenuOpen, setIsEditionMenuOpen] = useState(false);

  // Track whether a question was just graded and is waiting for a second Enter press to jump to the next question
  const [readyToAdvanceMap, setReadyToAdvanceMap] = useState<
    Record<number, boolean>
  >({});
  const gradeBtnRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  useEffect(() => {
    return () => {
      if (gradeTimerRef.current) {
        window.clearTimeout(gradeTimerRef.current);
      }
      if (bounceResetTimerRef.current) {
        window.clearTimeout(bounceResetTimerRef.current);
      }
    };
  }, []);

  const handleToggleSound = () => {
    setIsSoundMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('exam_sound_muted', String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleToggleAdvancedStudy = () => {
    setIsAdvancedStudyOn((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('exam_advanced_study_on', String(next));
      } catch {
        // Ignore storage errors
      }
      if (!next && (activeTab === 'notes' || activeTab === 'flashcards')) {
        setActiveTab(1);
      }
      return next;
    });
  };

  const handleUnlockWorkerMode = () => {
    setIsWorkerModeUnlocked(true);
    try {
      localStorage.setItem('exam_worker_mode_unlocked', 'true');
    } catch {
      // Ignore storage errors
    }
  };

  const handleLockWorkerMode = () => {
    setIsWorkerModeUnlocked(false);
    setIsTelegramModalOpen(false);
    try {
      localStorage.setItem('exam_worker_mode_unlocked', 'false');
    } catch {
      // Ignore storage errors
    }
  };

  const getNoteKey = (questionId: number, lang: Language = selectedLang || 'ko') =>
    `${currentEditionId}_${lang}_${questionId}`;

  const handleNoteChange = (questionId: number, value: string) => {
    if (!selectedLang) return;
    const key = getNoteKey(questionId, selectedLang);
    setStudyNotes((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem('exam_study_notes_v1', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleToggleQuestionMistakeTag = (
    questionId: number,
    tagId: MistakeReasonTagId
  ) => {
    if (!selectedLang) return;
    const key = getNoteKey(questionId, selectedLang);
    setMistakeTagsByKey((prev) => {
      const current = prev[key] || [];
      const exists = current.includes(tagId);
      const updated = exists
        ? current.filter((t) => t !== tagId)
        : [...current, tagId];
      const next = { ...prev, [key]: updated };
      try {
        localStorage.setItem('exam_mistake_tags_v1', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const recordMissedKeywordsForEvaluation = (
    evalResults: QuestionEvaluation[]
  ) => {
    if (!selectedLang) return;
    setMissedKeywordsByKey((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const qEval of evalResults) {
        const key = getNoteKey(qEval.questionId, selectedLang);
        const existingMap = { ...(next[key] || {}) };
        for (const pr of qEval.partResults) {
          if (!pr.passed && pr.missingKeywords.length > 0) {
            for (const kw of pr.missingKeywords) {
              existingMap[kw] = (existingMap[kw] || 0) + 1;
              changed = true;
            }
          }
        }
        if (Object.keys(existingMap).length > 0) {
          next[key] = existingMap;
        }
      }

      if (changed) {
        try {
          localStorage.setItem('exam_missed_keywords_v1', JSON.stringify(next));
        } catch {
          // Ignore storage errors
        }
      }
      return changed ? next : prev;
    });
  };

  const handleClearMissedKeywords = (questionId: number) => {
    if (!selectedLang) return;
    const key = getNoteKey(questionId, selectedLang);
    setMissedKeywordsByKey((prev) => {
      const next = { ...prev };
      delete next[key];
      try {
        localStorage.setItem('exam_missed_keywords_v1', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleSaveFlashcard = (
    questionId: number,
    cardData: {
      id?: string;
      front: string;
      back: string;
      warningKeywords: string[];
      mistakeTags: MistakeReasonTagId[];
    }
  ) => {
    if (!selectedLang) return;
    setCustomFlashcards((prev) => {
      let next: CustomFlashcard[];
      if (cardData.id) {
        next = prev.map((c) =>
          c.id === cardData.id
            ? {
                ...c,
                front: cardData.front,
                back: cardData.back,
                warningKeywords: cardData.warningKeywords,
                mistakeTags: cardData.mistakeTags,
              }
            : c
        );
      } else {
        const newCard: CustomFlashcard = {
          id: `fc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          editionId: currentEditionId,
          lang: selectedLang,
          questionId,
          front: cardData.front,
          back: cardData.back,
          warningKeywords: cardData.warningKeywords,
          mistakeTags: cardData.mistakeTags,
          difficulty: 'hard',
          exposureCount: 0,
          remainingTickets: DIFFICULTY_TICKET_WEIGHT.hard,
          createdAt: Date.now(),
        };
        next = [...prev, newCard];
      }
      try {
        localStorage.setItem('exam_custom_flashcards_v1', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleDeleteFlashcard = (cardId: string) => {
    setCustomFlashcards((prev) => {
      const next = prev.filter((c) => c.id !== cardId);
      try {
        localStorage.setItem('exam_custom_flashcards_v1', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleRateFlashcard = (
    cardId: string,
    difficulty: FlashcardDifficulty
  ) => {
    setCustomFlashcards((prev) => {
      const next = prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              difficulty,
              exposureCount: c.exposureCount + 1,
              remainingTickets: DIFFICULTY_TICKET_WEIGHT[difficulty],
            }
          : c
      );
      try {
        localStorage.setItem('exam_custom_flashcards_v1', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleResetAllCardExposures = () => {
    if (!selectedLang) return;
    setCustomFlashcards((prev) => {
      const next = prev.map((c) =>
        c.editionId === currentEditionId && c.lang === selectedLang
          ? { ...c, exposureCount: 0 }
          : c
      );
      try {
        localStorage.setItem('exam_custom_flashcards_v1', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const clearPendingGradeTimer = () => {
    if (gradeTimerRef.current) {
      window.clearTimeout(gradeTimerRef.current);
      gradeTimerRef.current = null;
    }
    if (bounceResetTimerRef.current) {
      window.clearTimeout(bounceResetTimerRef.current);
      bounceResetTimerRef.current = null;
    }
    setIsGradingAll(false);
    setBouncingAllCards(false);
    setBouncingSingleId(null);
  };

  const currentEdition = getEditionById(currentEditionId);

  const handleSelectLanguage = (lang: Language) => {
    clearPendingGradeTimer();
    setSelectedLang(lang);
    setHasCompletedWorkerCheckStep(false);
    setActiveTab(1);
    setUserInputs({});
    setEvaluations({});
    setReadyToAdvanceMap({});
    setIsAllGraded(false);
  };

  const handleReturnToLangScreen = () => {
    clearPendingGradeTimer();
    setSelectedLang(null);
    setHasCompletedWorkerCheckStep(false);
    setUserInputs({});
    setEvaluations({});
    setReadyToAdvanceMap({});
    setIsAllGraded(false);
    setIsEditionMenuOpen(false);
  };

  const handleSwitchTab = (tab: ActiveTab) => {
    clearPendingGradeTimer();
    if ((tab === 'notes' || tab === 'flashcards') && !isAdvancedStudyOn) {
      setIsAdvancedStudyOn(true);
      try {
        localStorage.setItem('exam_advanced_study_on', 'true');
      } catch {
        // Ignore storage errors
      }
    }
    setActiveTab(tab);
    setUserInputs({});
    setEvaluations({});
    setReadyToAdvanceMap({});
    setIsAllGraded(false);
  };

  const handleSwitchEdition = (editionId: string) => {
    clearPendingGradeTimer();
    setCurrentEditionId(editionId);
    setActiveTab(1);
    setUserInputs({});
    setEvaluations({});
    setReadyToAdvanceMap({});
    setIsAllGraded(false);
    setIsEditionMenuOpen(false);
  };

  const handleResetCurrentExam = (scrollToTop = false) => {
    clearPendingGradeTimer();
    setRoundSeed((s) => s + 1);
    setUserInputs({});
    setEvaluations({});
    setReadyToAdvanceMap({});
    setIsAllGraded(false);
    setCelebrationKey(0);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInputChange = (
    partId: string,
    value: string,
    questionId?: number
  ) => {
    setUserInputs((prev) => ({
      ...prev,
      [partId]: value,
    }));
    if (questionId !== undefined) {
      setReadyToAdvanceMap((prev) =>
        prev[questionId] ? { ...prev, [questionId]: false } : prev
      );
    }
  };

  // Determine the ordered list of question IDs for the active tab
  const activeQuestionIds = useMemo(() => {
    if (
      activeTab === 'mock' ||
      activeTab === 'notes' ||
      activeTab === 'flashcards'
    ) {
      // Sequential 1 -> N order
      return currentEdition.allQuestionIds;
    }
    return currentEdition.getRoundQuestionIds(activeTab);
  }, [currentEdition, activeTab, roundSeed]);

  // 1. Initial Language Selection Screen
  if (!selectedLang) {
    const koLatest = currentEdition.locales.ko;
    const esLatest = currentEdition.locales.es;

    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-5">
            <BookOpen className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            {koLatest.title}
          </h1>
          <p className="text-base font-semibold text-slate-700 mb-6">
            {esLatest.title}
          </p>

          <div className="h-px bg-slate-200 my-6" />

          <div className="flex flex-col gap-3.5">
            <button
              type="button"
              onClick={() => handleSelectLanguage('ko')}
              className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              한국어
            </button>

            <button
              type="button"
              onClick={() => handleSelectLanguage('es')}
              className="w-full py-4 px-6 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-blue-600 border-2 border-blue-600 font-bold text-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Español
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Workspace (100% Korean or 100% Spanish)
  const t = i18n[selectedLang];
  const localeData = currentEdition.locales[selectedLang];

  // Step 2: Immediate Post-Language Selection Screen ("에콰도르 숙소사명자 O / 숙소사명자 X")
  if (!hasCompletedWorkerCheckStep) {
    return (
      <WorkerHouseCheckScreen
        title={localeData.title}
        subtitle="에콰도르 숙소사명자 / Obrero de la casa de obreros"
        t={t}
        onCompleteWorkerO={() => {
          handleUnlockWorkerMode();
          setHasCompletedWorkerCheckStep(true);
        }}
        onCompleteWorkerX={() => {
          handleLockWorkerMode();
          setHasCompletedWorkerCheckStep(true);
        }}
        onBackToLang={handleReturnToLangScreen}
      />
    );
  }

  const isDataUploaded =
    localeData.isUploaded !== false &&
    Object.keys(localeData.questions).length > 0;

  const activeQuestions: QuestionItem[] = isDataUploaded
    ? activeQuestionIds
        .map((id) => localeData.questions[id])
        .filter((q): q is QuestionItem => Boolean(q))
    : [];

  const allSequentialQuestions: QuestionItem[] = isDataUploaded
    ? currentEdition.allQuestionIds
        .map((id) => localeData.questions[id])
        .filter((q): q is QuestionItem => Boolean(q))
    : [];

  const writtenNotesCount = allSequentialQuestions.filter(
    (q) => (studyNotes[getNoteKey(q.id, selectedLang)] || '').trim().length > 0
  ).length;

  // Find the most recent edition that actually has uploaded data for this language
  const fallbackAvailableEdition = EXAM_EDITIONS.find(
    (ed) =>
      ed.id !== currentEditionId &&
      ed.locales[selectedLang].isUploaded !== false &&
      Object.keys(ed.locales[selectedLang].questions).length > 0
  );

  const focusQuestionFirstInput = (targetQuestionIndex: number) => {
    if (activeQuestions.length === 0) return;
    const normalizedIdx =
      ((targetQuestionIndex % activeQuestions.length) +
        activeQuestions.length) %
      activeQuestions.length;
    const targetQuestion = activeQuestions[normalizedIdx];
    const firstPartId = targetQuestion?.parts[0]?.id;
    if (!firstPartId) return;

    const inputEl = document.getElementById(`input-${firstPartId}`) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputEl.focus({ preventScroll: true });
    }
  };

  const handleGradeSingle = (question: QuestionItem, keepButtonFocus = true) => {
    const result = evaluateQuestionItem(question, userInputs);
    const updatedEvals = {
      ...evaluations,
      [question.id]: result,
    };
    setEvaluations(updatedEvals);
    recordMissedKeywordsForEvaluation([result]);
    setReadyToAdvanceMap((prev) => ({
      ...prev,
      [question.id]: true,
    }));

    setBouncingSingleId(null);
    window.requestAnimationFrame(() => {
      setBouncingSingleId(question.id);
      if (keepButtonFocus) {
        gradeBtnRefs.current[question.id]?.focus({ preventScroll: true });
      }
    });
    if (bounceResetTimerRef.current) {
      window.clearTimeout(bounceResetTimerRef.current);
    }
    bounceResetTimerRef.current = window.setTimeout(() => {
      setBouncingSingleId(null);
    }, 600);

    // Check if every question in the current round is now 100% passed
    const isNowAllPerfect =
      activeQuestions.length > 0 &&
      activeQuestions.every((q) => updatedEvals[q.id]?.allPassed);

    if (result.allPassed) {
      playCorrectSound(isSoundMuted);
      if (isNowAllPerfect) {
        setCelebrationKey((k) => k + 1);
        window.setTimeout(() => {
          playApplauseSound(isSoundMuted);
        }, 180);
      }
    } else if (result.earnedPoints > 0) {
      playPartialSound(isSoundMuted);
    } else {
      playWrongSound(isSoundMuted);
    }
  };

  const handleGradeAll = () => {
    if (isGradingAll) return;
    setIsGradingAll(true);
    setBouncingAllCards(false);

    if (gradeTimerRef.current) {
      window.clearTimeout(gradeTimerRef.current);
    }

    gradeTimerRef.current = window.setTimeout(() => {
      const newEvals: Record<number, QuestionEvaluation> = {};
      const evalList: QuestionEvaluation[] = [];
      for (const q of activeQuestions) {
        const res = evaluateQuestionItem(q, userInputs);
        newEvals[q.id] = res;
        evalList.push(res);
      }
      setEvaluations(newEvals);
      recordMissedKeywordsForEvaluation(evalList);
      setIsAllGraded(true);
      setIsGradingAll(false);
      setBouncingAllCards(true);
      gradeTimerRef.current = null;

      if (bounceResetTimerRef.current) {
        window.clearTimeout(bounceResetTimerRef.current);
      }
      bounceResetTimerRef.current = window.setTimeout(() => {
        setBouncingAllCards(false);
      }, 950);

      // Check if all questions in this round passed 100%
      const isAllPerfect =
        activeQuestions.length > 0 &&
        activeQuestions.every((q) => newEvals[q.id]?.allPassed);

      if (isAllPerfect) {
        setCelebrationKey((k) => k + 1);
        playApplauseSound(isSoundMuted);
      }
    }, 1000);
  };

  const totalMaxPoints = activeQuestions.reduce(
    (acc, q) => acc + q.totalPoints,
    0
  );
  const totalEarnedPoints = activeQuestions.reduce(
    (acc, q) => acc + (evaluations[q.id]?.earnedPoints ?? 0),
    0
  );
  const totalPassedQuestions = activeQuestions.filter(
    (q) => evaluations[q.id]?.allPassed
  ).length;
  const isPerfectRound =
    activeQuestions.length > 0 &&
    totalPassedQuestions === activeQuestions.length;
  const hasAnyEvaluation = Object.keys(evaluations).length > 0;

  const renderFormattedPassage = (passage: string) => {
    const lines = passage.split('\n');
    return lines.map((line, lineIdx) => {
      const segments = line.split(/(\([^()\n]*[①②③④⑤][^()\n]*\)|\(\s+\))/g);
      return (
        <div key={lineIdx} className="py-0.5">
          {segments.map((segment, segIdx) => {
            const isBlankBadge =
              segment.startsWith('(') &&
              segment.endsWith(')') &&
              (/[①②③④⑤]/.test(segment) || /^\(\s+\)$/.test(segment));

            if (isBlankBadge) {
              return (
                <span
                  key={segIdx}
                  className="inline-block font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md mx-0.5 border border-blue-200 whitespace-pre"
                >
                  {segment}
                </span>
              );
            }
            return <React.Fragment key={segIdx}>{segment}</React.Fragment>;
          })}
        </div>
      );
    });
  };

  const editionFlashcards = customFlashcards.filter(
    (c) => c.editionId === currentEditionId && c.lang === selectedLang
  );

  const missedKeywordsByQuestion: Record<number, Record<string, number>> = {};
  for (const qId of currentEdition.allQuestionIds) {
    const map = missedKeywordsByKey[getNoteKey(qId, selectedLang)];
    if (map && Object.keys(map).length > 0) {
      missedKeywordsByQuestion[qId] = map;
    }
  }

  const rounds: RoundNumber[] = [1, 2, 3, 4, 5];

  const currentTabDescription =
    activeTab === 'mock'
      ? localeData.mockDescription
      : activeTab === 'notes'
      ? localeData.notesDescription
      : activeTab === 'flashcards'
      ? t.flashcardsPageDesc
      : localeData.roundDescriptions[activeTab];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 relative">
      {/* Full-screen Fireworks & Confetti Overlay when all questions in the round are answered 100% correctly */}
      <CelebrationFireworks triggerKey={celebrationKey} />

      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Zone 1: Brand Title */}
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">
            {localeData.title}
          </span>

          {/* Zone 2: Quick Mode Links on Desktop */}
          <nav className="hidden xl:flex items-center gap-4 text-sm font-medium text-slate-600">
            {rounds.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleSwitchTab(r)}
                className={`py-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === r
                    ? 'text-blue-600 font-bold underline underline-offset-8 decoration-2'
                    : 'hover:text-slate-900'
                }`}
              >
                {t.roundNames[r]}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleSwitchTab('mock')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'mock'
                  ? 'text-indigo-600 font-bold underline underline-offset-8 decoration-2'
                  : 'hover:text-slate-900'
              }`}
            >
              {t.mockTabName}
            </button>
            {isAdvancedStudyOn && (
              <>
                <button
                  type="button"
                  onClick={() => handleSwitchTab('notes')}
                  className={`py-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'notes'
                      ? 'text-amber-700 font-bold underline underline-offset-8 decoration-2'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {t.notesTabName}
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchTab('flashcards')}
                  className={`py-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'flashcards'
                      ? 'text-indigo-700 font-bold underline underline-offset-8 decoration-2'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {t.flashcardsTabName(editionFlashcards.length)}
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Lock Tab (Ecuador Worker House), Advanced Study Tab, Sound Toggle & Change Language */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Special Lock Tab for Ecuador Worker House (에콰도르 숙소사명자 / obrero de la casa de obreros) */}
            <button
              type="button"
              onClick={() => setIsWorkerAuthModalOpen(true)}
              aria-pressed={isWorkerModeUnlocked}
              title={t.workerLockBtnLabel}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isWorkerModeUnlocked
                  ? 'text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {isWorkerModeUnlocked ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="hidden sm:inline">
                    {t.workerUnlockedBtnLabel}
                  </span>
                </>
              ) : (
                <Lock className="w-4 h-4 text-slate-600 shrink-0" />
              )}
            </button>

            {/* Advanced Study Feature Toggle Button right next to Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleAdvancedStudy}
              aria-pressed={isAdvancedStudyOn}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isAdvancedStudyOn
                  ? 'text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <NotebookPen
                className={`w-4 h-4 shrink-0 ${
                  isAdvancedStudyOn ? 'text-amber-700' : 'text-slate-600'
                }`}
              />
              <span>
                {isAdvancedStudyOn
                  ? t.advancedStudyOnLabel
                  : t.advancedStudyOffLabel}
              </span>
            </button>

            {/* Sound Mute Toggle Button */}
            <button
              type="button"
              onClick={handleToggleSound}
              aria-pressed={!isSoundMuted}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isSoundMuted
                  ? 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                  : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              {isSoundMuted ? (
                <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
              ) : (
                <Volume2 className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span>{isSoundMuted ? t.soundOffLabel : t.soundOnLabel}</span>
            </button>

            {/* Change Language Button */}
            <button
              type="button"
              onClick={handleReturnToLangScreen}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Globe className="w-4 h-4 text-slate-600 shrink-0" />
              <span>{t.changeLangBtn}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Exam Scope & Navigation Tabs (Rounds 1~5 + Mock Exam + Notes Tab) */}
        <section className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-600 mb-3">
            <span className="font-semibold text-slate-800">
              {localeData.subtitle}
            </span>
            <span>{t.gradingRuleSummary}</span>
          </div>

          <div
            className={`grid grid-cols-2 ${
              isAdvancedStudyOn
                ? 'sm:grid-cols-4 lg:grid-cols-8'
                : 'sm:grid-cols-6'
            } gap-1.5 bg-slate-200/75 p-1.5 rounded-xl`}
          >
            {rounds.map((r) => {
              const isActive = activeTab === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSwitchTab(r)}
                  className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap truncate ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white/85 text-slate-700 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {t.roundNames[r]}
                </button>
              );
            })}

            {/* Mock Exam Tab (1 -> N Sequential) */}
            <button
              type="button"
              onClick={() => handleSwitchTab('mock')}
              className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap truncate inline-flex items-center justify-center gap-1 ${
                activeTab === 'mock'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/85 text-indigo-700 hover:bg-white hover:text-indigo-900'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 shrink-0" />
              <span>{t.mockTabName}</span>
            </button>

            {/* Consolidated Study Notes & Self-Made Flashcards Tabs (Only visible when Advanced Study is ON) */}
            {isAdvancedStudyOn && (
              <>
                <button
                  type="button"
                  onClick={() => handleSwitchTab('notes')}
                  className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap truncate inline-flex items-center justify-center gap-1 ${
                    activeTab === 'notes'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-amber-50/90 text-amber-800 hover:bg-amber-100 hover:text-amber-950'
                  }`}
                >
                  <StickyNote className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.notesTabName}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchTab('flashcards')}
                  className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap truncate inline-flex items-center justify-center gap-1 ${
                    activeTab === 'flashcards'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-violet-50/90 text-violet-800 hover:bg-violet-100 hover:text-violet-950'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.flashcardsTabName(editionFlashcards.length)}</span>
                </button>
              </>
            )}
          </div>
        </section>

        {/* Active Advanced Study Mode Banner (shown on exam tabs when Advanced Study is ON) */}
        {isAdvancedStudyOn &&
          activeTab !== 'notes' &&
          activeTab !== 'flashcards' &&
          isDataUploaded && (
            <section className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5 max-w-xl">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <NotebookPen className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{t.advancedStudyBannerTitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  {t.advancedStudyBannerDesc}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSwitchTab('notes')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <StickyNote className="w-4 h-4 shrink-0" />
                  <span>{t.goToNotesTabBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchTab('flashcards')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>{t.flashcardsTabName(editionFlashcards.length)}</span>
                </button>
              </div>
            </section>
          )}

        {/* Active Tab Info Banner */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800">
            {currentTabDescription}
          </p>
          {isDataUploaded &&
            activeTab !== 'notes' &&
            activeTab !== 'flashcards' && (
              <button
                type="button"
                onClick={() => handleResetCurrentExam(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetBtn}</span>
              </button>
            )}
          {isDataUploaded &&
            (activeTab === 'notes' || activeTab === 'flashcards') && (
              <button
                type="button"
                onClick={() => handleSwitchTab(1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.backToExamTabBtn}</span>
              </button>
            )}
        </section>

        {/* EMPTY STATE WHEN DATA IS NOT UPLOADED YET FOR THIS EDITION/LANGUAGE */}
        {!isDataUploaded ? (
          <section className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-10 sm:p-14 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.notUploadedTitle}
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              {t.notUploadedDesc}
            </p>
            {fallbackAvailableEdition && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSwitchEdition(fallbackAvailableEdition.id)
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>
                    {t.switchToAvailableEditionBtn(
                      fallbackAvailableEdition.locales[selectedLang].editionBadge
                    )}
                  </span>
                </button>
              </div>
            )}
          </section>
        ) : activeTab === 'notes' ? (
          /* CONSOLIDATED STUDY NOTES VIEW ('노트 모아보기' / 'Mis Notas') */
          <section className="space-y-6">
            {/* Filter & Summary Toolbar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setNotesFilter('all')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      notesFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.notesFilterAll} ({allSequentialQuestions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotesFilter('written')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      notesFilter === 'written'
                        ? 'bg-white text-amber-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.notesFilterWrittenOnly} ({writtenNotesCount})
                  </button>
                </div>

                <span className="text-xs sm:text-sm text-slate-600 font-medium tabular-nums">
                  {t.notesCountSummary(
                    writtenNotesCount,
                    allSequentialQuestions.length
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAnswersInNotes((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {showAnswersInNotes ? (
                  <>
                    <EyeOff className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>{t.hideAnswerInNoteToggle}</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>{t.showAnswerInNoteToggle}</span>
                  </>
                )}
              </button>
            </div>

            {(() => {
              const filteredNotesQuestions =
                notesFilter === 'written'
                  ? allSequentialQuestions.filter(
                      (q) =>
                        (
                          studyNotes[getNoteKey(q.id, selectedLang)] || ''
                        ).trim().length > 0
                    )
                  : allSequentialQuestions;

              if (filteredNotesQuestions.length === 0) {
                return (
                  <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600">
                      <NotebookPen className="w-6 h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {t.notesEmptyFilteredTitle}
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      {t.notesEmptyFilteredDesc}
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setNotesFilter('all')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                      >
                        <span>{t.notesFilterAll}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-5">
                  {filteredNotesQuestions.map((question, idx) => {
                    const noteValue =
                      studyNotes[getNoteKey(question.id, selectedLang)] || '';
                    const hasNote = noteValue.trim().length > 0;
                    const isVerse = Boolean(question.isExactVerse);

                    return (
                      <article
                        key={question.id}
                        className={`bg-white rounded-xl border-2 p-5 sm:p-6 transition-colors ${
                          hasNote ? 'border-amber-300' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs font-semibold">
                          <span
                            className={
                              isVerse ? 'text-amber-700' : 'text-blue-700'
                            }
                          >
                            {t.questionBadge(
                              idx + 1,
                              question.id,
                              question.totalPoints,
                              isVerse,
                              currentEdition.hidePoints
                            )}
                          </span>
                          {hasNote && (
                            <span className="text-emerald-700 font-semibold">
                              {t.personalNoteSavedBadge}
                            </span>
                          )}
                        </div>

                        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 whitespace-pre-line">
                          {question.title}
                        </h2>

                        {question.passageWithBlanks && (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                            {renderFormattedPassage(question.passageWithBlanks)}
                          </div>
                        )}

                        {/* Model Answers Reference Block */}
                        {showAnswersInNotes && (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-4 space-y-2">
                            <div className="text-xs font-bold text-slate-500">
                              {t.modelAnswerHeader}
                            </div>
                            <div className="space-y-1.5">
                              {question.parts.map((part) => (
                                <div
                                  key={part.id}
                                  className="text-xs sm:text-sm text-slate-800 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2"
                                >
                                  <span className="font-bold text-blue-700 shrink-0">
                                    [{part.label}]
                                  </span>
                                  <span className="font-semibold text-slate-900 whitespace-pre-line">
                                    {part.answer}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Study Note Input Box */}
                        <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <label
                              htmlFor={`consolidated-note-${question.id}`}
                              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900"
                            >
                              <NotebookPen className="w-4 h-4 text-amber-700 shrink-0" />
                              <span>{t.personalNoteTitle}</span>
                            </label>
                            {hasNote && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleNoteChange(question.id, '')
                                }
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{t.clearSingleNoteBtn}</span>
                              </button>
                            )}
                          </div>

                          <textarea
                            id={`consolidated-note-${question.id}`}
                            rows={3}
                            value={noteValue}
                            onChange={(e) =>
                              handleNoteChange(question.id, e.target.value)
                            }
                            placeholder={t.personalNotePlaceholder}
                            className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-amber-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/15 outline-none text-sm sm:text-base text-slate-900 transition-all resize-y"
                          />
                        </div>
                      </article>
                    );
                  })}
                </div>
              );
            })()}
          </section>
        ) : activeTab === 'flashcards' ? (
          /* SELF-MADE FLASHCARDS 3:2:1 REVIEW VIEW */
          <FlashcardReviewTab
            cards={editionFlashcards}
            t={t}
            isSoundMuted={isSoundMuted}
            missedKeywordsByQuestion={missedKeywordsByQuestion}
            onRateCard={handleRateFlashcard}
            onDeleteCard={handleDeleteFlashcard}
            onResetAllExposures={handleResetAllCardExposures}
            onBackToExam={() => handleSwitchTab(1)}
          />
        ) : (
          /* EXAM VIEW (Rounds 1~5 and Mock Exam) */
          <>
            <div className="space-y-6">
              {activeQuestions.map((question, qIndex) => {
                const evaluation = evaluations[question.id];
                const isVerse = Boolean(question.isExactVerse);
                const shouldBounce =
                  bouncingAllCards || bouncingSingleId === question.id;
                const currentNoteText =
                  studyNotes[getNoteKey(question.id, selectedLang)] || '';
                const hasSavedNote = currentNoteText.trim().length > 0;

                let borderClass = 'border-slate-200';
                if (evaluation) {
                  if (evaluation.allPassed) {
                    borderClass = 'border-emerald-600';
                  } else if (evaluation.earnedPoints > 0) {
                    borderClass = 'border-amber-500';
                  } else {
                    borderClass = 'border-red-600';
                  }
                }

                return (
                  <React.Fragment key={question.id}>
                    {question.sectionHeader && (
                      <div className="pt-2 pb-1">
                        <p className="text-sm font-bold text-blue-700">
                          {question.sectionHeader}
                        </p>
                      </div>
                    )}

                    <article
                      style={
                        bouncingAllCards
                          ? { animationDelay: `${qIndex * 45}ms` }
                          : undefined
                      }
                      className={`bg-white rounded-xl border-2 ${borderClass} p-5 sm:p-6 transition-colors ${
                        shouldBounce ? 'animate-card-bounce' : ''
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs font-semibold">
                        <span
                          className={
                            isVerse ? 'text-amber-700' : 'text-blue-700'
                          }
                        >
                          {t.questionBadge(
                            qIndex + 1,
                            question.id,
                            question.totalPoints,
                            isVerse,
                            currentEdition.hidePoints
                          )}
                        </span>
                        <span className="text-slate-500">
                          {isVerse ? t.verseRuleNotice : t.keywordRuleNotice}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 whitespace-pre-line">
                        {question.title}
                      </h2>

                      {question.passageWithBlanks && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5 text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line">
                          {renderFormattedPassage(question.passageWithBlanks)}
                        </div>
                      )}

                      <div className="space-y-4">
                        {question.parts.map((part) => {
                          const partResult = evaluation?.partResults.find(
                            (r) => r.partId === part.id
                          );
                          const isMultiline =
                            (part.rows && part.rows > 1) || isVerse;

                          return (
                            <div key={part.id} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
                                <label htmlFor={`input-${part.id}`}>
                                  {part.label}{' '}
                                  {!currentEdition.hidePoints && (
                                    <span className="text-slate-400 font-normal tabular-nums">
                                      ({part.points}
                                      {selectedLang === 'ko' ? '점' : ' pts'})
                                    </span>
                                  )}
                                </label>

                                {partResult && (
                                  <span
                                    className={`inline-flex items-center gap-1 text-xs font-bold tabular-nums ${
                                      partResult.passed
                                        ? 'text-emerald-700'
                                        : 'text-red-600'
                                    }`}
                                  >
                                    {partResult.passed ? (
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5" />
                                    )}
                                    {currentEdition.hidePoints
                                      ? partResult.passed
                                        ? t.partStatusCorrect
                                        : t.partStatusWrong
                                      : partResult.passed
                                      ? `${t.partStatusCorrect} (+${partResult.earnedPoints})`
                                      : `${t.partStatusWrong} (0)`}
                                  </span>
                                )}
                              </div>

                              {isMultiline ? (
                                <textarea
                                  id={`input-${part.id}`}
                                  rows={part.rows || 3}
                                  value={userInputs[part.id] || ''}
                                  onChange={(e) =>
                                    handleInputChange(
                                      part.id,
                                      e.target.value,
                                      question.id
                                    )
                                  }
                                  placeholder={t.placeholderDefault}
                                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none text-sm sm:text-base text-slate-900 transition-all resize-y"
                                />
                              ) : (
                                <input
                                  id={`input-${part.id}`}
                                  type="text"
                                  value={userInputs[part.id] || ''}
                                  onChange={(e) =>
                                    handleInputChange(
                                      part.id,
                                      e.target.value,
                                      question.id
                                    )
                                  }
                                  placeholder={
                                    question.questionType === 'blank'
                                      ? t.placeholderBlank(part.label)
                                      : t.placeholderDefault
                                  }
                                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none text-sm sm:text-base text-slate-900 transition-all"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-end mt-4">
                        <button
                          ref={(el) => {
                            gradeBtnRefs.current[question.id] = el;
                          }}
                          type="button"
                          onClick={() => handleGradeSingle(question, true)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              e.stopPropagation();
                              if (
                                readyToAdvanceMap[question.id] &&
                                Boolean(evaluations[question.id])
                              ) {
                                setReadyToAdvanceMap((prev) => ({
                                  ...prev,
                                  [question.id]: false,
                                }));
                                focusQuestionFirstInput(
                                  (qIndex + 1) % activeQuestions.length
                                );
                              } else {
                                handleGradeSingle(question, true);
                              }
                            }
                          }}
                          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {t.checkSingleBtn}
                        </button>
                      </div>

                      {/* Per-Question Advanced Study Tools (Mistake Tags + Red Highlighter Missed Keywords + Note + Self-Made Card Builder) */}
                      {isAdvancedStudyOn && (
                        <QuestionAdvancedToolbar
                          question={question}
                          selectedLang={selectedLang}
                          t={t}
                          noteText={currentNoteText}
                          onNoteChange={(val) =>
                            handleNoteChange(question.id, val)
                          }
                          isNoteEditorOpen={Boolean(
                            openNoteEditors[question.id]
                          )}
                          onToggleNoteEditor={() =>
                            toggleNoteEditor(question.id)
                          }
                          onGoToNotesTab={() => handleSwitchTab('notes')}
                          questionMistakeTags={
                            mistakeTagsByKey[
                              getNoteKey(question.id, selectedLang)
                            ] || []
                          }
                          onToggleQuestionMistakeTag={(tagId) =>
                            handleToggleQuestionMistakeTag(question.id, tagId)
                          }
                          missedKeywordsCountMap={
                            missedKeywordsByKey[
                              getNoteKey(question.id, selectedLang)
                            ] || {}
                          }
                          onClearMissedKeywords={() =>
                            handleClearMissedKeywords(question.id)
                          }
                          questionFlashcards={editionFlashcards.filter(
                            (fc) => fc.questionId === question.id
                          )}
                          onSaveFlashcard={(cardData) =>
                            handleSaveFlashcard(question.id, cardData)
                          }
                          onDeleteFlashcard={handleDeleteFlashcard}
                          onGoToFlashcardsTab={() =>
                            handleSwitchTab('flashcards')
                          }
                          totalDeckCount={editionFlashcards.length}
                        />
                      )}

                      {/* Grading Feedback */}
                      {evaluation && (
                        <div
                          className={`mt-5 p-4 rounded-lg border text-sm ${
                            evaluation.allPassed
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                              : evaluation.earnedPoints > 0
                              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                              : 'bg-red-50/80 border-red-300 text-red-950'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold mb-2 tabular-nums">
                            {(() => {
                              const hidePts = Boolean(
                                currentEdition.hidePoints
                              );
                              const passedPartsCount =
                                evaluation.partResults.filter(
                                  (r) => r.passed
                                ).length;
                              const totalPartsCount =
                                evaluation.partResults.length;
                              const earnedVal = hidePts
                                ? passedPartsCount
                                : evaluation.earnedPoints;
                              const maxVal = hidePts
                                ? totalPartsCount
                                : evaluation.maxPoints;

                              if (evaluation.allPassed) {
                                return (
                                  <>
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <span>
                                      {t.correctBanner(
                                        earnedVal,
                                        maxVal,
                                        hidePts
                                      )}
                                    </span>
                                  </>
                                );
                              }
                              if (evaluation.earnedPoints > 0) {
                                return (
                                  <>
                                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                    <span>
                                      {t.partialBanner(
                                        earnedVal,
                                        maxVal,
                                        hidePts
                                      )}
                                    </span>
                                  </>
                                );
                              }
                              return (
                                <>
                                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                                  <span>
                                    {t.wrongBanner(earnedVal, maxVal, hidePts)}
                                  </span>
                                </>
                              );
                            })()}
                          </div>

                          {isVerse && !evaluation.allPassed && (
                            <p className="text-xs font-medium mb-2 opacity-90">
                              {t.exactMismatchHint}
                            </p>
                          )}

                          <div className="mt-3 pt-3 border-t border-black/10 space-y-2.5">
                            <div className="text-xs font-bold opacity-80">
                              {t.modelAnswerHeader}
                            </div>

                            {evaluation.partResults.map((pr) => (
                              <div
                                key={pr.partId}
                                className="bg-white/80 rounded-md p-3 border border-black/5 space-y-1"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                  <span className="font-bold text-slate-800">
                                    [{pr.label}]
                                  </span>
                                  <span className="tabular-nums text-slate-600">
                                    {isVerse && (
                                      <>
                                        {t.similarityLabel}{' '}
                                        <strong className="text-slate-900">
                                          {pr.similarity}%
                                        </strong>
                                      </>
                                    )}
                                    {!isVerse &&
                                      !pr.passed &&
                                      pr.missingKeywords.length > 0 && (
                                        <span>
                                          {t.missingKeywordsLabel}{' '}
                                          <strong className="text-red-700">
                                            {pr.missingKeywords.join(', ')}
                                          </strong>
                                        </span>
                                      )}
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 whitespace-pre-line">
                                  {isAdvancedStudyOn
                                    ? renderRedHighlightedText(
                                        pr.expectedAnswer,
                                        Object.keys(
                                          missedKeywordsByKey[
                                            getNoteKey(
                                              question.id,
                                              selectedLang
                                            )
                                          ] || {}
                                        )
                                      )
                                    : pr.expectedAnswer}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Perfect Round Celebration Banner */}
            {isPerfectRound && (
              <div className="mt-6 bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-emerald-950 animate-card-bounce">
                <div className="flex items-center gap-3">
                  <PartyPopper className="w-6 h-6 text-emerald-600 shrink-0" />
                  <p className="text-sm sm:text-base font-bold">
                    {t.perfectCelebrationText}
                  </p>
                </div>

                {isWorkerModeUnlocked && (
                  <button
                    type="button"
                    onClick={() => setIsTelegramModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm whitespace-nowrap shrink-0"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>{t.telegramSendBtn}</span>
                  </button>
                )}
              </div>
            )}

            {/* Bottom Total Score & Grade All Bar */}
            <section className="mt-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                  {hasAnyEvaluation || isAllGraded
                    ? t.totalScoreSummary(
                        totalEarnedPoints,
                        totalMaxPoints,
                        totalPassedQuestions,
                        activeQuestions.length,
                        currentEdition.hidePoints
                      )
                    : t.beforeGradeText}
                </div>
                {isWorkerModeUnlocked && !isPerfectRound && (
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t.telegramLockedHint}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleResetCurrentExam(true)}
                  disabled={isGradingAll}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>{t.resetBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGradeAll}
                  disabled={isGradingAll}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 ${
                    isGradingAll
                      ? 'bg-blue-500 cursor-wait opacity-90'
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
                  }`}
                >
                  {isGradingAll ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                      <span>{t.gradingLoadingBtn}</span>
                    </>
                  ) : (
                    <>
                      <CheckCheck className="w-5 h-5 shrink-0" />
                      <span>{t.gradeAllBtn}</span>
                    </>
                  )}
                </button>

                {/* Send Result to Telegram Button (Only rendered when Worker Mode is unlocked via code 144000; enabled strictly at 100 points) */}
                {isWorkerModeUnlocked && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isPerfectRound) {
                        setIsTelegramModalOpen(true);
                      }
                    }}
                    disabled={!isPerfectRound || isGradingAll}
                    title={
                      isPerfectRound ? t.telegramSendBtn : t.telegramLockedHint
                    }
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all whitespace-nowrap shrink-0 ${
                      isPerfectRound
                        ? 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white shadow-sm cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>{t.telegramSendBtn}</span>
                  </button>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Ecuador Worker House Verification Modal (Lock Tab -> Code 144000) */}
      <WorkerAuthModal
        isOpen={isWorkerAuthModalOpen}
        isUnlocked={isWorkerModeUnlocked}
        t={t}
        onClose={() => setIsWorkerAuthModalOpen(false)}
        onUnlockSuccess={handleUnlockWorkerMode}
        onLockWorkerMode={handleLockWorkerMode}
      />

      {/* Telegram 100-Point Result Sender Modal */}
      <TelegramResultModal
        isOpen={isTelegramModalOpen}
        selectedLang={selectedLang}
        t={t}
        examLevelTitle={`${localeData.editionBadge} · ${
          activeTab === 'mock'
            ? t.mockTabName
            : activeTab === 'notes'
            ? t.notesTabName
            : activeTab === 'flashcards'
            ? t.flashcardsTabName(0)
            : t.roundNames[activeTab]
        }`}
        scoreText={selectedLang === 'ko' ? '100점' : '100 puntos'}
        onClose={() => setIsTelegramModalOpen(false)}
      />

      {/* Bottom-Right Floating Exam Edition (Version) Switcher */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end">
        {isEditionMenuOpen && (
          <div className="mb-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl p-2 space-y-1">
            <div className="px-3 py-1.5 text-xs font-bold text-slate-500 border-b border-slate-100">
              {t.versionSwitcherModalTitle}
            </div>
            {EXAM_EDITIONS.map((ed) => {
              const edLocale = ed.locales[selectedLang];
              const isSelected = ed.id === currentEditionId;
              return (
                <button
                  key={ed.id}
                  type="button"
                  onClick={() => handleSwitchEdition(ed.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{edLocale.editionBadge}</span>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {ed.isLatest ? t.versionLatestTag : t.versionPreviousTag}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsEditionMenuOpen((open) => !open)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <Layers className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            {t.versionSwitcherLabel}: {localeData.editionBadge}
          </span>
          {isEditionMenuOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-300" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </div>
    </div>
  );
}
