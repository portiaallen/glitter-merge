type CueKind = "merge3" | "merge5" | "discover" | "collect" | "error";

let audioCtx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  return audioCtx;
}

/** Optional juice. No assets — a short original chime. Failures are silent. */
export function playCue(kind: CueKind): void {
  try {
    const ctx = context();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    const freq =
      kind === "merge5" ? 880 : kind === "discover" ? 740 : kind === "error" ? 196 : 523;
    osc.frequency.setValueAtTime(freq, now);
    if (kind === "merge5") {
      osc.frequency.exponentialRampToValueAtTime(1174, now + 0.12);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(kind === "error" ? 0.04 : 0.07, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "merge5" ? 0.28 : 0.16));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Sound is a hook, never a requirement.
  }
}
