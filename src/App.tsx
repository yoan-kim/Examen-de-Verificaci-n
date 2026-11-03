import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import {
  ActiveTab,
  Language,
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

export default function App() {
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
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

  // Track whether the bottom-right edition switcher menu is open
  const [isEditionMenuOpen, setIsEditionMenuOpen] = useState(false);

  const currentEdition = getEditionById(currentEditionId);

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLang(lang);
    setActiveTab(1);
    setUserInputs({});
    setEvaluations({});
    setIsAllGraded(false);
  };

  const handleReturnToLangScreen = () => {
    setSelectedLang(null);
    setUserInputs({});
    setEvaluations({});
    setIsAllGraded(false);
    setIsEditionMenuOpen(false);
  };

  const handleSwitchTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setUserInputs({});
    setEvaluations({});
    setIsAllGraded(false);
  };

  const handleSwitchEdition = (editionId: string) => {
    setCurrentEditionId(editionId);
    setActiveTab(1);
    setUserInputs({});
    setEvaluations({});
    setIsAllGraded(false);
    setIsEditionMenuOpen(false);
  };

  const handleResetCurrentExam = () => {
    setRoundSeed((s) => s + 1);
    setUserInputs({});
    setEvaluations({});
    setIsAllGraded(false);
  };

  const handleInputChange = (partId: string, value: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [partId]: value,
    }));
  };

  // Determine the ordered list of question IDs for the active tab
  const activeQuestionIds = useMemo(() => {
    if (activeTab === 'mock') {
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
  const isDataUploaded =
    localeData.isUploaded !== false &&
    Object.keys(localeData.questions).length > 0;

  const activeQuestions: QuestionItem[] = isDataUploaded
    ? activeQuestionIds
        .map((id) => localeData.questions[id])
        .filter((q): q is QuestionItem => Boolean(q))
    : [];

  // Find the most recent edition that actually has uploaded data for this language
  const fallbackAvailableEdition = EXAM_EDITIONS.find(
    (ed) =>
      ed.id !== currentEditionId &&
      ed.locales[selectedLang].isUploaded !== false &&
      Object.keys(ed.locales[selectedLang].questions).length > 0
  );

  const handleGradeSingle = (question: QuestionItem) => {
    const result = evaluateQuestionItem(question, userInputs);
    setEvaluations((prev) => ({
      ...prev,
      [question.id]: result,
    }));
  };

  const handleGradeAll = () => {
    const newEvals: Record<number, QuestionEvaluation> = {};
    for (const q of activeQuestions) {
      newEvals[q.id] = evaluateQuestionItem(q, userInputs);
    }
    setEvaluations(newEvals);
    setIsAllGraded(true);
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
  const hasAnyEvaluation = Object.keys(evaluations).length > 0;

  const renderFormattedPassage = (passage: string) => {
    const lines = passage.split('\n');
    return lines.map((line, lineIdx) => {
      const segments = line.split(/(\([^()\n]*[①②③④⑤][^()\n]*\))/g);
      return (
        <div key={lineIdx} className="py-0.5">
          {segments.map((segment, segIdx) => {
            const isBlankBadge =
              segment.startsWith('(') &&
              segment.endsWith(')') &&
              /[①②③④⑤]/.test(segment);

            if (isBlankBadge) {
              return (
                <span
                  key={segIdx}
                  className="inline-block font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md mx-0.5 border border-blue-200"
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

  const rounds: RoundNumber[] = [1, 2, 3, 4, 5];

  const currentTabDescription =
    activeTab === 'mock'
      ? localeData.mockDescription
      : localeData.roundDescriptions[activeTab];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 relative">
      {/* Top Bar following the 3-Zone Contract */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Title */}
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">
            {localeData.title}
          </span>

          {/* Zone 2: Quick Mode Links on Desktop */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
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
          </nav>

          {/* Zone 3: 1 Primary Action (Change Language) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleReturnToLangScreen}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Globe className="w-4 h-4 text-slate-600" />
              <span>{t.changeLangBtn}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Exam Scope & Navigation Tabs (Rounds 1~5 + Mock Exam) */}
        <section className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-600 mb-3">
            <span className="font-semibold text-slate-800">
              {localeData.subtitle}
            </span>
            <span>{t.gradingRuleSummary}</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-slate-200/75 p-1.5 rounded-xl">
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
          </div>
        </section>

        {/* Active Tab Info Banner */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800">
            {currentTabDescription}
          </p>
          {isDataUploaded && (
            <button
              type="button"
              onClick={handleResetCurrentExam}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetBtn}</span>
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
        ) : (
          /* EXAM VIEW (Rounds 1~5 and Mock Exam) */
          <>
            <div className="space-y-6">
              {activeQuestions.map((question, qIndex) => {
                const evaluation = evaluations[question.id];
                const isVerse = Boolean(question.isExactVerse);

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
                      className={`bg-white rounded-xl border-2 ${borderClass} p-5 sm:p-6 transition-colors`}
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
                                    handleInputChange(part.id, e.target.value)
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
                                    handleInputChange(part.id, e.target.value)
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
                          type="button"
                          onClick={() => handleGradeSingle(question)}
                          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {t.checkSingleBtn}
                        </button>
                      </div>

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
                                  {pr.expectedAnswer}
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

            {/* Bottom Total Score & Grade All Bar */}
            <section className="mt-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="space-y-0.5">
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
              </div>

              <button
                type="button"
                onClick={handleGradeAll}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <CheckCheck className="w-5 h-5" />
                <span>{t.gradeAllBtn}</span>
              </button>
            </section>
          </>
        )}
      </main>

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
