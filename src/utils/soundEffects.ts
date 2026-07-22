let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.debug('Audio not allowed yet', e);
  }
}

export function playTimerCompleteSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Dual arpeggiated beep sequence
    [0, 0.15, 0.3].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25 * (idx + 1), now + delay); // C5, C6, C7

      gain.gain.setValueAtTime(0.2, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.25);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
}

export function playLevelUpSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const freqs = [440, 554.37, 659.25, 880, 1108.73];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
}

// Ambient Synth Loop
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

export function setAmbientSynth(enabled: boolean, mode: 'cyber_synth' | 'rain_hud' | 'deep_space' | 'off') {
  if (!enabled || mode === 'off') {
    if (ambientGain && audioCtx) {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        try {
          ambientOsc1?.stop();
          ambientOsc2?.stop();
          ambientOsc1 = null;
          ambientOsc2 = null;
        } catch {
          // ignore
        }
      }, 500);
    }
    return;
  }

  try {
    const ctx = getAudioContext();
    if (ambientOsc1) {
      ambientOsc1.stop();
      ambientOsc2?.stop();
    }

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 1);

    ambientOsc1 = ctx.createOscillator();
    ambientOsc2 = ctx.createOscillator();

    if (mode === 'cyber_synth') {
      ambientOsc1.type = 'sawtooth';
      ambientOsc1.frequency.setValueAtTime(110, ctx.currentTime); // A2
      ambientOsc2.type = 'sine';
      ambientOsc2.frequency.setValueAtTime(110.5, ctx.currentTime); // slight detune
    } else if (mode === 'deep_space') {
      ambientOsc1.type = 'sine';
      ambientOsc1.frequency.setValueAtTime(65.41, ctx.currentTime); // C2
      ambientOsc2.type = 'triangle';
      ambientOsc2.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
    } else {
      ambientOsc1.type = 'sine';
      ambientOsc1.frequency.setValueAtTime(98, ctx.currentTime); // G2
      ambientOsc2.type = 'sine';
      ambientOsc2.frequency.setValueAtTime(146.83, ctx.currentTime); // D3
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, ctx.currentTime);

    ambientOsc1.connect(filter);
    ambientOsc2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientOsc1.start();
    ambientOsc2.start();
  } catch (e) {
    console.debug('Ambient audio initialization failed', e);
  }
}
