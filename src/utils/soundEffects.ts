// Web Audio API Synthesizer for Exam Grading Feedback Sounds

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtxClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtxClass) return null;

  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtxClass();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {
      // Ignore autoplay restrictions if any
    });
  }
  return sharedAudioCtx;
}

/**
 * "띠링!" - Bright, cheerful bell chime for 100% correct answer
 */
export function playCorrectSound(muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Classic crisp "Ding-Dong / Tti-ring!" two-note high chime (B5 -> E6) with bell overtones
  const notes = [
    { freq: 987.77, start: 0, duration: 0.14, gain: 0.22 }, // B5
    { freq: 1318.51, start: 0.09, duration: 0.45, gain: 0.28 }, // E6
    { freq: 2637.02, start: 0.09, duration: 0.3, gain: 0.08 }, // E7 harmonic shimmer
  ];

  notes.forEach(({ freq, start, duration, gain }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + start);

    gainNode.gain.setValueAtTime(0.0001, now + start);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + start + 0.012);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      now + start + duration
    );

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + duration + 0.02);
  });
}

/**
 * Dedicated soft two-step neutral marimba/chime sound for partial credit ("부분 정답")
 */
export function playPartialSound(muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Neutral double-tap tone (E4 -> G4)
  const notes = [
    { freq: 329.63, start: 0, duration: 0.16, gain: 0.2 }, // E4
    { freq: 392.0, start: 0.14, duration: 0.26, gain: 0.2 }, // G4
  ];

  notes.forEach(({ freq, start, duration, gain }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + start);

    gainNode.gain.setValueAtTime(0.0001, now + start);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + start + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      now + start + duration
    );

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + duration + 0.02);
  });
}

/**
 * "뚜둥" - Low, resonant two-tone drop for wrong answer
 */
export function playWrongSound(muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // "Ttu-dung" low dramatic interval (E3 -> A#2)
  const notes = [
    { freq: 164.81, endFreq: 155.56, start: 0, duration: 0.18, gain: 0.26 },
    { freq: 116.54, endFreq: 103.83, start: 0.16, duration: 0.42, gain: 0.3 },
  ];

  notes.forEach(({ freq, endFreq, start, duration, gain }) => {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now + start);
    osc.frequency.exponentialRampToValueAtTime(
      endFreq,
      now + start + duration
    );

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now + start);

    gainNode.gain.setValueAtTime(0.0001, now + start);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + start + 0.018);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      now + start + duration
    );

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + duration + 0.03);
  });
}

/**
 * Realistic Applause + Celebratory Fanfare when all questions in the round are answered 100% correctly
 */
export function playApplauseSound(muted = false): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Celebratory Fanfare Chord Arpeggio (C5 - E5 - G5 - C6)
  const fanfareNotes = [
    { freq: 523.25, start: 0.0, duration: 0.6, gain: 0.15 },
    { freq: 659.25, start: 0.08, duration: 0.6, gain: 0.15 },
    { freq: 783.99, start: 0.16, duration: 0.7, gain: 0.15 },
    { freq: 1046.5, start: 0.24, duration: 1.1, gain: 0.2 },
  ];

  fanfareNotes.forEach(({ freq, start, duration, gain }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + start);

    gainNode.gain.setValueAtTime(0.0001, now + start);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + start + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      now + start + duration
    );

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + duration + 0.03);
  });

  // 2. Synthesized Crowd Applause (layered bandpass-filtered noise bursts over 2.6 seconds)
  const bufferSize = Math.floor(ctx.sampleRate * 0.08);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const totalClaps = 75;
  const durationSpan = 2.4;

  for (let i = 0; i < totalClaps; i++) {
    const progress = i / totalClaps;
    // Envelope curve for crowd applause intensity (rises quickly, sustains, fades out)
    const envelope =
      progress < 0.15
        ? progress / 0.15
        : progress > 0.7
        ? (1 - progress) / 0.3
        : 1.0;

    const jitter = (Math.random() - 0.5) * 0.05;
    const clapStart = Math.max(0, progress * durationSpan + jitter);
    const clapDuration = 0.045 + Math.random() * 0.035;

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    // Vary bandpass center frequency between 850Hz and 2200Hz to simulate diverse hand claps
    filter.frequency.setValueAtTime(
      850 + Math.random() * 1350,
      now + clapStart
    );
    filter.Q.setValueAtTime(1.8 + Math.random() * 1.5, now + clapStart);

    const clapGain = ctx.createGain();
    const peakGain = (0.06 + Math.random() * 0.08) * Math.max(0.05, envelope);

    clapGain.gain.setValueAtTime(0.0001, now + clapStart);
    clapGain.gain.exponentialRampToValueAtTime(
      peakGain,
      now + clapStart + 0.005
    );
    clapGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + clapStart + clapDuration
    );

    source.connect(filter);
    filter.connect(clapGain);
    clapGain.connect(ctx.destination);

    source.start(now + clapStart);
    source.stop(now + clapStart + clapDuration + 0.01);
  }
}
