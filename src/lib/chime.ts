type AudioContextCtor = typeof AudioContext;

let context: AudioContext | null = null;

function audioContextCtor(): AudioContextCtor | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor })
      .webkitAudioContext ??
    null
  );
}

function unlock(): void {
  const Ctor = audioContextCtor();
  if (!Ctor) return;
  context ??= new Ctor();
  if (context.state === "suspended") void context.resume();
}

/** Listen for the first interaction, which is what permits audio. Safe to call twice. */
export function armChime(): () => void {
  const events = ["pointerdown", "keydown", "touchstart"] as const;
  const onInteract = () => unlock();
  for (const name of events) {
    window.addEventListener(name, onInteract, { passive: true });
  }
  return () => {
    for (const name of events) window.removeEventListener(name, onInteract);
  };
}

/** Two notes, E5 then A5 — short and bright. */
const NOTES = [
  { frequency: 659.25, start: 0, length: 0.18 },
  { frequency: 880, start: 0.14, length: 0.32 },
];

const PEAK_GAIN = 0.3;

/** Play the chime. Returns whether it actually played. */
export function playChime(): boolean {
  if (!context || context.state !== "running") return false;

  const now = context.currentTime;

  for (const note of NOTES) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = note.frequency;

    // A fast attack and an exponential tail: a bell, not a beep.
    const begin = now + note.start;
    gain.gain.setValueAtTime(0.0001, begin);
    gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, begin + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, begin + note.length);

    oscillator.connect(gain).connect(context.destination);
    oscillator.start(begin);
    oscillator.stop(begin + note.length + 0.02);
  }

  return true;
}
