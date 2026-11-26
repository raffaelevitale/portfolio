/**
 * Suoni sintetizzati con Web Audio: niente file audio da scaricare.
 * Tutto parte solo dopo un gesto dell'utente (click sull'otturatore).
 */

let context: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (context) return context;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  context = new Ctor();
  return context;
}

function noiseBuffer(ctx: AudioContext, seconds: number, brown = false): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    if (brown) {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    } else {
      data[i] = white;
    }
  }
  return buffer;
}

function burst(ctx: AudioContext, at: number, frequency: number, gain: number, length: number): void {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, length);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = frequency;
  filter.Q.value = 0.9;
  const env = ctx.createGain();
  env.gain.setValueAtTime(gain, at);
  env.gain.exponentialRampToValueAtTime(0.0001, at + length);
  src.connect(filter).connect(env).connect(ctx.destination);
  src.start(at);
}

/** Scatto: specchio che sale, tendina, specchio che torna giù. */
export function playShutter(): void {
  const ctx = audio();
  if (!ctx) return;
  void ctx.resume();
  const now = ctx.currentTime + 0.01;
  burst(ctx, now, 2600, 0.5, 0.05);
  burst(ctx, now + 0.075, 1700, 0.35, 0.07);
  const thump = ctx.createOscillator();
  const env = ctx.createGain();
  thump.frequency.setValueAtTime(140, now);
  thump.frequency.exponentialRampToValueAtTime(60, now + 0.08);
  env.gain.setValueAtTime(0.25, now);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
  thump.connect(env).connect(ctx.destination);
  thump.start(now);
  thump.stop(now + 0.12);
}

/** Leggero scatto da carta/pellicola per la navigazione tra oggetti. */
export function playAdvance(): void {
  const ctx = audio();
  if (!ctx || ctx.state !== "running") return;
  burst(ctx, ctx.currentTime + 0.005, 3800, 0.12, 0.03);
}

/** L'interruttore della luce di sicurezza: uno scatto secco, poi il ronzio della lampada che si accende. */
export function playSwitch(on: boolean): void {
  const ctx = audio();
  if (!ctx || ctx.state !== "running") return;
  const t = ctx.currentTime + 0.005;
  burst(ctx, t, 2200, 0.32, 0.025);
  burst(ctx, t + 0.03, 900, 0.18, 0.04);
  if (!on) return;
  const hum = ctx.createOscillator();
  const env = ctx.createGain();
  hum.type = "sawtooth";
  hum.frequency.value = 100;
  env.gain.setValueAtTime(0.0001, t + 0.05);
  env.gain.exponentialRampToValueAtTime(0.025, t + 0.15);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
  hum.connect(env).connect(ctx.destination);
  hum.start(t + 0.05);
  hum.stop(t + 0.75);
}

const DRIP_MIN_MS = 4000;
const DRIP_RANGE_MS = 6000;

/** Ronzio dell'aspiratore e gocce dal rubinetto. Restituisce la funzione per fermare tutto. */
export function startAmbience(): () => void {
  const ctx = audio();
  if (!ctx) return () => undefined;
  void ctx.resume();

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
  master.connect(ctx.destination);

  const hum = ctx.createBufferSource();
  hum.buffer = noiseBuffer(ctx, 3, true);
  hum.loop = true;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 220;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.06;
  hum.connect(lowpass).connect(humGain).connect(master);
  hum.start();

  let timer: ReturnType<typeof setTimeout> | undefined;
  const drip = () => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1500, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.1);
    env.gain.setValueAtTime(0.05, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    osc.connect(env).connect(master);
    osc.start(t);
    osc.stop(t + 0.18);
    timer = setTimeout(drip, DRIP_MIN_MS + Math.random() * DRIP_RANGE_MS);
  };
  timer = setTimeout(drip, 2500);

  return () => {
    if (timer) clearTimeout(timer);
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0, t + 0.4);
    hum.stop(t + 0.45);
  };
}
