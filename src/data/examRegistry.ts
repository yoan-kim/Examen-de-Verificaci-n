import {
  ExamEdition,
  Language,
  PartEvaluation,
  QuestionEvaluation,
  QuestionItem,
  QuestionPart,
  RoundNumber,
} from '../types/exam';
import { edition15 } from './editions/edition15';
import { edition16 } from './editions/edition16';
import { edition17 } from './editions/edition17';

/**
 * Cumulative Registry of Exam Editions.
 * Add future editions here and mark the newest one with `isLatest: true`.
 * Sorted from latest to oldest so the first item is always the default latest exam.
 */
export const EXAM_EDITIONS: ExamEdition[] = [
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
  // Version Switcher (bottom-right) strings
  versionSwitcherLabel: string;
  versionSwitcherModalTitle: string;
  versionLatestTag: string;
  versionPreviousTag: string;
  // Not uploaded empty state strings
  notUploadedTitle: string;
  notUploadedDesc: string;
  switchToAvailableEditionBtn: (badge: string) => string;
}

export const i18n: Record<Language, UILocalization> = {
  ko: {
    changeLangBtn: '언어 선택 화면으로',
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
    hideNoteEditorBtn: '노트 편집 닫기',
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
    versionSwitcherLabel: '차수 변경',
    versionSwitcherModalTitle: '시험 차수(버전) 선택',
    versionLatestTag: '최신 기본',
    versionPreviousTag: '이전 차수',
    notUploadedTitle: '아직 자료 업로드가 안 되었습니다.',
    notUploadedDesc:
      '현재 선택한 언어의 해당 차수 시험 문제가 아직 등록되지 않았습니다. 오른쪽 아래의 차수 변경 버튼이나 아래 버튼을 눌러 이전 차수를 이용해 주세요.',
    switchToAvailableEditionBtn: (badge) => `이전 차수 열기 (${badge})`,
  },
  es: {
    changeLangBtn: 'Cambiar idioma',
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
    hideNoteEditorBtn: 'Cerrar editor de nota',
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
    versionSwitcherLabel: 'Cambiar edición',
    versionSwitcherModalTitle: 'Seleccionar edición del examen',
    versionLatestTag: 'Más reciente',
    versionPreviousTag: 'Anterior',
    notUploadedTitle: 'Todavía no se han subido los datos para esta edición.',
    notUploadedDesc:
      'El material en español para esta edición aún no ha sido cargado. Puede seleccionar una edición anterior usando el botón de abajo o el selector en la esquina inferior derecha.',
    switchToAvailableEditionBtn: (badge) => `Ir a la edición disponible (${badge})`,
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
      .replace(/^(1|3|4|18|19|20)\s*절?\s*[:.]?\s*/i, '')
      .replace(/^vers[ií]culo\s*(1|3|4|18|19|20)\s*[:.]?\s*/i, '');
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
  for (const kwGroup of part.keywords) {
    const matched = kwGroup.some((kw) =>
      normUser.includes(normalizeForComparison(kw))
    );
    if (!matched) {
      missingKeywords.push(kwGroup[0]);
    }
  }

  const passed = missingKeywords.length === 0;

  return {
    partId: part.id,
    label: part.label,
    passed,
    earnedPoints: passed ? part.points : 0,
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
