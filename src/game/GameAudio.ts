/**
 * Procedural audio system using Web Audio API.
 * Generates all game sounds without external audio files.
 */
export class GameAudio {
  private ctx: AudioContext | null = null;
  private _soundOn = true;

  // Background music state
  private bgPlaying = false;
  private bgVolume = 0;
  private bgTargetVol = 0;
  private melodyIndex = 0;
  private bassIndex = 0;
  private nextNoteTime = 0;
  private bassNextTime = 0;
  private tempo = 140;

  private melody = [
    523, 587, 659, 784, 659, 587, 523, 0,
    392, 440, 523, 587, 523, 440, 392, 0,
    659, 784, 880, 784, 659, 523, 587, 659,
    523, 440, 392, 440, 523, 659, 523, 0,
    784, 880, 1047, 880, 784, 659, 784, 659,
    523, 587, 659, 523, 440, 392, 440, 523,
    392, 349, 392, 440, 523, 587, 523, 440,
    392, 349, 330, 349, 392, 440, 392, 0,
  ];

  private bassLine = [
    131, 131, 165, 165, 196, 196, 175, 175,
    131, 131, 165, 165, 196, 196, 175, 175,
    165, 165, 196, 196, 220, 220, 196, 196,
    131, 131, 165, 165, 196, 196, 175, 175,
    196, 196, 220, 220, 262, 262, 220, 220,
    165, 165, 196, 196, 220, 220, 196, 196,
    131, 131, 165, 165, 196, 196, 175, 175,
    131, 131, 165, 165, 196, 196, 175, 175,
  ];

  get soundOn(): boolean { return this._soundOn; }
  set soundOn(val: boolean) { this._soundOn = val; }

  init(): void {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  private sfx(fn: () => void): void {
    if (this._soundOn && this.ctx) {
      try { fn(); } catch { /* ignore audio errors */ }
    }
  }

  private playNote(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.1, ramp?: number): void {
    this.sfx(() => {
      const ctx = this.ctx!;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      if (ramp) o.frequency.exponentialRampToValueAtTime(ramp, ctx.currentTime + dur);
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.start();
      o.stop(ctx.currentTime + dur);
    });
  }

  playFart(type: 'quick' | 'mega' | 'silent'): void {
    if (type === 'quick') this.playNote(80, 0.12, 'sawtooth', 0.2, 30);
    else if (type === 'mega') this.playNote(55, 0.5, 'sawtooth', 0.3, 15);
    else this.playNote(120, 0.2, 'sine', 0.08, 50);
  }

  playSnore(): void { this.playNote(50, 0.4, 'sawtooth', 0.04, 65); }
  playHit(): void { this.playNote(300, 0.08, 'square', 0.1, 80); }
  playPoison(): void { this.playNote(180, 0.2, 'sine', 0.06, 60); }
  playWakeUp(): void { this.playNote(250, 0.15, 'sawtooth', 0.1, 500); }

  playWaveComplete(): void {
    this.playNote(523, 0.1, 'square', 0.08);
    setTimeout(() => this.playNote(659, 0.1, 'square', 0.08), 100);
    setTimeout(() => this.playNote(784, 0.15, 'square', 0.08), 200);
  }

  playMenuNav(): void { this.playNote(880, 0.05, 'square', 0.06); }
  playMenuSelect(): void {
    this.playNote(600, 0.05, 'square', 0.06);
    setTimeout(() => this.playNote(900, 0.06, 'square', 0.06), 50);
  }

  playGameOver(): void {
    this.playNote(400, 0.15, 'square', 0.1, 300);
    setTimeout(() => this.playNote(300, 0.15, 'square', 0.1, 200), 150);
    setTimeout(() => this.playNote(200, 0.2, 'square', 0.1, 100), 300);
  }

  playTitleJingle(): void {
    this.playNote(523, 0.08, 'square', 0.06);
    setTimeout(() => this.playNote(659, 0.08, 'square', 0.06), 80);
    setTimeout(() => this.playNote(784, 0.08, 'square', 0.06), 160);
    setTimeout(() => this.playNote(1047, 0.15, 'square', 0.08), 240);
  }

  // --- Background Music ---

  startBGMusic(targetVol = 0.045): void {
    if (!this._soundOn || this.bgPlaying) return;
    this.init();
    this.bgPlaying = true;
    this.bgVolume = 0;
    this.bgTargetVol = targetVol;
    this.melodyIndex = 0;
    this.bassIndex = 0;
    this.nextNoteTime = this.ctx!.currentTime + 0.1;
    this.bassNextTime = this.ctx!.currentTime + 0.1;
  }

  stopBGMusic(): void {
    this.bgTargetVol = 0;
    this.bgPlaying = false;
  }

  setBGMusicTargetVol(vol: number): void {
    this.bgTargetVol = vol;
  }

  updateBGMusic(): void {
    if (!this.bgPlaying && this.bgVolume <= 0) return;
    if (!this.ctx || !this._soundOn) return;

    // Volume ramp
    if (this.bgVolume < this.bgTargetVol) {
      this.bgVolume = Math.min(this.bgTargetVol, this.bgVolume + 0.0003);
    } else if (this.bgVolume > this.bgTargetVol) {
      this.bgVolume = Math.max(this.bgTargetVol, this.bgVolume - 0.001);
    }
    if (this.bgVolume <= 0) return;

    const now = this.ctx.currentTime;
    const beatDur = 60 / this.tempo;

    // Melody
    while (this.nextNoteTime < now + 0.1) {
      const freq = this.melody[this.melodyIndex % this.melody.length];
      if (freq > 0 && this.bgVolume > 0.001) {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'square';
        o.connect(g);
        g.connect(this.ctx.destination);
        o.frequency.setValueAtTime(freq, this.nextNoteTime);
        g.gain.setValueAtTime(this.bgVolume, this.nextNoteTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.nextNoteTime + beatDur * 0.8);
        o.start(this.nextNoteTime);
        o.stop(this.nextNoteTime + beatDur * 0.9);
      }
      this.melodyIndex++;
      this.nextNoteTime += beatDur * 0.5;
    }

    // Bass
    while (this.bassNextTime < now + 0.1) {
      const freq = this.bassLine[this.bassIndex % this.bassLine.length];
      if (freq > 0 && this.bgVolume > 0.001) {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'triangle';
        o.connect(g);
        g.connect(this.ctx.destination);
        o.frequency.setValueAtTime(freq, this.bassNextTime);
        g.gain.setValueAtTime(this.bgVolume * 0.6, this.bassNextTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.bassNextTime + beatDur * 1.8);
        o.start(this.bassNextTime);
        o.stop(this.bassNextTime + beatDur * 1.9);
      }
      this.bassIndex++;
      this.bassNextTime += beatDur;
    }
  }

  destroy(): void {
    this.stopBGMusic();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
