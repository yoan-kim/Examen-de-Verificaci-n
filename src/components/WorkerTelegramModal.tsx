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
  const [manualChatId, setManualChatId] = useState<string>(() => {
    try {
      return localStorage.getItem('exam_telegram_manual_chat_id') || '';
    } catch {
      return '';
    }
  });

  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsSending(false);
      setSendSuccess(false);
      setSendError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const finalWorkerName = customName.trim() || selectedPresetName.trim();
  const formattedDate = formatCurrentDateWithDay(selectedLang);
  const previewMessage = t.formatTelegramPassMessage(
    finalWorkerName || '___',
    examLevelTitle,
    scoreText,
    formattedDate
  );

  const handleSelectPreset = (name: string) => {
    setSelectedPresetName(name);
    setCustomName('');
    setSendError(null);
    setSendSuccess(false);
    try {
      localStorage.setItem('exam_worker_preset_name', name);
      localStorage.setItem('exam_worker_custom_name', '');
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

  const handleManualChatIdChange = (val: string) => {
    setManualChatId(val);
    try {
      localStorage.setItem('exam_telegram_manual_chat_id', val.trim());
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
      const targetChatIds = new Set<string>();

      if (manualChatId.trim()) {
        targetChatIds.add(manualChatId.trim());
      } else {
        // 1. Check previously cached chat IDs from localStorage
        try {
          const cachedRaw = localStorage.getItem('exam_telegram_cached_chat_ids');
          if (cachedRaw) {
            const parsed: string[] = JSON.parse(cachedRaw);
            parsed.forEach((id) => {
              if (id) targetChatIds.add(String(id));
            });
          }
        } catch {
          // Ignore parse errors
        }

        // 2. Query getUpdates from Telegram Bot API to discover active chats/groups
        try {
          const updatesRes = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=100`
          );
          if (updatesRes.ok) {
            const updatesData = await updatesRes.json();
            if (updatesData?.ok && Array.isArray(updatesData.result)) {
              for (const update of updatesData.result) {
                const chatId =
                  update?.message?.chat?.id ??
                  update?.channel_post?.chat?.id ??
                  update?.my_chat_member?.chat?.id ??
                  update?.callback_query?.message?.chat?.id;
                if (chatId !== undefined && chatId !== null) {
                  targetChatIds.add(String(chatId));
                }
              }
            }
          }
        } catch {
          // Continue with cached IDs if getUpdates network fails
        }
      }

      if (targetChatIds.size === 0) {
        setSendError(t.telegramNoChatFoundError);
        setIsSending(false);
        return;
      }

      const chatIdList = Array.from(targetChatIds);
      let anySuccess = false;
      const successfulIds: string[] = [];

      for (const chatId of chatIdList) {
        const sendRes = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: previewMessage,
            }),
          }
        );

        if (sendRes.ok) {
          const sendData = await sendRes.json();
          if (sendData?.ok) {
            anySuccess = true;
            successfulIds.push(chatId);
          }
        }
      }

      if (anySuccess) {
        try {
          localStorage.setItem(
            'exam_telegram_cached_chat_ids',
            JSON.stringify(successfulIds)
          );
        } catch {
          // Ignore storage errors
        }
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
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.telegramModalSubtitle}
          </p>

          {/* 1. Preset Names Grid */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
              <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{t.telegramSelectNameLabel}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_WORKER_NAMES.map((name) => {
                const isSelected =
                  customName.trim().length === 0 &&
                  selectedPresetName === name;
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
            </div>
          </div>

          {/* 2. Custom Name Direct Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="telegram-custom-worker-name"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800"
            >
              <UserPlus className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{t.telegramCustomNameLabel}</span>
            </label>
            <input
              id="telegram-custom-worker-name"
              type="text"
              value={customName}
              onChange={(e) => handleCustomNameChange(e.target.value)}
              placeholder={t.telegramCustomNamePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 outline-none text-sm sm:text-base text-slate-900"
            />
          </div>

          {/* 3. Live Message Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
            <div className="text-xs font-bold text-slate-500">
              {t.telegramPreviewLabel}
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-900 whitespace-pre-line leading-relaxed">
              {previewMessage}
            </p>
          </div>

          {/* Optional Manual Chat ID Collapse/Field */}
          <div className="space-y-1">
            <label
              htmlFor="telegram-manual-chat-id"
              className="block text-xs font-semibold text-slate-500"
            >
              {t.telegramChatTargetLabel}
            </label>
            <input
              id="telegram-manual-chat-id"
              type="text"
              value={manualChatId}
              onChange={(e) => handleManualChatIdChange(e.target.value)}
              placeholder={t.telegramChatIdManualPlaceholder}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-600 outline-none text-xs text-slate-700"
            />
            <p className="text-[11px] text-slate-400 leading-normal">
              {t.telegramChatTargetAutoHint}
            </p>
          </div>

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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              {t.workerCodeCancelBtn}
            </button>
            <button
              type="button"
              onClick={discoverAndSendTelegramMessage}
              disabled={isSending}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-xs sm:text-sm transition-colors shadow-sm ${
                isSending
                  ? 'bg-sky-400 cursor-wait'
                  : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 cursor-pointer'
              }`}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>{t.telegramSendingBtn}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 shrink-0" />
                  <span>{t.telegramSendConfirmBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
