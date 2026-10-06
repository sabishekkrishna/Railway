/**
 * Indian Railways Audio Synthesis Utilities
 * Uses standard Web Audio API for zero-dependency, ultra-reliable audio cues.
 */

class RailwayAudioService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
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

  /**
   * Iconic Indian Railways 4-tone station chime (G4 -> B4 -> D5 -> G5)
   */
  playStationChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { freq: 392.0, time: 0.0, dur: 0.35 }, // G4
        { freq: 493.88, time: 0.3, dur: 0.35 }, // B4
        { freq: 587.33, time: 0.6, dur: 0.4 }, // D5
        { freq: 783.99, time: 0.95, dur: 0.7 }, // G5
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.25, now + time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Railway OCC Control Room Conflict Warning Buzz
   */
  playConflictWarning() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.setValueAtTime(450, now + 0.15);
      osc.frequency.setValueAtTime(650, now + 0.3);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * High Priority Emergency Alarm
   */
  playEmergencySiren() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      for (let i = 0; i < 2; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const start = now + i * 0.4;
        osc.frequency.setValueAtTime(880, start);
        osc.frequency.linearRampToValueAtTime(440, start + 0.35);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      }
    } catch {
      // Audio policy
    }
  }
}

export const railwayAudio = new RailwayAudioService();
