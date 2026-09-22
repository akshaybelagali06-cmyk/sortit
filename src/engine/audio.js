/**
 * Web Audio synthesizer for operation feedback.
 * Kept out of algorithm generators.
 */

export default class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.2;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(val, maxVal = 100, type = 'sine', duration = 0.05) {
    if (!this.enabled || !this.volume) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const minFreq = 180;
      const maxFreq = 950;
      const freq = minFreq + (Math.max(0, val) / Math.max(1, maxVal)) * (maxFreq - minFreq);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (_e) {
      // Audio context safety catch
    }
  }

  playCompletionCascade(arraySnapshot) {
    if (!this.enabled || !this.volume) return;
    this.init();
    if (!this.ctx) return;

    const maxVal = Math.max(...arraySnapshot);
    arraySnapshot.forEach((val, idx) => {
      setTimeout(() => {
        this.playTone(val, maxVal, 'sine', 0.08);
      }, idx * 25);
    });
  }
}
