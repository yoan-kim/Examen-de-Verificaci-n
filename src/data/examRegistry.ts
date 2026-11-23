import {
  ExamEdition,
  FlashcardDifficulty,
  Language,
  MistakeReasonTagId,
  PartEvaluation,
  QuestionEvaluation,
  QuestionItem,
  QuestionPart,
  RoundNumber,
} from '../types/exam';
import { edition15 } from './editions/edition15';
import { edition16 } from './editions/edition16';
import { edition17 } from './editions/edition17';
import { edition18 } from './editions/edition18';

/**
 * Cumulative Registry of Exam Editions.
 * Add future editions here and mark the newest one with `isLatest: true`.
 * Sorted from latest to oldest so the first item is always the default latest exam.
 */
export const EXAM_EDITIONS: ExamEdition[] = [
  edition18,
  edition17,
  edition16,
  edition15,
].sort((a, b) => b.editionNumber - a.editionNumber);

export const DEFAULT_LATEST_EDITION_ID = EXAM_EDITIONS[0].id;

export function getEditionById(id: string): ExamEdition {
  return EXAM_EDITIONS.find((e) => e.id === id) || EXAM_EDITIONS[0];
}

export interface UILocalization {
  changeLangBtn: string;
  resetBtn: string;
  gradeAllBtn: string;
  gradingLoadingBtn: string;
  checkSingleBtn: string;
  soundOnLabel: string;
  soundOffLabel: string;
  advancedStudyOnLabel: string;
  advancedStudyOffLabel: string;
  advancedStudyBannerTitle: string;
  advancedStudyBannerDesc: string;
  perfectCelebrationText: string;
  beforeGradeText: string;
  gradingRuleSummary: string;
  roundNames: Record<RoundNumber, string>;
  mockTabName: string;
  notesTabName: string;
  questionBadge: (
    orderIdx: number,
    origId: number,
    points: number,
    isVerse: boolean,
    hidePoints?: boolean
  ) => string;
  verseRuleNotice: string;
  keywordRuleNotice: string;
  placeholderDefault: string;
  placeholderBlank: (blankLabel: string) => string;
  correctBanner: (earned: number, max: number, hidePoints?: boolean) => string;
  partialBanner: (earned: number, max: number, hidePoints?: boolean) => string;
  wrongBanner: (earned: number, max: number, hidePoints?: boolean) => string;
  modelAnswerHeader: string;
  similarityLabel: string;
  missingKeywordsLabel: string;
  exactMismatchHint: string;
  partStatusCorrect: string;
  partStatusWrong: string;
  totalScoreSummary: (
    earnedPoints: number,
    maxPoints: number,
    passedCount: number,
    totalCount: number,
    hidePoints?: boolean
  ) => string;
  // Study Notes UI strings
  personalNoteTitle: string;
  personalNotePlaceholder: string;
  personalNoteSavedBadge: string;
  personalNoteEmptyHint: string;
  openOrEditNoteBtn: string;
  hideNoteEditorBtn: string;
  postGradeNoteHeader: string;
  postGradeNoNoteYet: string;
  goToNotesTabBtn: string;
  backToExamTabBtn: string;
  notesFilterAll: string;
  notesFilterWrittenOnly: string;
  notesCountSummary: (writtenCount: number, totalCount: number) => string;
  notesEmptyFilteredTitle: string;
  notesEmptyFilteredDesc: string;
  showAnswerInNoteToggle: string;
  hideAnswerInNoteToggle: string;
  clearSingleNoteBtn: string;
  // Flashcards & Anti-Mistake Advanced Study UI strings
  flashcardsTabName: (count: number) => string;
  mistakeReasonHeader: string;
  mistakeReasonHint: string;
  mistakeTagLabels: Record<MistakeReasonTagId, string>;
  frequentMissedKeywordsTitle: string;
  frequentMissedKeywordsHint: string;
  missedTimesBadge: (count: number) => string;
  clearMissedKeywordsBtn: string;
  cardBuilderHeader: string;
  cardBuilderSub: string;
  openCardBuilderBtn: string;
  closeCardBuilderBtn: string;
  quickFillLabel: string;
  quickFillWholeQuestion: string;
  cardFrontLabel: string;
  cardFrontPlaceholder: string;
  cardBackLabel: string;
  cardBackPlaceholder: string;
  cardWarningWordsLabel: string;
  cardWarningWordsPlaceholder: string;
  saveNewCardBtn: string;
  updateCardBtn: string;
  cancelEditCardBtn: string;
  questionCardsListTitle: (count: number) => string;
  goToFlashcardsTabBtn: (count: number) => string;
  flashcardsPageTitle: string;
  flashcardsPageDesc: string;
  flashcardsEmptyTitle: string;
  flashcardsEmptyDesc: string;
  cardQueueInfoBadge: (currentPos: number, totalCards: number) => string;
  cardExposureCountBadge: (count: number) => string;
  cardDifficultyStatusBadge: Record<FlashcardDifficulty, string>;
  cardOrigQuestionLink: (qId: number) => string;
  cardPracticeInputLabel: string;
  cardPracticeInputPlaceholder: string;
  cardCheckPracticeBtn: string;
  cardShowAnswerBtn: string;
  cardPracticeMatchBanner: (similarity: number, allWarningMatched: boolean) => string;
  cardBackHeader: string;
  cardRedHighlighterLegend: string;
  ankiRatePrompt: string;
  ankiHardBtn: string;
  ankiHardDesc: string;
  ankiNormalBtn: string;
  ankiNormalDesc: string;
  ankiEasyBtn: string;
  ankiEasyDesc: string;
  deckManageSectionTitle: (count: number) => string;
  resetAllCardExposuresBtn: string;
  editCardAction: string;
  deleteCardAction: string;
  // Version Switcher (bottom-right) strings
  versionSwitcherLabel: string;
  versionSwitcherModalTitle: string;
  versionLatestTag: string;
  versionPreviousTag: string;
  // Not uploaded empty state strings
  notUploadedTitle: string;
  notUploadedDesc: string;
  switchToAvailableEditionBtn: (badge: string) => string;
  // Ecuador Worker House (에콰도르 숙소사명자 / obrero de la casa de obreros) & Telegram strings
  workerLockBtnLabel: string;
  workerUnlockedBtnLabel: string;
  workerModalTitle: string;
  workerModalQuestion: string;
  workerModalYesBtn: string;
  workerModalNoBtn: string;
  workerCodeInputLabel: string;
  workerCodeInputPlaceholder: string;
  workerCodeConfirmBtn: string;
  workerCodeCancelBtn: string;
  workerCodeErrorMsg: string;
  workerActiveStatusTitle: string;
  workerActiveStatusDesc: string;
  workerDisableBtn: string;
  telegramSendBtn: string;
  telegramLockedHint: string;
  telegramModalTitle: string;
  telegramModalSubtitle: string;
  telegramSelectNameLabel: string;
  telegramCustomNameLabel: string;
  telegramCustomNamePlaceholder: string;
  telegramPreviewLabel: string;
  telegramChatTargetLabel: string;
  telegramChatTargetAutoHint: string;
  telegramChatIdManualPlaceholder: string;
  telegramSendConfirmBtn: string;
  telegramSendingBtn: string;
  telegramSendSuccessMsg: string;
  telegramNoChatFoundError: string;
  telegramNameRequiredError: string;
  formatTelegramPassMessage: (
    workerName: string,
    examLevelTitle: string,
    scoreText: string,
    dateText: string
  ) => string;
}

export const i18n: Record<Language, UILocalization> = {
  ko: {
    changeLangBtn: '언어변경 / Cambiar idioma',
    resetBtn: '답안 초기화',
    gradeAllBtn: '전체 채점하기',
    gradingLoadingBtn: '채점 중...',
    checkSingleBtn: '이 문제 채점',
    soundOnLabel: '효과음 켜짐',
    soundOffLabel: '효과음 꺼짐',
    advancedStudyOnLabel: '고급학습기능 켜짐',
    advancedStudyOffLabel: '고급학습기능',
    advancedStudyBannerTitle: '고급학습기능 (문제별 암기팁 노트) 활성화됨',
    advancedStudyBannerDesc:
      '문제를 공부하며 떠오른 암기법이나 핵심 요점을 각 문항 아래의 노트 칸에 기록해 보세요. 작성한 모든 노트는 [노트 모아보기] 탭에서 한눈에 볼 수 있습니다.',
    perfectCelebrationText: '축하합니다! 이번 회차의 모든 문제를 완벽하게 맞추셨습니다!',
    beforeGradeText: '답안을 작성한 뒤 채점 버튼을 눌러주세요.',
    gradingRuleSummary:
      '채점 기준: 핵심 성구는 띄어쓰기 무관 토씨 100% 일치 · 일반 문제는 핵심 단어 포함 시 정답 인정',
    roundNames: {
      1: '1회차(월)',
      2: '2회차(화)',
      3: '3회차(수)',
      4: '4회차(목)',
      5: '5회차(금)',
    },
    mockTabName: '모의시험',
    notesTabName: '노트 모아보기',
    questionBadge: (orderIdx, origId, points, isVerse, hidePoints) => {
      if (hidePoints) {
        return isVerse
          ? `문제 ${orderIdx} · 핵심 성구 (원래 ${origId}번 문항)`
          : `문제 ${orderIdx} · ${origId}번 문항`;
      }
      return isVerse
        ? `문제 ${orderIdx} · 핵심 성구 (원래 ${origId}번 문항 · ${points}점)`
        : `문제 ${orderIdx} · ${origId}번 문항 (${points}점)`;
    },
    verseRuleNotice:
      '띄어쓰기는 틀려도 무방하나, 모든 글자(토씨)가 성경 구절과 정확히 일치해야 정답 처리됩니다.',
    keywordRuleNotice: '핵심 단어가 정확히 포함되면 정답으로 인정됩니다.',
    placeholderDefault: '답안을 입력하세요...',
    placeholderBlank: (blankLabel) =>
      `${blankLabel}에 들어갈 알맞은 말을 입력하세요...`,
    correctBanner: (earned, max, hidePoints) =>
      hidePoints
        ? `정답입니다 (${max}개 항목 중 ${earned}개 정답)`
        : `정답입니다 (${earned}점 / ${max}점 획득)`,
    partialBanner: (earned, max, hidePoints) =>
      hidePoints
        ? `부분 정답입니다 (${max}개 항목 중 ${earned}개 정답 — 오답 항목을 확인하세요)`
        : `부분 정답입니다 (${earned}점 / ${max}점 획득 — 오답 항목을 확인하세요)`,
    wrongBanner: (earned, max, hidePoints) =>
      hidePoints
        ? `오답입니다 (${max}개 항목 중 ${earned}개 정답 — 모범 답안과 비교해 보세요)`
        : `오답입니다 (${earned}점 / ${max}점 획득 — 모범 답안과 비교해 보세요)`,
    modelAnswerHeader: '모범 답안 및 채점 상세',
    similarityLabel: '글자 일치율:',
    missingKeywordsLabel: '누락된 핵심어:',
    exactMismatchHint:
      '성구 암송은 띄어쓰기를 제외한 모든 글자(토씨)가 일치해야 합니다.',
    partStatusCorrect: '정답',
    partStatusWrong: '오답',
    totalScoreSummary: (
      earnedPoints,
      maxPoints,
      passedCount,
      totalCount,
      hidePoints
    ) =>
      hidePoints
        ? `채점 결과: 총 ${totalCount}문제 중 ${passedCount}문제 정답`
        : `총점: ${earnedPoints}점 / ${maxPoints}점 (완전 통과: ${passedCount} / ${totalCount}문항)`,
    personalNoteTitle: '암기팁 · 학습 노트',
    personalNotePlaceholder:
      '이 문항을 공부하며 생각난 암기팁, 앞글자 연상법, 핵심 키워드 등을 자유롭게 기록하세요 (자동 저장)...',
    personalNoteSavedBadge: '자동 저장됨',
    personalNoteEmptyHint: '아직 작성된 암기팁 노트가 없습니다.',
    openOrEditNoteBtn: '내 노트 열람 / 편집',
    hideNoteEditorBtn: '노트 저장',
    postGradeNoteHeader: '내 학습 노트 팁',
    postGradeNoNoteYet:
      '이 문제에 작성된 개인 노트가 없습니다. 오른쪽 버튼을 눌러 암기 팁을 바로 메모해 보세요.',
    goToNotesTabBtn: '노트 탭에서 전체 보기',
    backToExamTabBtn: '시험 문제 화면으로 돌아가기',
    notesFilterAll: '전체 문항 노트',
    notesFilterWrittenOnly: '작성한 노트만 보기',
    notesCountSummary: (writtenCount, totalCount) =>
      `총 ${totalCount}문항 중 ${writtenCount}개 문항에 암기팁 노트가 작성되었습니다.`,
    notesEmptyFilteredTitle: '아직 작성된 암기팁 노트가 없습니다.',
    notesEmptyFilteredDesc:
      '문제를 풀면서 암기팁을 기록하거나, 아래 버튼을 눌러 전체 문항을 보며 바로 노트를 작성해 보세요.',
    showAnswerInNoteToggle: '모범 답안 함께 보기',
    hideAnswerInNoteToggle: '모범 답안 숨기기',
    clearSingleNoteBtn: '노트 비우기',
    flashcardsTabName: (count) =>
      count > 0 ? `학습카드 (${count})` : '학습카드',
    mistakeReasonHeader: '내가 틀린 이유 · 주의 태그',
    mistakeReasonHint:
      '같은 이유로 반복해서 틀리지 않도록 주의할 포인트를 태그해 두세요.',
    mistakeTagLabels: {
      missing_word: '핵심 단어 누락',
      wrong_order: '순서 혼동',
      verse_typo: '성구 토씨·조사 오타',
      chapter_verse_num: '장·절 숫자 혼동',
      concept_confusion: '내용·인물 혼동',
    },
    frequentMissedKeywordsTitle: '내가 자주 빠뜨린 단골 누락 키워드 (빨간 형광펜 경고)',
    frequentMissedKeywordsHint:
      '채점 시 누락되었던 핵심 단어입니다. 모범 답안과 학습카드에서 빨간 형광펜으로 자동 강조됩니다.',
    missedTimesBadge: (count) => `${count}회 누락`,
    clearMissedKeywordsBtn: '누락 기록 초기화',
    cardBuilderHeader: '나만의 학습카드 만들기 (이 문제 참고 제작)',
    cardBuilderSub:
      '위의 문제와 모범 답안을 보면서 특히 기억하고 싶거나 틀렸던 부분만 골라 직접 학습카드로 만들어 보세요.',
    openCardBuilderBtn: '+ 학습카드 만들기',
    closeCardBuilderBtn: '카드 작성 닫기',
    quickFillLabel: '문항 내용 빠른 불러오기:',
    quickFillWholeQuestion: '문제 전체 불러오기',
    cardFrontLabel: '카드 앞면 (질문 · 빈칸 · 암기 단서)',
    cardFrontPlaceholder:
      '예: 계 2~3장 출현 인물 세 존재와 니골라당이 한 일은?',
    cardBackLabel: '카드 뒷면 (정답 · 핵심 암기 문장)',
    cardBackPlaceholder:
      '예: 일곱 사자, 니골라당, 요한 / 니골라당: 우상의 제물과 교훈, 행음',
    cardWarningWordsLabel: '빨간 형광펜 강조 단어 (쉼표로 구분 · 생략 가능)',
    cardWarningWordsPlaceholder:
      '특히 눈에 띄게 기억할 단어를 쉼표(,)로 구분해 적어주세요 (예: 우상의 제물, 교훈, 행음)',
    saveNewCardBtn: '이 학습카드 추가하기',
    updateCardBtn: '학습카드 수정 저장',
    cancelEditCardBtn: '수정 취소',
    questionCardsListTitle: (count) =>
      `이 문제에서 만든 내 학습카드 (${count}장)`,
    goToFlashcardsTabBtn: (count) =>
      `학습카드 복습 탭에서 반복 학습하기 (${count}장) →`,
    flashcardsPageTitle: '나만의 학습카드 반복 복습 (어려움 3 : 보통 2 : 쉬움 1)',
    flashcardsPageDesc:
      '날짜 계산 없이 현재 덱에서 [어려움 3번 : 보통 2번 : 쉬움 1번] 비율로 노출 순서만 자동 조정하여 약점을 집중 반복합니다.',
    flashcardsEmptyTitle: '아직 직접 만든 학습카드가 없습니다.',
    flashcardsEmptyDesc:
      '시험 문제를 풀면서 각 문제 아래의 [+ 학습카드 만들기] 버튼을 눌러 틀렸던 부분이나 꼭 기억할 내용을 카드로 만들어 보세요.',
    cardQueueInfoBadge: (currentPos, totalCards) =>
      `전체 ${totalCards}장 중 현재 순서 #${currentPos}`,
    cardExposureCountBadge: (count) => `누적 노출 ${count}회`,
    cardDifficultyStatusBadge: {
      hard: '어려움 (사이클당 3회 노출)',
      normal: '보통 (사이클당 2회 노출)',
      easy: '쉬움 (맨 뒤로 · 사이클당 1회 노출)',
    },
    cardOrigQuestionLink: (qId) => `원본 ${qId}번 문항`,
    cardPracticeInputLabel: '직접 답 타이핑 연습 (입력 후 Enter로 즉시 채점)',
    cardPracticeInputPlaceholder:
      '카드 앞면을 보고 여기에 정답을 직접 타이핑해 본 뒤 Enter를 누르세요...',
    cardCheckPracticeBtn: '타이핑 채점 및 정답 확인 (Enter)',
    cardShowAnswerBtn: '바로 정답 뒷면 보기',
    cardPracticeMatchBanner: (similarity, allWarningMatched) =>
      allWarningMatched
        ? `정확도 ${similarity}% · 강조 핵심어를 모두 포함했습니다!`
        : `정확도 ${similarity}% · 아래 빨간 형광펜 단어를 다시 확인하세요!`,
    cardBackHeader: '카드 뒷면 (정답 및 빨간 형광펜 강조)',
    cardRedHighlighterLegend: '빨간 형광펜 = 단골 누락 키워드 및 집중 암기 단어',
    ankiRatePrompt:
      '이 카드의 암기 난이도를 선택하세요 (선택 즉시 다음 카드로 넘어가며 반복 노출 순서가 조정됩니다):',
    ankiHardBtn: '어려움 (3회 노출)',
    ankiHardDesc: '앞쪽 순서로 바로 재투입 · 쉬움 1번 나올 때 3번 등장',
    ankiNormalBtn: '보통 (2회 노출)',
    ankiNormalDesc: '중간 순서로 배치 · 쉬움 1번 나올 때 2번 등장',
    ankiEasyBtn: '쉬움 (1회 노출)',
    ankiEasyDesc: '맨 뒤 순서로 이동 · 어려움 3번 나올 때 1번 등장',
    deckManageSectionTitle: (count) => `내가 만든 전체 학습카드 목록 (${count}장)`,
    resetAllCardExposuresBtn: '노출 횟수 전체 0회로 초기화',
    editCardAction: '수정',
    deleteCardAction: '삭제',
    versionSwitcherLabel: '차수 변경',
    versionSwitcherModalTitle: '시험 차수(버전) 선택',
    versionLatestTag: '최신 기본',
    versionPreviousTag: '이전 차수',
    notUploadedTitle: '아직 자료 업로드가 안 되었습니다.',
    notUploadedDesc:
      '현재 선택한 언어의 해당 차수 시험 문제가 아직 등록되지 않았습니다. 오른쪽 아래의 차수 변경 버튼이나 아래 버튼을 눌러 이전 차수를 이용해 주세요.',
    switchToAvailableEditionBtn: (badge) => `이전 차수 열기 (${badge})`,
    workerLockBtnLabel: '에콰도르 숙소사명자',
    workerUnlockedBtnLabel: '숙소사명자 켜짐',
    workerModalTitle: '에콰도르 숙소사명자 확인',
    workerModalQuestion: '에콰도르 숙소사명자 입니까?',
    workerModalYesBtn: '에콰도르 숙소사명자 O',
    workerModalNoBtn: '숙소사명자 X',
    workerCodeInputLabel: '코드입력',
    workerCodeInputPlaceholder: '코드입력 (144000)',
    workerCodeConfirmBtn: '코드 확인 및 시험 입장',
    workerCodeCancelBtn: '뒤로가기',
    workerCodeErrorMsg: '인증 코드가 일치하지 않습니다. 다시 확인해 주세요.',
    workerActiveStatusTitle: '에콰도르 숙소사명자 모드가 활성화되어 있습니다.',
    workerActiveStatusDesc:
      '각 회차 시험을 채점하여 100점 만점으로 통과하면 하단의 [텔레그램으로 결과 보내기] 버튼이 활성화됩니다.',
    workerDisableBtn: '숙소사명자 모드 끄기 (일반 모드로 전환)',
    telegramSendBtn: '텔레그램으로 결과 보내기',
    telegramLockedHint:
      '합격 기준 100점 만점 달성 시 [텔레그램으로 결과 보내기] 버튼이 활성화됩니다.',
    telegramModalTitle: '텔레그램으로 100점 통과 결과 보내기',
    telegramModalSubtitle:
      '본인의 이름을 선택하거나 직접 입력한 뒤 전송 버튼을 누르면 연결된 텔레그램 봇으로 합격 메시지가 전송됩니다.',
    telegramSelectNameLabel: '1. 기존 이름 명단에서 선택',
    telegramCustomNameLabel: '2. + 이름 직접 입력 (명단에 이름이 없는 경우)',
    telegramCustomNamePlaceholder: '이름을 직접 입력하세요...',
    telegramPreviewLabel: '전송될 텔레그램 메시지 미리보기',
    telegramChatTargetLabel: '수신 텔레그램 채팅방 설정 (자동 연결)',
    telegramChatTargetAutoHint:
      '봇에 메시지를 보낸 채팅방을 자동으로 찾아 전송합니다. 특정 채팅방 ID가 있다면 아래에 직접 입력할 수도 있습니다.',
    telegramChatIdManualPlaceholder:
      '자동 탐색 사용 중 (직접 입력 시 Chat ID 숫자 입력)',
    telegramSendConfirmBtn: '텔레그램으로 결과 전송하기',
    telegramSendingBtn: '텔레그램 전송 중...',
    telegramSendSuccessMsg:
      '텔레그램 봇을 통해 합격 축하 메시지가 성공적으로 전송되었습니다!',
    telegramNoChatFoundError:
      '연결된 텔레그램 채팅방을 찾을 수 없습니다. 텔레그램에서 해당 봇에게 아무 메시지("/start" 등)를 한 번 보낸 뒤 다시 전송 버튼을 눌러주세요.',
    telegramNameRequiredError:
      '명단에서 이름을 선택하거나 이름 직접 입력칸에 이름을 입력해 주세요.',
    formatTelegramPassMessage: (workerName, examLevelTitle, scoreText, dateText) =>
      `${workerName}님이 "${examLevelTitle}"을 "${scoreText}으로" 통과했습니다 (${dateText}) 축하드립니다`,
  },
  es: {
    changeLangBtn: '언어변경 / Cambiar idioma',
    resetBtn: 'Reiniciar respuestas',
    gradeAllBtn: 'Calificar todo el examen',
    gradingLoadingBtn: 'Calificando...',
    checkSingleBtn: 'Verificar esta pregunta',
    soundOnLabel: 'Sonido activado',
    soundOffLabel: 'Sonido silenciado',
    advancedStudyOnLabel: 'Estudio avanzado activo',
    advancedStudyOffLabel: 'Estudio avanzado',
    advancedStudyBannerTitle:
      'Modo de Estudio Avanzado (Notas de memorización por pregunta) activado',
    advancedStudyBannerDesc:
      'Anote libremente consejos de memorización, palabras clave o ideas útiles debajo de cada pregunta mientras estudia. Puede ver todas sus notas juntas en la pestaña [Mis Notas].',
    perfectCelebrationText:
      '¡Felicidades! ¡Ha respondido correctamente todas las preguntas de esta ronda!',
    beforeGradeText:
      'Escriba sus respuestas y presione el botón para calificar.',
    gradingRuleSummary:
      'Criterio: El versículo clave requiere exactitud total de palabras (sin importar espacios) · Las demás preguntas evalúan palabras clave',
    roundNames: {
      1: 'Ronda 1 (Lun)',
      2: 'Ronda 2 (Mar)',
      3: 'Ronda 3 (Mié)',
      4: 'Ronda 4 (Jue)',
      5: 'Ronda 5 (Vie)',
    },
    mockTabName: 'Simulacro',
    notesTabName: 'Mis Notas',
    questionBadge: (orderIdx, origId, points, isVerse, hidePoints) => {
      if (hidePoints) {
        return isVerse
          ? `Pregunta ${orderIdx} · Versículo clave (Pregunta N.º ${origId})`
          : `Pregunta ${orderIdx} · Pregunta N.º ${origId}`;
      }
      return isVerse
        ? `Pregunta ${orderIdx} · Versículo clave (Pregunta N.º ${origId} · ${points} puntos)`
        : `Pregunta ${orderIdx} · Pregunta N.º ${origId} (${points} puntos)`;
    },
    verseRuleNotice:
      'Se permiten diferencias de espacios, pero todas las palabras y letras deben coincidir exactamente con el versículo bíblico.',
    keywordRuleNotice:
      'Se califica como correcto si incluye las palabras clave esenciales.',
    placeholderDefault: 'Escriba su respuesta aquí...',
    placeholderBlank: (blankLabel) =>
      `Escriba la respuesta para ${blankLabel}...`,
    correctBanner: (earned, max, hidePoints) =>
      hidePoints
        ? `Respuesta correcta (${earned} de ${max} correctas)`
        : `Respuesta correcta (${earned} / ${max} puntos)`,
    partialBanner: (earned, max, hidePoints) =>
      hidePoints
        ? `Parcialmente correcto (${earned} de ${max} correctas — revise los incisos incorrectos)`
        : `Parcialmente correcto (${earned} / ${max} puntos — revise los incisos incorrectos)`,
    wrongBanner: (earned, max, hidePoints) =>
      hidePoints
        ? `Respuesta incorrecta (${earned} de ${max} correctas — revise la respuesta correcta)`
        : `Respuesta incorrecta (${earned} / ${max} puntos — revise la respuesta correcta)`,
    modelAnswerHeader: 'Respuesta correcta y detalle de calificación',
    similarityLabel: 'Exactitud de texto:',
    missingKeywordsLabel: 'Palabras clave faltantes:',
    exactMismatchHint:
      'El versículo debe escribirse exactamente como aparece en la Biblia (los espacios adicionales no afectan).',
    partStatusCorrect: 'Correcto',
    partStatusWrong: 'Incorrecto',
    totalScoreSummary: (
      earnedPoints,
      maxPoints,
      passedCount,
      totalCount,
      hidePoints
    ) =>
      hidePoints
        ? `Resultado: ${passedCount} de ${totalCount} preguntas correctas`
        : `Puntaje total: ${earnedPoints} / ${maxPoints} puntos (Preguntas completas: ${passedCount} de ${totalCount})`,
    personalNoteTitle: 'Nota de consejo y memorización',
    personalNotePlaceholder:
      'Escriba aquí sus consejos de memorización, palabras clave o asociaciones para recordar mejor esta pregunta (guardado automático)...',
    personalNoteSavedBadge: 'Guardado automático',
    personalNoteEmptyHint: 'Aún no hay notas escritas para esta pregunta.',
    openOrEditNoteBtn: 'Ver / Editar mi nota',
    hideNoteEditorBtn: 'Guardar nota',
    postGradeNoteHeader: 'Mi Nota de Estudio Personal',
    postGradeNoNoteYet:
      'No hay notas registradas para esta pregunta. Presione el botón para agregar un consejo de estudio.',
    goToNotesTabBtn: 'Ver todas en Mis Notas',
    backToExamTabBtn: 'Volver a las preguntas del examen',
    notesFilterAll: 'Todas las preguntas',
    notesFilterWrittenOnly: 'Solo con notas escritas',
    notesCountSummary: (writtenCount, totalCount) =>
      `Notas escritas en ${writtenCount} de ${totalCount} preguntas en total.`,
    notesEmptyFilteredTitle: 'Todavía no hay notas de estudio escritas.',
    notesEmptyFilteredDesc:
      'Agregue consejos de memorización mientras estudia las preguntas o presione el botón de abajo para ver todas las preguntas.',
    showAnswerInNoteToggle: 'Mostrar respuestas correctas',
    hideAnswerInNoteToggle: 'Ocultar respuestas correctas',
    clearSingleNoteBtn: 'Borrar nota',
    flashcardsTabName: (count) =>
      count > 0 ? `Tarjetas (${count})` : 'Tarjetas',
    mistakeReasonHeader: 'Motivo de error · Etiquetas de atención',
    mistakeReasonHint:
      'Marque el motivo de su error para no volver a fallar por la misma razón.',
    mistakeTagLabels: {
      missing_word: 'Palabra clave omitida',
      wrong_order: 'Orden confundido',
      verse_typo: 'Error exacto en versículo',
      chapter_verse_num: 'Confusión de capítulo/versículo',
      concept_confusion: 'Confusión de concepto/personaje',
    },
    frequentMissedKeywordsTitle:
      'Palabras clave omitidas frecuentemente (Alerta en rojo)',
    frequentMissedKeywordsHint:
      'Palabras que omitió al calificar. Se resaltan automáticamente en rojo en las respuestas y tarjetas.',
    missedTimesBadge: (count) => `Omitida ${count}x`,
    clearMissedKeywordsBtn: 'Reiniciar historial',
    cardBuilderHeader:
      'Crear mi propia Tarjeta de Estudio (basada en esta pregunta)',
    cardBuilderSub:
      'Consultando la pregunta y la respuesta correcta arriba, cree tarjetas personalizadas con las partes que más necesita memorizar.',
    openCardBuilderBtn: '+ Crear tarjeta de estudio',
    closeCardBuilderBtn: 'Cerrar creador de tarjetas',
    quickFillLabel: 'Autocompletar desde la pregunta:',
    quickFillWholeQuestion: 'Cargar pregunta completa',
    cardFrontLabel: 'Frente de la tarjeta (Pregunta · Pista)',
    cardFrontPlaceholder:
      'Ej.: ¿Cuáles son los tres seres que aparecen en Ap 2-3 y qué hicieron los Nicolaitas?',
    cardBackLabel: 'Reverso de la tarjeta (Respuesta a memorizar)',
    cardBackPlaceholder:
      'Ej.: Siete mensajeros, Nicolaitas, Juan / Nicolaitas: los sacrificios a los ídolos, la doctrina y la fornicación',
    cardWarningWordsLabel:
      'Palabras a resaltar en rojo (separadas por coma · opcional)',
    cardWarningWordsPlaceholder:
      'Palabras clave que desea destacar en rojo (ej.: sacrificios, doctrina, fornicación)',
    saveNewCardBtn: 'Agregar esta tarjeta',
    updateCardBtn: 'Guardar cambios de tarjeta',
    cancelEditCardBtn: 'Cancelar',
    questionCardsListTitle: (count) =>
      `Mis tarjetas creadas en esta pregunta (${count})`,
    goToFlashcardsTabBtn: (count) =>
      `Ir a repasar en la pestaña Tarjetas (${count}) →`,
    flashcardsPageTitle:
      'Repaso de Tarjetas de Estudio (Proporción Difícil 3 : Normal 2 : Fácil 1)',
    flashcardsPageDesc:
      'Sin fechas ni temporizadores: ajusta únicamente el orden de exposición para que las tarjetas Difíciles salgan 3 veces, las Normales 2 veces y las Fáciles 1 vez al final.',
    flashcardsEmptyTitle: 'Aún no ha creado tarjetas de estudio.',
    flashcardsEmptyDesc:
      'Mientras resuelve las preguntas del examen, presione el botón [+ Crear tarjeta de estudio] debajo de cualquier pregunta para crear sus propias tarjetas.',
    cardQueueInfoBadge: (currentPos, totalCards) =>
      `Tarjeta #${currentPos} de ${totalCards} en total`,
    cardExposureCountBadge: (count) => `Exposiciones: ${count}`,
    cardDifficultyStatusBadge: {
      hard: 'Difícil (3 exposiciones por ciclo)',
      normal: 'Normal (2 exposiciones por ciclo)',
      easy: 'Fácil (Al final · 1 exposición por ciclo)',
    },
    cardOrigQuestionLink: (qId) => `Pregunta N.º ${qId}`,
    cardPracticeInputLabel:
      'Práctica de escritura directa (Escriba y presione Enter para calificar)',
    cardPracticeInputPlaceholder:
      'Escriba aquí la respuesta viendo el frente de la tarjeta y presione Enter...',
    cardCheckPracticeBtn: 'Calificar y ver respuesta (Enter)',
    cardShowAnswerBtn: 'Ver respuesta directamente',
    cardPracticeMatchBanner: (similarity, allWarningMatched) =>
      allWarningMatched
        ? `Exactitud ${similarity}% · ¡Incluyó todas las palabras clave resaltadas!`
        : `Exactitud ${similarity}% · ¡Revise las palabras resaltadas en rojo abajo!`,
    cardBackHeader: 'Reverso de la tarjeta (Respuesta y resaltado en rojo)',
    cardRedHighlighterLegend:
      'Resaltado rojo = Palabras omitidas frecuentemente y puntos clave',
    ankiRatePrompt:
      'Seleccione la dificultad para ajustar el orden de repetición y pasar a la siguiente tarjeta:',
    ankiHardBtn: 'Difícil (3x)',
    ankiHardDesc: 'Vuelve pronto · Sale 3 veces por cada 1 de Fácil',
    ankiNormalBtn: 'Normal (2x)',
    ankiNormalDesc: 'Orden medio · Sale 2 veces por cada 1 de Fácil',
    ankiEasyBtn: 'Fácil (1x · Al final)',
    ankiEasyDesc: 'Va al final · Sale 1 vez por cada 3 de Difícil',
    deckManageSectionTitle: (count) =>
      `Lista completa de mis tarjetas (${count})`,
    resetAllCardExposuresBtn: 'Reiniciar contador de exposiciones a 0',
    editCardAction: 'Editar',
    deleteCardAction: 'Eliminar',
    versionSwitcherLabel: 'Cambiar edición',
    versionSwitcherModalTitle: 'Seleccionar edición del examen',
    versionLatestTag: 'Más reciente',
    versionPreviousTag: 'Anterior',
    notUploadedTitle: 'Todavía no se han subido los datos para esta edición.',
    notUploadedDesc:
      'El material en español para esta edición aún no ha sido cargado. Puede seleccionar una edición anterior usando el botón de abajo o el selector en la esquina inferior derecha.',
    switchToAvailableEditionBtn: (badge) => `Ir a la edición disponible (${badge})`,
    workerLockBtnLabel: 'obrero de la casa de obreros',
    workerUnlockedBtnLabel: 'Obrero activo',
    workerModalTitle: 'Verificación de Obrero de la Casa de Obreros',
    workerModalQuestion: '¿Es usted obrero de la casa de obreros?',
    workerModalYesBtn: 'Obrero de la casa de obreros O',
    workerModalNoBtn: 'Obrero de la casa de obreros X',
    workerCodeInputLabel: 'Ingresar código',
    workerCodeInputPlaceholder: 'Ingresar código (144000)',
    workerCodeConfirmBtn: 'Confirmar código y entrar al examen',
    workerCodeCancelBtn: 'Volver',
    workerCodeErrorMsg: 'El código ingresado no es válido. Inténtelo de nuevo.',
    workerActiveStatusTitle:
      'El modo de obrero de la casa de obreros está activo.',
    workerActiveStatusDesc:
      'Cuando obtenga 100 puntos en cualquier ronda del examen, se activará el botón [Enviar resultado por Telegram] en la parte inferior.',
    workerDisableBtn: 'Desactivar modo de obrero (Volver al modo normal)',
    telegramSendBtn: 'Enviar resultado por Telegram',
    telegramLockedHint:
      'El botón [Enviar resultado por Telegram] se activará al aprobar con 100 puntos.',
    telegramModalTitle: 'Enviar resultado de 100 puntos por Telegram',
    telegramModalSubtitle:
      'Seleccione su nombre de la lista o escríbalo directamente para enviar la notificación de aprobación por el bot de Telegram.',
    telegramSelectNameLabel: '1. Seleccionar nombre de la lista',
    telegramCustomNameLabel:
      '2. + Ingresar nombre directamente (si no está en la lista)',
    telegramCustomNamePlaceholder: 'Escriba su nombre aquí...',
    telegramPreviewLabel: 'Vista previa del mensaje de Telegram',
    telegramChatTargetLabel: 'Chat de destino de Telegram (Conexión automática)',
    telegramChatTargetAutoHint:
      'Se enviará automáticamente al chat conectado con el bot. También puede escribir un Chat ID específico abajo si lo desea.',
    telegramChatIdManualPlaceholder:
      'Detección automática activa (o ingrese Chat ID numérico)',
    telegramSendConfirmBtn: 'Enviar resultado a Telegram',
    telegramSendingBtn: 'Enviando a Telegram...',
    telegramSendSuccessMsg:
      '¡El mensaje de felicitación por aprobar con 100 puntos fue enviado por Telegram!',
    telegramNoChatFoundError:
      'No se encontró un chat activo conectado al bot. Por favor envíe cualquier mensaje (ej. "/start") al bot en Telegram una vez e inténtelo de nuevo.',
    telegramNameRequiredError:
      'Por favor seleccione un nombre de la lista o escriba su nombre directamente.',
    formatTelegramPassMessage: (workerName, examLevelTitle, scoreText, dateText) =>
      `${workerName}님(ha aprobado)이 "${examLevelTitle}"을 "${scoreText}으로" 통과했습니다 (${dateText}) 축하드립니다!\n(${workerName} ha aprobado "${examLevelTitle}" con "${scoreText}" (${dateText}) ¡Muchas felicidades!)`,
  },
};

export function normalizeForComparison(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s,.\-~—–:⋅·;'"“”‘’()[\]¡!¿?※①②③④]/g, '');
}

export function calculateSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;
  const len1 = s1.length;
  const len2 = s2.length;
  if (len1 === 0 || len2 === 0) return 0.0;

  const dp: number[][] = Array.from({ length: len1 + 1 }, () =>
    new Array(len2 + 1).fill(0)
  );
  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  const maxLen = Math.max(len1, len2);
  return (maxLen - dp[len1][len2]) / maxLen;
}

export function evaluatePartAnswer(
  userRaw: string,
  part: QuestionPart,
  isExactVerse: boolean
): PartEvaluation {
  let cleanedUserRaw = userRaw.trim();

  if (isExactVerse) {
    cleanedUserRaw = cleanedUserRaw
      .replace(/^(?:계\s*\d+\s*:\s*\d+|\d+\s*절?)\s*[:.]?\s*/i, '')
      .replace(
        /^(?:ap(?:ocalipsis)?\s*\d+\s*:\s*\d+|vers[ií]culo\s*\d+)\s*[:.]?\s*/i,
        ''
      );
  }

  const normUser = normalizeForComparison(cleanedUserRaw);
  const normExpected = normalizeForComparison(part.answer);

  if (!normUser) {
    return {
      partId: part.id,
      label: part.label,
      passed: false,
      earnedPoints: 0,
      maxPoints: part.points,
      similarity: 0,
      missingKeywords: isExactVerse ? [] : part.keywords.map((g) => g[0]),
      expectedAnswer: part.answer,
      userAnswer: userRaw,
    };
  }

  const similarity = Math.round(
    calculateSimilarity(normUser, normExpected) * 100
  );

  if (isExactVerse) {
    const exactMatch = normUser === normExpected;
    return {
      partId: part.id,
      label: part.label,
      passed: exactMatch,
      earnedPoints: exactMatch ? part.points : 0,
      maxPoints: part.points,
      similarity,
      missingKeywords: [],
      expectedAnswer: part.answer,
      userAnswer: userRaw,
    };
  }

  const missingKeywords: string[] = [];
  let matchedCount = 0;
  for (const kwGroup of part.keywords) {
    const matched = kwGroup.some((kw) =>
      normUser.includes(normalizeForComparison(kw))
    );
    if (matched) {
      matchedCount += 1;
    } else {
      missingKeywords.push(kwGroup[0]);
    }
  }

  const passed = missingKeywords.length === 0;
  const isPerBlankTenPoints =
    part.id === 'e18_q3_p1' && part.points === 30 && part.keywords.length === 3;
  const earnedPoints = passed
    ? part.points
    : isPerBlankTenPoints
    ? matchedCount * 10
    : 0;

  return {
    partId: part.id,
    label: part.label,
    passed,
    earnedPoints,
    maxPoints: part.points,
    similarity,
    missingKeywords,
    expectedAnswer: part.answer,
    userAnswer: userRaw,
  };
}

export function evaluateQuestionItem(
  question: QuestionItem,
  userInputs: Record<string, string>
): QuestionEvaluation {
  const isExactVerse = Boolean(question.isExactVerse);
  const partResults = question.parts.map((part) =>
    evaluatePartAnswer(userInputs[part.id] || '', part, isExactVerse)
  );

  const earnedPoints = partResults.reduce((acc, r) => acc + r.earnedPoints, 0);
  const maxPoints = question.totalPoints;
  const allPassed = partResults.every((r) => r.passed);
  const avgSim = Math.round(
    partResults.reduce((acc, r) => acc + r.similarity, 0) / partResults.length
  );

  return {
    questionId: question.id,
    allPassed,
    earnedPoints,
    maxPoints,
    averageSimilarity: avgSim,
    partResults,
  };
}
