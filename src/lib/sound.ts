/**
 * Web Audio API Sound Synthesizer untuk LogiKode (Zero External Files, Modal Rp 0)
 * 100% Client-side, ringan, bebas latency, dan aman dari SSR.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }

    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    return audioCtx;
  } catch {
    return null;
  }
}

const MUTED_STORAGE_KEY = "logikode_sound_muted";

/**
 * Mengecek apakah suara sedang dibisukan (muted) dari localStorage.
 */
export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(MUTED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Menyimpan preferensi suara mute/unmute dan mengirimkan event notifikasi ke UI.
 */
export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MUTED_STORAGE_KEY, muted ? "true" : "false");
    window.dispatchEvent(
      new CustomEvent("logikode_sound_toggle", { detail: { muted } })
    );
  } catch {}
}

/**
 * Membalikkan status mute (toggle) dan mengembalikan status terbarunya.
 */
export function toggleSoundMuted(): boolean {
  const next = !isSoundMuted();
  setSoundMuted(next);
  return next;
}

/**
 * Efek suara: Klik tombol halus taktil
 */
export function playClick(): void {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {}
}

/**
 * Efek suara: Jawaban Benar (Chime nada naik ceria: E5 -> B5)
 */
export function playCorrect(): void {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [
      { freq: 659.25, time: 0, duration: 0.12 }, // E5
      { freq: 987.77, time: 0.09, duration: 0.28 }, // B5
    ];

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.18, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration);
    });
  } catch {}
}

/**
 * Efek suara: Jawaban Salah (Nada rendah lembut: G3 -> D#3)
 */
export function playWrong(): void {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [
      { freq: 240, time: 0, duration: 0.15 },
      { freq: 175, time: 0.12, duration: 0.25 },
    ];

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.14, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration);
    });
  } catch {}
}

/**
 * Efek suara: Selesai Level (Melodi kemenangan fanfare: C5 -> E5 -> G5 -> C6)
 */
export function playLevelComplete(): void {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const fanfare = [
      { freq: 523.25, time: 0.0, duration: 0.1 }, // C5
      { freq: 659.25, time: 0.1, duration: 0.1 }, // E5
      { freq: 783.99, time: 0.2, duration: 0.12 }, // G5
      { freq: 1046.5, time: 0.32, duration: 0.4 }, // C6
    ];

    fanfare.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.2, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration);
    });
  } catch {}
}
