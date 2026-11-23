import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck,
  UserPlus,
  KeyRound,
} from 'lucide-react';
import { Language } from '../types/exam';
import { UILocalization } from '../data/examRegistry';

const WORKER_SECRET_CODE = '144000';
const TELEGRAM_BOT_TOKEN = '9161923664:AAGlBmy8mTt1Wp6O6BngDpOObhz-6ervxUU';
// Derived from https://t.me/c/2256338393/17193 -> supergroup/channel chat_id: -1002256338393
const TELEGRAM_DEFAULT_CHAT_ID = '-1002256338393';
const TELEGRAM_DEFAULT_THREAD_ID = 17193;

export const PRESET_WORKER_NAMES = [
  'Celeste',
  'Daniel',
  'Daniela',
  'Ernan',
  'Joselin',
  'Lia',
  'Lucia',
  'Miguel',
  'Selina',
].sort((a, b) => a.localeCompare(b));

interface WorkerAuthModalProps {
  isOpen: boolean;
  isUnlocked: boolean;
  t: UILocalization;
  onClose: () => void;
  onUnlockSuccess: () => void;
  onLockWorkerMode: () => void;
}

export const WorkerAuthModal: React.FC<WorkerAuthModalProps> = ({
  isOpen,
  isUnlocked,
  t,
  onClose,
  onUnlockSuccess,
  onLockWorkerMode,
}) => {
  const [step, setStep] = useState<'confirm' | 'code'>('confirm');
  const [codeInput, setCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setCodeInput('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeInput.trim() === WORKER_SECRET_CODE) {
      setErrorMsg(null);
      onUnlockSuccess();
      onClose();
    } else {
      setErrorMsg(t.workerCodeErrorMsg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {isUnlocked ? (
              <Unlock className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <h3 className="text-base font-bold tracking-tight">
              {t.workerModalTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isUnlocked ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-emerald-950">
                    {t.workerActiveStatusTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    {t.workerActiveStatusDesc}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onLockWorkerMode();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  {t.workerDisableBtn}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          ) : step === 'confirm' ? (
            <div className="space-y-5">
              <div className="text-center space-y-2 py-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mb-1">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                  {t.workerModalQuestion}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  에콰도르 숙소사명자 / obrero de la casa de obreros
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('code')}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer shadow-sm"
                >
                  {t.workerModalYesBtn}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                >
                  {t.workerModalNoBtn}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="worker-secret-code-input"
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-800"
                >
                  <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t.workerCodeInputLabel}</span>
                </label>
                <input
                  id="worker-secret-code-input"
                  type="password"
                  inputMode="numeric"
                  autoFocus
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={t.workerCodeInputPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none text-base font-bold tracking-widest text-center text-slate-900"
                />
                {errorMsg && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {t.workerCodeCancelBtn}
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
                >
                  {t.workerCodeConfirmBtn}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface WorkerHouseCheckScreenProps {
  title: string;
  subtitle: string;
  t: UILocalization;
  onCompleteWorkerO: () => void;
  onCompleteWorkerX: () => void;
  onBackToLang: () => void;
}

export const WorkerHouseCheckScreen: React.FC<WorkerHouseCheckScreenProps> = ({
  title,
  subtitle,
  t,
  onCompleteWorkerO,
  onCompleteWorkerX,
  onBackToLang,
}) => {
  const [showCodeField, setShowCodeField] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeInput.trim() === WORKER_SECRET_CODE) {
      setErrorMsg(null);
      onCompleteWorkerO();
    } else {
      setErrorMsg(t.workerCodeErrorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xl text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-5">
          <Lock className="w-6 h-6" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
          {title}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-6">
          {subtitle}
        </p>

        <div className="h-px bg-slate-200 my-6" />

        <div className="flex flex-col gap-3.5">
          <button
            type="button"
            onClick={() => {
              setShowCodeField(true);
              setErrorMsg(null);
            }}
            className={`w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg transition-colors cursor-pointer whitespace-nowrap ${
              showCodeField
                ? 'bg-blue-700 text-white ring-4 ring-blue-600/20'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
            }`}
          >
            {t.workerModalYesBtn}
          </button>

          {showCodeField && (
            <form
              onSubmit={handleVerifyCodeSubmit}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-left"
            >
              <label
                htmlFor="step2-worker-code-input"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800"
              >
                <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{t.workerCodeInputLabel}</span>
              </label>
              <input
                id="step2-worker-code-input"
                type="password"
                inputMode="numeric"
                autoFocus
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder={t.workerCodeInputPlaceholder}
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none text-base font-bold tracking-widest text-center text-slate-900"
              />
              {errorMsg && (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer shadow-xs"
              >
                {t.workerCodeConfirmBtn}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={onCompleteWorkerX}
            className="w-full py-4 px-6 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border-2 border-slate-300 font-bold text-base sm:text-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            {t.workerModalNoBtn}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBackToLang}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            ← {t.changeLangBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

interface TelegramResultModalProps {
  isOpen: boolean;
  selectedLang: Language;
  t: UILocalization;
  examLevelTitle: string;
  scoreText: string;
  onClose: () => void;
}

function formatCurrentDateWithDay(lang: Language): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dayIdx = now.getDay();

  const koDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const esDays = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];

  if (lang === 'ko') {
    return `${month}월 ${day}일 ${koDays[dayIdx]}`;
  }
  return `${month}/${day}, ${esDays[dayIdx]}`;
}

export const TelegramResultModal: React.FC<TelegramResultModalProps> = ({
  isOpen,
  selectedLang,
  t,
  examLevelTitle,
  scoreText,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'custom'>('list');
  const [selectedPresetName, setSelectedPresetName] = useState<string>(() => {
    try {
      return localStorage.getItem('exam_worker_preset_name') || 'Celeste';
    } catch {
      return 'Celeste';
    }
  });
  const [customName, setCustomName] = useState<string>(() => {
    try {
      return localStorage.getItem('exam_worker_custom_name') || '';
    } catch {
      return '';
    }
  });

  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setViewMode('list');
      setIsSending(false);
      setSendSuccess(false);
      setSendError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const finalWorkerName =
    viewMode === 'custom'
      ? customName.trim()
      : selectedPresetName.trim();
  const formattedDate = formatCurrentDateWithDay(selectedLang);
  const previewMessage = t.formatTelegramPassMessage(
    finalWorkerName || '___',
    examLevelTitle,
    scoreText,
    formattedDate
  );

  const handleSelectPreset = (name: string) => {
    setSelectedPresetName(name);
    setSendError(null);
    setSendSuccess(false);
    try {
      localStorage.setItem('exam_worker_preset_name', name);
    } catch {
      // Ignore storage errors
    }
  };

  const handleCustomNameChange = (val: string) => {
    setCustomName(val);
    setSendError(null);
    setSendSuccess(false);
    try {
      localStorage.setItem('exam_worker_custom_name', val);
    } catch {
      // Ignore storage errors
    }
  };

  const discoverAndSendTelegramMessage = async () => {
    if (!finalWorkerName) {
      setSendError(t.telegramNameRequiredError);
      return;
    }

    setIsSending(true);
    setSendError(null);
    setSendSuccess(false);

    try {
      const sendToChat = async (
        chatId: string,
        threadId?: number
      ): Promise<boolean> => {
        const payload: Record<string, unknown> = {
          chat_id: chatId,
          text: previewMessage,
        };
        if (threadId !== undefined) {
          payload.message_thread_id = threadId;
        }
        const res = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) return false;
        const data = await res.json();
        return Boolean(data?.ok);
      };

      // 1. Try sending directly to the configured room (-1002256338393), first as normal message, or with thread ID 17193 if it's a forum topic
      let sentOk = await sendToChat(TELEGRAM_DEFAULT_CHAT_ID);
      if (!sentOk) {
        sentOk = await sendToChat(
          TELEGRAM_DEFAULT_CHAT_ID,
          TELEGRAM_DEFAULT_THREAD_ID
        );
      }

      // 2. Fallback: also check getUpdates in case the chat ID format differs
      if (!sentOk) {
        try {
          const updatesRes = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=100`
          );
          if (updatesRes.ok) {
            const updatesData = await updatesRes.json();
            if (updatesData?.ok && Array.isArray(updatesData.result)) {
              const discoveredIds = new Set<string>();
              for (const update of updatesData.result) {
                const cid =
                  update?.message?.chat?.id ??
                  update?.channel_post?.chat?.id ??
                  update?.my_chat_member?.chat?.id ??
                  update?.callback_query?.message?.chat?.id;
                if (cid !== undefined && cid !== null) {
                  discoveredIds.add(String(cid));
                }
              }
              for (const cid of Array.from(discoveredIds)) {
                if (await sendToChat(cid)) {
                  sentOk = true;
                }
              }
            }
          }
        } catch {
          // Ignore fallback errors
        }
      }

      if (sentOk) {
        setSendSuccess(true);
      } else {
        setSendError(t.telegramNoChatFoundError);
      }
    } catch {
      setSendError(t.telegramNoChatFoundError);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-sky-600 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Send className="w-5 h-5 text-white shrink-0" />
            <h3 className="text-base sm:text-lg font-bold tracking-tight">
              {t.telegramModalTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-sky-100 hover:text-white hover:bg-sky-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {viewMode === 'list' ? (
            /* STEP 1 POPUP: Preset Names Grid (including "+ 이름 직접 입력" button) -> Send Button -> Message Preview */
            <>
              <div className="space-y-2.5">
                <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
                  <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{t.telegramSelectNameLabel}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_WORKER_NAMES.map((name) => {
                    const isSelected = selectedPresetName === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleSelectPreset(name)}
                        className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}

                  {/* Touchable "+ 이름 직접 입력" Button right inside the name buttons grid */}
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('custom');
                      setSendError(null);
                      setSendSuccess(false);
                    }}
                    className="col-span-2 sm:col-span-3 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 border-dashed border-sky-300 bg-sky-50/70 text-sky-700 hover:bg-sky-100 hover:border-sky-400 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4 shrink-0" />
                    <span>{t.telegramCustomNameLabel}</span>
                  </button>
                </div>
              </div>

              {/* Send Button directly below the name buttons */}
              <button
                type="button"
                onClick={discoverAndSendTelegramMessage}
                disabled={isSending}
                className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-white font-bold text-sm sm:text-base transition-colors shadow-sm ${
                  isSending
                    ? 'bg-sky-400 cursor-wait'
                    : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 cursor-pointer'
                }`}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                    <span>{t.telegramSendingBtn}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 shrink-0" />
                    <span>{t.telegramSendConfirmBtn}</span>
                  </>
                )}
              </button>

              {/* Feedback Banners */}
              {sendSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{t.telegramSendSuccessMsg}</span>
                </div>
              )}

              {sendError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs sm:text-sm font-semibold flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{sendError}</span>
                </div>
              )}

              {/* Live Message Preview below the Send button */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-slate-500">
                  {t.telegramPreviewLabel}
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-900 whitespace-pre-line leading-relaxed">
                  {previewMessage}
                </p>
              </div>
            </>
          ) : (
            /* STEP 2 POPUP (When "+ 이름 직접 입력" is pressed): Direct Name Textbox -> Send Button -> Message Preview */
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="telegram-custom-worker-name"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800"
                  >
                    <UserPlus className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{t.telegramCustomNameLabel}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('list');
                      setSendError(null);
                      setSendSuccess(false);
                    }}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
                  >
                    ← {t.workerCodeCancelBtn}
                  </button>
                </div>
                <input
                  id="telegram-custom-worker-name"
                  type="text"
                  autoFocus
                  value={customName}
                  onChange={(e) => handleCustomNameChange(e.target.value)}
                  placeholder={t.telegramCustomNamePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 outline-none text-sm sm:text-base font-semibold text-slate-900"
                />
              </div>

              {/* Send Button directly below the custom name textbox */}
              <button
                type="button"
                onClick={discoverAndSendTelegramMessage}
                disabled={isSending}
                className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-white font-bold text-sm sm:text-base transition-colors shadow-sm ${
                  isSending
                    ? 'bg-sky-400 cursor-wait'
                    : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 cursor-pointer'
                }`}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                    <span>{t.telegramSendingBtn}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 shrink-0" />
                    <span>{t.telegramSendConfirmBtn}</span>
                  </>
                )}
              </button>

              {/* Feedback Banners */}
              {sendSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{t.telegramSendSuccessMsg}</span>
                </div>
              )}

              {sendError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs sm:text-sm font-semibold flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{sendError}</span>
                </div>
              )}

              {/* Live Message Preview below the Send button */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-slate-500">
                  {t.telegramPreviewLabel}
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-900 whitespace-pre-line leading-relaxed">
                  {previewMessage}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
