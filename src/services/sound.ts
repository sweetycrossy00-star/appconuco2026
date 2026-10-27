/**
 * 8-Bit Retro Chiptune & Arcade Sound Synthesizer
 * Powered by Web Audio API for 100% offline, zero-latency retro sound effects & music.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private currentMusic: string | null = null;
  private musicInterval: number | null = null;
  private musicStep: number = 0;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    try {
      const saved = localStorage.getItem('sikuani_arcade_mute');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('sikuani_arcade_mute', String(this.isMuted));
    } catch {}
    if (this.isMuted) {
      this.stopMusic();
    }
    return this.isMuted;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    gainVal: number = 0.05,
    delay: number = 0,
    targetFreq?: number
  ) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (targetFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, targetFreq), t0 + duration);
      }

      gain.gain.setValueAtTime(gainVal, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t0);
      osc.stop(t0 + duration + 0.03);
    } catch {}
  }

  private playNoise(duration: number = 0.1, gainVal: number = 0.04, delay: number = 0) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      if (!this.noiseBuffer) {
        this.noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.3), ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      }

      const t0 = ctx.currentTime + delay;
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();

      src.buffer = this.noiseBuffer;
      gain.gain.setValueAtTime(gainVal, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

      src.connect(gain);
      gain.connect(ctx.destination);

      src.start(t0);
      src.stop(t0 + duration);
    } catch {}
  }

  // ---- RETRO SOUND FX ----

  /** Standard arcade button click */
  public btnClick() {
    this.playTone(587, 0.05, 'square', 0.04);
    this.playTone(880, 0.06, 'square', 0.04, 0.03);
  }

  /** Arcade Coin inserted */
  public coin() {
    this.playTone(987, 0.07, 'square', 0.06);
    this.playTone(1318, 0.25, 'square', 0.06, 0.07);
  }

  /** Item harvested / Pop */
  public pop() {
    this.playTone(480 + Math.random() * 240, 0.07, 'triangle', 0.06);
  }

  /** Positive achievement / correct answer */
  public correct() {
    this.playTone(523, 0.09, 'square', 0.05);
    this.playTone(659, 0.09, 'square', 0.05, 0.08);
    this.playTone(784, 0.16, 'square', 0.06, 0.16);
  }

  /** Error / damage taken */
  public hurt() {
    this.playTone(220, 0.22, 'sawtooth', 0.08, 0, 70);
    this.playNoise(0.12, 0.05);
  }

  /** Level Up / Star acquired */
  public levelUp() {
    const notes = [523, 659, 784, 1046, 1318];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.15, 'triangle', 0.07, idx * 0.06);
    });
  }

  /** Victory fanfare */
  public victory() {
    const fanfare = [
      { f: 523, d: 0.15, t: 0 },
      { f: 523, d: 0.15, t: 0.15 },
      { f: 523, d: 0.15, t: 0.3 },
      { f: 659, d: 0.25, t: 0.45 },
      { f: 784, d: 0.25, t: 0.65 },
      { f: 1046, d: 0.5, t: 0.9 },
    ];
    fanfare.forEach((n) => {
      this.playTone(n.f, n.d, 'square', 0.07, n.t);
    });
  }

  /** Game Over lament */
  public gameOver() {
    const laments = [392, 349, 311, 261, 196];
    laments.forEach((freq, idx) => {
      this.playTone(freq, 0.28, 'sawtooth', 0.08, idx * 0.2, freq * 0.85);
    });
  }

  /** Conuco watering sound (water droplets) */
  public water() {
    this.playTone(1200, 0.06, 'sine', 0.05, 0, 800);
    this.playTone(1400, 0.06, 'sine', 0.05, 0.05, 950);
    this.playTone(1600, 0.07, 'sine', 0.05, 0.1, 1100);
  }

  /** Field tool slash / digging */
  public toolSlash() {
    this.playTone(400, 0.08, 'triangle', 0.06, 0, 150);
    this.playNoise(0.08, 0.04);
  }

  /** Silhouette pulse effect */
  public silhouettePulse() {
    this.playTone(330, 0.12, 'sawtooth', 0.04, 0, 440);
  }

  /** Sikuani word audio chime (phonetic musical rhythm) */
  public sikuaniWordSound(word: string) {
    // Generate an 8-bit phonetic melodic signature based on the characters
    const hash = word.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const baseFreqs = [330, 392, 440, 523, 587, 659, 784];
    const len = Math.min(4, Math.max(2, word.length % 5 + 1));
    for (let i = 0; i < len; i++) {
      const f = baseFreqs[(hash + i * 2) % baseFreqs.length];
      this.playTone(f, 0.12, 'triangle', 0.06, i * 0.08);
    }
  }

  // ---- CHIPTUNE BACKGROUND MUSIC TRACKS ----

  public playMusic(track: 'menu' | 'play' | 'rpg' | 'jungle' | 'theatre') {
    if (this.isMuted) return;
    if (this.currentMusic === track && this.musicInterval) return;

    this.stopMusic();
    this.currentMusic = track;
    this.musicStep = 0;

    const tempos: Record<string, number> = {
      menu: 180,
      play: 150,
      rpg: 240,
      jungle: 140,
      theatre: 280,
    };

    const intervalMs = tempos[track] || 200;

    // Start pattern loop
    this.musicInterval = window.setInterval(() => {
      this.stepMusicPattern(track);
    }, intervalMs);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentMusic = null;
  }

  private stepMusicPattern(track: string) {
    if (this.isMuted) return;
    const step = this.musicStep++;

    if (track === 'menu') {
      // Catchy llanero 8-bit arpeggio
      const melody = [523, 659, 784, 1046, 784, 659, 587, 698, 880, 1174, 880, 698];
      const bass = [261, 0, 329, 0, 392, 0, 293, 0, 349, 0, 440, 0];
      const mNote = melody[step % melody.length];
      const bNote = bass[step % bass.length];
      if (mNote) this.playTone(mNote, 0.1, 'square', 0.02);
      if (bNote) this.playTone(bNote, 0.15, 'triangle', 0.04);
      if (step % 2 === 0) this.playNoise(0.03, 0.015);
    } else if (track === 'rpg') {
      // Peaceful conuco farming harmony
      const melody = [440, 0, 523, 587, 659, 0, 587, 523, 392, 0, 440, 523, 587, 0, 523, 392];
      const bass = [220, 0, 261, 0, 329, 0, 261, 0, 196, 0, 220, 0, 293, 0, 261, 0];
      const mNote = melody[step % melody.length];
      const bNote = bass[step % bass.length];
      if (mNote) this.playTone(mNote, 0.18, 'sine', 0.03);
      if (bNote) this.playTone(bNote, 0.22, 'triangle', 0.035);
    } else if (track === 'play' || track === 'jungle') {
      // Fast arcade beat
      const melody = [659, 0, 784, 880, 0, 784, 659, 587, 523, 0, 587, 659, 0, 587, 523, 440];
      const mNote = melody[step % melody.length];
      if (mNote) this.playTone(mNote, 0.08, 'square', 0.025);
      if (step % 4 === 0) this.playTone(130, 0.08, 'sawtooth', 0.05, 0, 50);
      else if (step % 4 === 2) this.playNoise(0.05, 0.025);
      else this.playNoise(0.02, 0.01);
    } else if (track === 'theatre') {
      // Mystical ancestral tale melody
      const melody = [330, 392, 440, 493, 587, 523, 440, 392];
      const mNote = melody[step % melody.length];
      if (mNote && step % 2 === 0) this.playTone(mNote, 0.25, 'triangle', 0.03);
    }
  }
}

export const sound = new SoundEngine();
