// 중앙 Google Apps Script Web App 연동 모듈 (구글 로그인 불필요)

export const CENTRAL_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz4YJyiKLQS020xsM5ccadDIykoqJVOl_wlQqavZZEdqSb1J1b-HT98_gBDveHtyww/exec';

  export const CENTRAL_SPREADSHEET_URL =
    'https://docs.google.com/spreadsheets/d/1FAJLVZp_--2xhFt9eI7l3YXQKbi59FvSfrh9d7cZz4E/edit';

    export const TELEGRAM_BOT_TOKEN = '9161923664:AAGlBmy8mTt1Wp6O6BngDpOObhz-6ervxUU';
    export const TELEGRAM_DEFAULT_CHAT_ID = '-1002256338393';
    export const TELEGRAM_THREAD_ID_MEAL = 17193;    // Examen para Alimento 밥시험 (2Tes3:10)
    export const TELEGRAM_THREAD_ID_SPANISH = 18129; // 퇴근스페인어

    export type ExamCategory = '밥시험' | '퇴근스페인어';
    export type ExamSlotType = '점심' | '저녁' | string;

    export interface RosterMember {
      name: string;
        telegramId?: string;
        }

        export interface RosterFetchResult {
          ok: boolean;
            roster: RosterMember[];
              rosterMeal?: RosterMember[];
                rosterSpanish?: RosterMember[];
                  recommendedTargetDate: string;
                    recommendedExamSlot: ExamSlotType;
                      ecuadorNow?: string;
                      }

                      export interface ExamSheetPayload {
                        workerName: string;
                          examType: ExamCategory;
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
                                                  examType?: ExamCategory;
                                                    examSlot?: ExamSlotType;
                                                      error?: string;
                                                      }

                                                      const FALLBACK_MEAL_NAMES = [
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

                                                                        const FALLBACK_SPANISH_NAMES = [
                                                                          'Celeste',
                                                                            'Daniel',
                                                                              'Daniela',
                                                                                'Lia',
                                                                                  'Lucia',
                                                                                    'Miguel',
                                                                                      'Selina',
                                                                                      ];

                                                                                      export function getEcuadorDateParts(date: Date = new Date()) {
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

                                                                                                                                                                                            export async function fetchCentralRoster(examType: ExamCategory = '밥시험'): Promise<RosterFetchResult> {
                                                                                                                                                                                              const localRec = getLocalRecommendedSlot();
                                                                                                                                                                                                try {
                                                                                                                                                                                                    const res = await fetch(`${CENTRAL_APPS_SCRIPT_URL}?action=roster&examType=${encodeURIComponent(examType)}`, {
                                                                                                                                                                                                          method: 'GET',
                                                                                                                                                                                                                cache: 'no-store',
                                                                                                                                                                                                                    });
                                                                                                                                                                                                                        const data = await res.json();
                                                                                                                                                                                                                            if (data && data.ok) {
                                                                                                                                                                                                                                  const rosterMeal = Array.isArray(data.rosterMeal) && data.rosterMeal.length > 0
                                                                                                                                                                                                                                          ? data.rosterMeal
                                                                                                                                                                                                                                                  : FALLBACK_MEAL_NAMES.map((name) => ({ name }));
                                                                                                                                                                                                                                                        const rosterSpanish = Array.isArray(data.rosterSpanish) && data.rosterSpanish.length > 0
                                                                                                                                                                                                                                                                ? data.rosterSpanish
                                                                                                                                                                                                                                                                        : FALLBACK_SPANISH_NAMES.map((name) => ({ name }));

                                                                                                                                                                                                                                                                              return {
                                                                                                                                                                                                                                                                                      ok: true,
                                                                                                                                                                                                                                                                                              roster: examType === '퇴근스페인어' ? rosterSpanish : rosterMeal,
                                                                                                                                                                                                                                                                                                      rosterMeal,
                                                                                                                                                                                                                                                                                                              rosterSpanish,
                                                                                                                                                                                                                                                                                                                      recommendedTargetDate: data.recommendedTargetDate || localRec.targetDate,
                                                                                                                                                                                                                                                                                                                              recommendedExamSlot: data.recommendedExamSlot || localRec.examSlot,
                                                                                                                                                                                                                                                                                                                                      ecuadorNow: data.ecuadorNow,
                                                                                                                                                                                                                                                                                                                                            };
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                  } catch (err) {
                                                                                                                                                                                                                                                                                                                                                      console.error('Failed to fetch central roster:', err);
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                          return {
                                                                                                                                                                                                                                                                                                                                                              ok: false,
                                                                                                                                                                                                                                                                                                                                                                  roster: examType === '퇴근스페인어'
                                                                                                                                                                                                                                                                                                                                                                        ? FALLBACK_SPANISH_NAMES.map((name) => ({ name }))
                                                                                                                                                                                                                                                                                                                                                                              : FALLBACK_MEAL_NAMES.map((name) => ({ name })),
                                                                                                                                                                                                                                                                                                                                                                                  rosterMeal: FALLBACK_MEAL_NAMES.map((name) => ({ name })),
                                                                                                                                                                                                                                                                                                                                                                                      rosterSpanish: FALLBACK_SPANISH_NAMES.map((name) => ({ name })),
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              