export type Language = 'ko' | 'es';
export type RoundNumber = 1 | 2 | 3 | 4 | 5;
export type ActiveTab = RoundNumber | 'mock' | 'notes';

export interface QuestionPart {
  id: string;
  label: string;
  answer: string;
  points: number;
  /**
   * Each element in `keywords` is an OR-group of accepted synonyms/variants.
   * All groups must match (AND condition) for standard keyword grading.
   */
  keywords: string[][];
  rows?: number;
}

export interface QuestionItem {
  id: number;
  isExactVerse?: boolean;
  questionType: 'verse' | 'blank' | 'standard';
  sectionHeader?: string;
  title: string;
  passageWithBlanks?: string;
  totalPoints: number;
  parts: QuestionPart[];
}

export interface EditionLocaleData {
  isUploaded?: boolean;
  editionBadge: string;
  title: string;
  subtitle: string;
  roundDescriptions: Record<RoundNumber, string>;
  mockDescription: string;
  notesDescription: string;
  questions: Record<number, QuestionItem>;
}

export interface ExamEdition {
  id: string;
  editionNumber: number;
  isLatest?: boolean;
  hidePoints?: boolean;
  verseQuestionId: number;
  allQuestionIds: number[];
  getRoundQuestionIds: (round: RoundNumber) => number[];
  locales: Record<Language, EditionLocaleData>;
}

export interface PartEvaluation {
  partId: string;
  label: string;
  passed: boolean;
  earnedPoints: number;
  maxPoints: number;
  similarity: number;
  missingKeywords: string[];
  expectedAnswer: string;
  userAnswer: string;
}

export interface QuestionEvaluation {
  questionId: number;
  allPassed: boolean;
  earnedPoints: number;
  maxPoints: number;
  averageSimilarity: number;
  partResults: PartEvaluation[];
}
