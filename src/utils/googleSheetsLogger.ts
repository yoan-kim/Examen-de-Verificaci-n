// 중앙 Google Apps Script Web App 연동 모듈 (구글 로그인 불필요)

export const CENTRAL_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz4YJyiKLQS020xsM5ccadDIykoqJVOl_wlQqavZZEdqSb1J1b-HT98_gBDveHtyww/exec';

export const CENTRAL_SPREADSHEET_URL =
  'https://docs.google.com/spreadsheets/d/1FAJLVZp_--2xhFt9eI7l3YXQKbi59FvSfrh9d7cZz4E/edit';

export type ExamSlotType = '점심' | '저녁';

export interface RosterMember {
  name: string;
  telegramId?: string;
}

export interface RosterFetchResult {
  ok: boolean;
  roster: RosterMember[];
  recommendedTargetDate: string;
  recommendedExamSlot: ExamSlotType;
  ecuadorNow?: string;
}

export interface ExamSheetPayload {
  workerName: string;
  targetDate: string;
  examSlot: ExamSlotType;
  scoreText: string;
  passStatus: string;
  examLevelTitle: string;
  telegramSent: boolean;
}

export interface ExamSheetAppendResult {
  ok: boolean;
  lateStatus?: '정상' | '지각' | string;
  submitDate?: string;
  submitTime?: string;
  targetDate?: string;
  examSlot?: ExamSlotType;
  error?: string;
}

const FALLBACK_NAMES = [
  'Celeste',
  'Daniel',
  'Daniela',
  'Ernan',
  'Joselin',
  'Lia',
  'Lucia',
  'Miguel',
  'Selina',
];

function getEcuadorDateParts(date: Date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Guayaquil',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    weekday: 'short',
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';
  const ymd = `${get('year')}-${get('month')}-${get('day')}`;
  const hour = Number(get('hour'));
  const weekday = get('weekday'); // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  return { ymd, hour, weekday };
}

function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days, 12, 0, 0));
  return dt.toISOString().slice(0, 10);
}

export function getLocalRecommendedSlot(): {
  targetDate: string;
  examSlot: ExamSlotType;
} {
  const { ymd, hour, weekday } = getEcuadorDateParts();
  if (weekday === 'Sun') {
    return { targetDate: addDaysYmd(ymd, 1), examSlot: '점심' };
  }
  if (weekday === 'Sat') {
    return { targetDate: addDaysYmd(ymd, 2), examSlot: '점심' };
  }
  if (weekday === 'Fri') {
    return hour < 17
      ? { targetDate: ymd, examSlot: '저녁' }
      : { targetDate: addDaysYmd(ymd, 3), examSlot: '점심' };
  }
  return hour < 17
    ? { targetDate: ymd, examSlot: '저녁' }
    : { targetDate: addDaysYmd(ymd, 1), examSlot: '점심' };
}

export async function fetchCentralRoster(): Promise<RosterFetchResult> {
  const localRec = getLocalRecommendedSlot();
  try {
    const res = await fetch(`${CENTRAL_APPS_SCRIPT_URL}?action=roster`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await res.json();
    if (data && data.ok && Array.isArray(data.roster) && data.roster.length > 0) {
      return {
        ok: true,
        roster: data.roster,
        recommendedTargetDate: data.recommendedTargetDate || localRec.targetDate,
        recommendedExamSlot:
          data.recommendedExamSlot === '점심' ? '점심' : '저녁',
        ecuadorNow: data.ecuadorNow,
      };
    }
  } catch (err) {
    console.error('Failed to fetch central roster:', err);
  }

  return {
    ok: false,
    roster: FALLBACK_NAMES.map((name) => ({ name })),
    recommendedTargetDate: localRec.targetDate,
    recommendedExamSlot: localRec.examSlot,
  };
}

export async function appendExamResultToCentralSheet(
  payload: ExamSheetPayload
): Promise<ExamSheetAppendResult> {
  try {
    const res = await fetch(CENTRAL_APPS_SCRIPT_URL, {
      method: 'POST',
      // text/plain 사용으로 Google Apps Script CORS preflight 방지
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data && data.ok) {
      return data as ExamSheetAppendResult;
    }
    return {
      ok: false,
      error: data?.error || 'Google Sheets logging failed',
    };
  } catch (err: any) {
    console.error('appendExamResultToCentralSheet error:', err);
    return {
      ok: false,
      error: err?.message || 'Network error while saving to Google Sheets',
    };
  }
}