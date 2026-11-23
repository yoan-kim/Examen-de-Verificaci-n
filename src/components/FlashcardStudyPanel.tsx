import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Edit3,
  Eye,
  Flame,
  Layers,
  NotebookPen,
  Plus,
  RotateCcw,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react';
import {
  CustomFlashcard,
  FlashcardDifficulty,
  Language,
  MistakeReasonTagId,
  QuestionItem,
} from '../types/exam';
import {
  calculateSimilarity,
  normalizeForComparison,
  UILocalization,
} from '../data/examRegistry';
import {
  playCorrectSound,
  playPartialSound,
} from '../utils/soundEffects';

export const MISTAKE_TAG_IDS: MistakeReasonTagId[] = [
  'missing_word',
  'wrong_order',
  'verse_typo',
  'chapter_verse_num',
  'concept_confusion',
];

export const DIFFICULTY_TICKET_WEIGHT: Record<FlashcardDifficulty, number> = {
  hard: 3,
  normal: 2,
  easy: 1,
};

/**
 * Highlights any occurrence of `warningKeywords` inside `text` with a red highlighter style.
 * Supports space-insensitive matching so normalized keywords (e.g., "길예비") match "길 예비" in the answer.
 */
export function renderRedHighlightedText(
  text: string,
  warningKeywords: string[]
): React.ReactNode {
  const validKeywords = Array.from(
    new Set(
      warningKeywords
        .map((k) => k.trim())
        .filter((k) => k.length > 0)
    )
  );
  if (!text || validKeywords.length === 0) {
    return text;
  }

  // Sort longer keywords first so longer phrases match before shorter substrings
  const sorted = [...validKeywords].sort((a, b) => b.length - a.length);

  const patternParts = sorted
    .map((kw) => {
      const chars = Array.from(kw.replace(/\s+/g, ''));
      if (chars.length === 0) return '';
      return chars
        .map((ch) => ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('\\s*');
    })
    .filter(Boolean);

  if (patternParts.length === 0) {
    return text;
  }

  try {
    const regex = new RegExp(`(${patternParts.join('|')})`, 'gi');
    const segments = text.split(regex);
    return segments.map((seg, idx) => {
      if (!seg) return null;
      const isMatch = regex.test(seg);
      regex.lastIndex = 0;
      if (isMatch) {
        return (
          <mark
            key={idx}
            className="bg-red-100 text-red-800 border-b-2 border-red-500 font-extrabold px-1 py-0.5 rounded-sm"
          >
            {seg}
          </mark>
        );
      }
      return <React.Fragment key={idx}>{seg}</React.Fragment>;
    });
  } catch {
    return text;
  }
}

interface QuestionAdvancedToolbarProps {
  question: QuestionItem;
  selectedLang: Language;
  t: UILocalization;
  // Study note props
  noteText: string;
  onNoteChange: (val: string) => void;
  isNoteEditorOpen: boolean;
  onToggleNoteEditor: () => void;
  onGoToNotesTab: () => void;
  // Mistake tags & frequently missed keywords props
  questionMistakeTags: MistakeReasonTagId[];
  onToggleQuestionMistakeTag: (tag: MistakeReasonTagId) => void;
  missedKeywordsCountMap: Record<string, number>;
  onClearMissedKeywords: () => void;
  // Self-made flashcards for this question
  questionFlashcards: CustomFlashcard[];
  onSaveFlashcard: (
    cardData: {
      id?: string;
      front: string;
      back: string;
      warningKeywords: string[];
      mistakeTags: MistakeReasonTagId[];
    }
  ) => void;
  onDeleteFlashcard: (cardId: string) => void;
  onGoToFlashcardsTab: () => void;
  totalDeckCount: number;
}

export const QuestionAdvancedToolbar: React.FC<QuestionAdvancedToolbarProps> = ({
  question,
  t,
  noteText,
  onNoteChange,
  isNoteEditorOpen,
  onToggleNoteEditor,
  onGoToNotesTab,
  questionMistakeTags,
  onToggleQuestionMistakeTag,
  missedKeywordsCountMap,
  onClearMissedKeywords,
  questionFlashcards,
  onSaveFlashcard,
  onDeleteFlashcard,
  onGoToFlashcardsTab,
  totalDeckCount,
}) => {
  const [isCardBuilderOpen, setIsCardBuilderOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const [cardWarningInput, setCardWarningInput] = useState('');

  const missedKeywordEntries = Object.entries(missedKeywordsCountMap).sort(
    (a, b) => b[1] - a[1]
  );
  const missedKeywordList = missedKeywordEntries.map(([kw]) => kw);
  const hasSavedNote = noteText.trim().length > 0;

  const handleOpenNewCardBuilder = () => {
    setEditingCardId(null);
    if (!isCardBuilderOpen) {
      // Pre-fill warning words with any frequently missed keywords from this question
      if (!cardWarningInput && missedKeywordList.length > 0) {
        setCardWarningInput(missedKeywordList.join(', '));
      }
      setIsCardBuilderOpen(true);
    } else {
      setIsCardBuilderOpen(false);
    }
  };

  const handleQuickFillWholeQuestion = () => {
    const cleanFront = [
      question.title,
      question.passageWithBlanks ? `\n${question.passageWithBlanks}` : '',
    ]
      .join('')
      .trim();
    const cleanBack = question.parts
      .map((p) =>
        question.parts.length > 1 ? `[${p.label}] ${p.answer}` : p.answer
      )
      .join('\n');

    const defaultWarnings =
      missedKeywordList.length > 0
        ? missedKeywordList
        : question.parts.flatMap((p) => p.keywords.map((g) => g[0]));

    setCardFront(cleanFront);
    setCardBack(cleanBack);
    setCardWarningInput(Array.from(new Set(defaultWarnings)).join(', '));
  };

  const handleQuickFillPart = (partIndex: number) => {
    const part = question.parts[partIndex];
    if (!part) return;
    setCardFront(`${question.title}\n→ [${part.label}]`);
    setCardBack(part.answer);
    const partKws = part.keywords.map((g) => g[0]);
    const combined = Array.from(new Set([...missedKeywordList, ...partKws]));
    setCardWarningInput(combined.join(', '));
  };

  const handleEditExistingCard = (card: CustomFlashcard) => {
    setEditingCardId(card.id);
    setCardFront(card.front);
    setCardBack(card.back);
    setCardWarningInput(card.warningKeywords.join(', '));
    setIsCardBuilderOpen(true);
  };

  const handleSubmitCard = () => {
    if (!cardFront.trim() || !cardBack.trim()) return;
    const parsedWarnings = cardWarningInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSaveFlashcard({
      id: editingCardId || undefined,
      front: cardFront.trim(),
      back: cardBack.trim(),
      warningKeywords: parsedWarnings,
      mistakeTags: questionMistakeTags,
    });

    setEditingCardId(null);
    setCardFront('');
    setCardBack('');
    setCardWarningInput(missedKeywordList.join(', '));
  };

  return (
    <div className="mt-5 space-y-3.5">
      {/* 1. Frequently Missed Keywords Red Highlighter Alert + Mistake Reason Tags */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-3">
        {missedKeywordEntries.length > 0 && (
          <div className="bg-white border border-red-200 rounded-lg p-3 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{t.frequentMissedKeywordsTitle}</span>
              </div>
              <button
                type="button"
                onClick={onClearMissedKeywords}
                className="text-xs font-semibold text-slate-500 hover:text-red-700 transition-colors cursor-pointer"
              >
                {t.clearMissedKeywordsBtn}
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {t.frequentMissedKeywordsHint}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {missedKeywordEntries.map(([kw, count]) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 bg-red-100 text-red-900 border-b-2 border-red-500 px-2.5 py-1 rounded-md text-xs font-extrabold"
                >
                  <span>{kw}</span>
                  <span className="text-[11px] font-bold bg-red-600 text-white px-1.5 py-0.2 rounded">
                    {t.missedTimesBadge(count)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Mistake Reason Tags */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-950">
              <Tag className="w-3.5 h-3.5 text-rose-700 shrink-0" />
              <span>{t.mistakeReasonHeader}</span>
            </span>
            <span className="text-xs text-rose-800/80">
              {t.mistakeReasonHint}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {MISTAKE_TAG_IDS.map((tagId) => {
              const active = questionMistakeTags.includes(tagId);
              return (
                <button
                  key={tagId}
                  type="button"
                  onClick={() => onToggleQuestionMistakeTag(tagId)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    active
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-100/70'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {t.mistakeTagLabels[tagId]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Per-Question Study Tip Note Box */}
      <div className="bg-amber-50/75 border border-amber-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900">
            <NotebookPen className="w-4 h-4 text-amber-800 shrink-0" />
            <span>{t.postGradeNoteHeader}</span>
            {hasSavedNote && (
              <span className="ml-1 text-xs font-semibold text-emerald-700">
                · {t.personalNoteSavedBadge}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleNoteEditor}
            className="px-3 py-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300/80 text-amber-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            {isNoteEditorOpen ? t.hideNoteEditorBtn : t.openOrEditNoteBtn}
          </button>
        </div>

        {isNoteEditorOpen ? (
          <textarea
            id={`note-input-${question.id}`}
            rows={3}
            value={noteText}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder={t.personalNotePlaceholder}
            className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-amber-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/15 outline-none text-sm text-slate-900 transition-all resize-y"
          />
        ) : hasSavedNote ? (
          <div
            onClick={onToggleNoteEditor}
            title={t.openOrEditNoteBtn}
            className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-amber-200 text-sm text-slate-800 whitespace-pre-line cursor-pointer hover:border-amber-300 transition-colors"
          >
            {renderRedHighlightedText(noteText, missedKeywordList)}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-amber-900/80">
            {t.postGradeNoNoteYet}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onGoToNotesTab}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer"
          >
            {t.goToNotesTabBtn} →
          </button>
        </div>
      </div>

      {/* 3. Self-Made Flashcard Creation Tool (Right below each question) */}
      <div className="bg-indigo-50/75 border border-indigo-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-950">
              <Layers className="w-4 h-4 text-indigo-700 shrink-0" />
              <span>{t.cardBuilderHeader}</span>
            </div>
            <p className="text-xs text-indigo-900/80 mt-0.5">
              {t.cardBuilderSub}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenNewCardBuilder}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              isCardBuilderOpen
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
          >
            {isCardBuilderOpen ? t.closeCardBuilderBtn : t.openCardBuilderBtn}
          </button>
        </div>

        {isCardBuilderOpen && (
          <div className="bg-white border border-indigo-200 rounded-xl p-4 space-y-3.5 shadow-xs">
            {/* Quick-fill helper buttons from the current question or individual sub-parts */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-indigo-900 mr-1">
                {t.quickFillLabel}
              </span>
              <button
                type="button"
                onClick={handleQuickFillWholeQuestion}
                className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                {t.quickFillWholeQuestion}
              </button>
              {question.parts.length > 1 &&
                question.parts.map((part, pIdx) => (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => handleQuickFillPart(pIdx)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer max-w-52 truncate"
                  >
                    {part.label}
                  </button>
                ))}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                {t.cardFrontLabel}
              </label>
              <textarea
                rows={2}
                value={cardFront}
                onChange={(e) => setCardFront(e.target.value)}
                placeholder={t.cardFrontPlaceholder}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 outline-none text-sm text-slate-900 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                {t.cardBackLabel}
              </label>
              <textarea
                rows={3}
                value={cardBack}
                onChange={(e) => setCardBack(e.target.value)}
                placeholder={t.cardBackPlaceholder}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 outline-none text-sm text-slate-900 resize-y"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-red-700">
                {t.cardWarningWordsLabel}
              </label>
              <input
                type="text"
                value={cardWarningInput}
                onChange={(e) => setCardWarningInput(e.target.value)}
                placeholder={t.cardWarningWordsPlaceholder}
                className="w-full px-3 py-2 rounded-lg border border-red-200 bg-red-50/40 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/15 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              {editingCardId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCardId(null);
                    setCardFront('');
                    setCardBack('');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {t.cancelEditCardBtn}
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmitCard}
                disabled={!cardFront.trim() || !cardBack.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>
                  {editingCardId ? t.updateCardBtn : t.saveNewCardBtn}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* List of cards created for this question */}
        {questionFlashcards.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-indigo-950">
              {t.questionCardsListTitle(questionFlashcards.length)}
            </div>
            <div className="space-y-2">
              {questionFlashcards.map((fc) => (
                <div
                  key={fc.id}
                  className="bg-white border border-indigo-200/80 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="font-bold text-slate-900 whitespace-pre-line">
                      Q. {fc.front}
                    </div>
                    <div className="text-slate-700 whitespace-pre-line">
                      A.{' '}
                      {renderRedHighlightedText(
                        fc.back,
                        Array.from(
                          new Set([
                            ...fc.warningKeywords,
                            ...missedKeywordList,
                          ])
                        )
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {t.cardExposureCountBadge(fc.exposureCount)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          fc.difficulty === 'hard'
                            ? 'bg-red-100 text-red-800'
                            : fc.difficulty === 'normal'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {t.cardDifficultyStatusBadge[fc.difficulty]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditExistingCard(fc)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-900 font-bold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t.editCardAction}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteFlashcard(fc.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.deleteCardAction}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalDeckCount > 0 && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onGoToFlashcardsTab}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-950 transition-colors cursor-pointer"
            >
              {t.goToFlashcardsTabBtn(totalDeckCount)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface FlashcardReviewTabProps {
  cards: CustomFlashcard[];
  t: UILocalization;
  isSoundMuted: boolean;
  missedKeywordsByQuestion: Record<number, Record<string, number>>;
  onRateCard: (cardId: string, difficulty: FlashcardDifficulty) => void;
  onDeleteCard: (cardId: string) => void;
  onResetAllExposures: () => void;
  onBackToExam: () => void;
}

export const FlashcardReviewTab: React.FC<FlashcardReviewTabProps> = ({
  cards,
  t,
  isSoundMuted,
  missedKeywordsByQuestion,
  onRateCard,
  onDeleteCard,
  onResetAllExposures,
  onBackToExam,
}) => {
  // Ordered queue of card IDs
  const [queueIds, setQueueIds] = useState<string[]>(() =>
    cards.map((c) => c.id)
  );
  const [practiceInput, setPracticeInput] = useState('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [practiceEval, setPracticeEval] = useState<{
    similarity: number;
    allWarningMatched: boolean;
  } | null>(null);

  const practiceInputRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync queueIds when cards are added or deleted
  useEffect(() => {
    setQueueIds((prev) => {
      const validSet = new Set(cards.map((c) => c.id));
      const filtered = prev.filter((id) => validSet.has(id));
      const existingSet = new Set(filtered);
      const newlyAdded = cards
        .map((c) => c.id)
        .filter((id) => !existingSet.has(id));
      return [...filtered, ...newlyAdded];
    });
  }, [cards]);

  const currentCardId = queueIds[0];
  const currentCard =
    cards.find((c) => c.id === currentCardId) || cards[0] || null;

  const handleCheckPracticeAnswer = () => {
    if (!currentCard) return;
    const normUser = normalizeForComparison(practiceInput);
    const normBack = normalizeForComparison(currentCard.back);
    const sim = normUser
      ? Math.round(calculateSimilarity(normUser, normBack) * 100)
      : 0;

    const qMissedMap =
      missedKeywordsByQuestion[currentCard.questionId] || {};
    const combinedWarnings = Array.from(
      new Set([
        ...currentCard.warningKeywords,
        ...Object.keys(qMissedMap),
      ])
    ).filter(Boolean);

    const allWarningMatched =
      combinedWarnings.length === 0
        ? sim >= 80
        : combinedWarnings.every((kw) =>
            normUser.includes(normalizeForComparison(kw))
          );

    setPracticeEval({
      similarity: sim,
      allWarningMatched,
    });
    setIsAnswerRevealed(true);

    if (sim >= 80 && allWarningMatched) {
      playCorrectSound(isSoundMuted);
    } else if (sim > 0) {
      playPartialSound(isSoundMuted);
    }
  };

  /**
   * 3:2:1 Repetition Queue Reordering (Hard = 3x, Normal = 2x, Easy = 1x at the very back)
   * Does not use dates or timers—only adjusts queue order and increments exposureCount.
   */
  const handleSelectDifficulty = (difficulty: FlashcardDifficulty) => {
    if (!currentCard) return;
    const targetId = currentCard.id;

    // Update card state (increments exposureCount & updates difficulty in parent)
    onRateCard(targetId, difficulty);

    // Reorder queueIds with exact 3:2:1 slot frequency:
    // - Easy (1x): 1 slot at the very back of the queue.
    // - Normal (2x): 2 slots (middle and back-before-easy).
    // - Hard (3x): 3 slots (front-next, middle, and back-before-easy).
    setQueueIds((prev) => {
      if (cards.length <= 1) return [targetId];
      const restWithoutTarget = prev.slice(1).filter((id) => id !== targetId);
      const len = restWithoutTarget.length;

      if (difficulty === 'easy') {
        return [...restWithoutTarget, targetId];
      }

      if (difficulty === 'normal') {
        const midIdx = Math.min(Math.max(1, Math.ceil(len / 2)), len);
        const withMid = [
          ...restWithoutTarget.slice(0, midIdx),
          targetId,
          ...restWithoutTarget.slice(midIdx),
        ];
        return [...withMid, targetId];
      }

      // Hard (3 slots: near front, middle, and back)
      const frontIdx = Math.min(1, len);
      const afterFront = [
        ...restWithoutTarget.slice(0, frontIdx),
        targetId,
        ...restWithoutTarget.slice(frontIdx),
      ];
      const midIdx = Math.min(
        Math.max(2, Math.ceil(afterFront.length / 2)),
        afterFront.length
      );
      const afterMid = [
        ...afterFront.slice(0, midIdx),
        targetId,
        ...afterFront.slice(midIdx),
      ];
      return [...afterMid, targetId];
    });

    // Reset card practice state for the next card
    setPracticeInput('');
    setIsAnswerRevealed(false);
    setPracticeEval(null);
    window.requestAnimationFrame(() => {
      practiceInputRef.current?.focus();
    });
  };

  if (cards.length === 0 || !currentCard) {
    return (
      <section className="space-y-6">
        <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {t.flashcardsEmptyTitle}
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            {t.flashcardsEmptyDesc}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onBackToExam}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.backToExamTabBtn}</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const qMissedMap = missedKeywordsByQuestion[currentCard.questionId] || {};
  const activeWarningWords = Array.from(
    new Set([...currentCard.warningKeywords, ...Object.keys(qMissedMap)])
  ).filter(Boolean);

  // Unique cards ordered by their next appearance in queueIds
  const uniqueOrderedCards = Array.from(
    new Set([...queueIds, ...cards.map((c) => c.id)])
  )
    .map((id) => cards.find((c) => c.id === id))
    .filter((c): c is CustomFlashcard => Boolean(c));

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-indigo-200 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>{t.flashcardsPageTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t.flashcardsPageDesc}
          </p>
        </div>

        <button
          type="button"
          onClick={onResetAllExposures}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetAllCardExposuresBtn}</span>
        </button>
      </div>

      {/* Active Flashcard Player Card */}
      <div className="bg-white border-2 border-indigo-500 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
        {/* Top Metadata Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-extrabold">
              {t.cardOrigQuestionLink(currentCard.questionId)}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                currentCard.difficulty === 'hard'
                  ? 'bg-red-100 text-red-800'
                  : currentCard.difficulty === 'normal'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {t.cardDifficultyStatusBadge[currentCard.difficulty]}
            </span>
            {currentCard.mistakeTags.map((tagId) => (
              <span
                key={tagId}
                className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold"
              >
                #{t.mistakeTagLabels[tagId]}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-extrabold tabular-nums">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.cardExposureCountBadge(currentCard.exposureCount)}</span>
            </span>
          </div>
        </div>

        {/* Card Front (Question / Prompt) */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {t.cardFrontLabel}
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 whitespace-pre-line leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-5">
            {currentCard.front}
          </div>
        </div>

        {/* Direct Typing Practice Input Box inside the Flashcard */}
        <div className="space-y-2.5">
          <label className="block text-xs sm:text-sm font-bold text-slate-700">
            {t.cardPracticeInputLabel}
          </label>
          <textarea
            ref={practiceInputRef}
            rows={2}
            value={practiceInput}
            onChange={(e) => setPracticeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCheckPracticeAnswer();
              }
            }}
            placeholder={t.cardPracticeInputPlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 outline-none text-sm sm:text-base text-slate-900 transition-all resize-y"
          />

          <div className="flex flex-wrap items-center justify-end gap-2">
            {!isAnswerRevealed && (
              <button
                type="button"
                onClick={() => setIsAnswerRevealed(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>{t.cardShowAnswerBtn}</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCheckPracticeAnswer}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.cardCheckPracticeBtn}</span>
            </button>
          </div>
        </div>

        {/* Card Back (Revealed Answer + Red Highlighter Warning Words + Anki 3:2:1 Buttons) */}
        {isAnswerRevealed && (
          <div className="pt-4 border-t-2 border-dashed border-slate-200 space-y-5 animate-card-bounce">
            {practiceEval && (
              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
                  practiceEval.allWarningMatched &&
                  practiceEval.similarity >= 70
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {t.cardPracticeMatchBanner(
                    practiceEval.similarity,
                    practiceEval.allWarningMatched
                  )}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-700">
                  {t.cardBackHeader}
                </span>
                {activeWarningWords.length > 0 && (
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
                    {t.cardRedHighlighterLegend}
                  </span>
                )}
              </div>

              <div className="text-base sm:text-lg font-bold text-slate-900 whitespace-pre-line leading-relaxed bg-emerald-50/60 border-2 border-emerald-300 rounded-xl p-5">
                {renderRedHighlightedText(
                  currentCard.back,
                  activeWarningWords
                )}
              </div>
            </div>

            {/* Anki-Style Color-Coded Difficulty Buttons (3 : 2 : 1 Exposure Ratio) */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                {t.ankiRatePrompt}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* HARD (Red - 3x exposure) */}
                <button
                  type="button"
                  onClick={() => handleSelectDifficulty('hard')}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm transition-all cursor-pointer text-center"
                >
                  <span className="text-sm sm:text-base font-extrabold">
                    {t.ankiHardBtn}
                  </span>
                  <span className="text-[11px] text-red-100 mt-0.5">
                    {t.ankiHardDesc}
                  </span>
                </button>

                {/* NORMAL (Blue - 2x exposure) */}
                <button
                  type="button"
                  onClick={() => handleSelectDifficulty('normal')}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition-all cursor-pointer text-center"
                >
                  <span className="text-sm sm:text-base font-extrabold">
                    {t.ankiNormalBtn}
                  </span>
                  <span className="text-[11px] text-blue-100 mt-0.5">
                    {t.ankiNormalDesc}
                  </span>
                </button>

                {/* EASY (Green - 1x exposure, sent to very back) */}
                <button
                  type="button"
                  onClick={() => handleSelectDifficulty('easy')}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm transition-all cursor-pointer text-center"
                >
                  <span className="text-sm sm:text-base font-extrabold">
                    {t.ankiEasyBtn}
                  </span>
                  <span className="text-[11px] text-emerald-100 mt-0.5">
                    {t.ankiEasyDesc}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Queue Order & All Created Cards Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          {t.deckManageSectionTitle(cards.length)}
        </h3>
        <div className="space-y-2">
          {uniqueOrderedCards.map((fc, idx) => {
            const isCurrent = fc.id === currentCard.id;
            return (
              <div
                key={fc.id}
                className={`p-3 rounded-lg border flex flex-wrap items-center justify-between gap-2 text-xs ${
                  isCurrent
                    ? 'bg-indigo-50/70 border-indigo-400 font-bold'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-extrabold tabular-nums">
                    #{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                    {t.cardOrigQuestionLink(fc.questionId)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      fc.difficulty === 'hard'
                        ? 'bg-red-100 text-red-800'
                        : fc.difficulty === 'normal'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {t.cardDifficultyStatusBadge[fc.difficulty]}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold tabular-nums">
                    {t.cardExposureCountBadge(fc.exposureCount)}
                  </span>
                  <span className="text-slate-800 truncate max-w-md">
                    {fc.front}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteCard(fc.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.deleteCardAction}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
