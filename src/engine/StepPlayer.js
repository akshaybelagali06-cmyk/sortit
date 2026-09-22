/**
 * StepPlayer — authoritative playback engine.
 * Owns generator lifecycle, history, speed, progress, reset, and metrics.
 * Algorithms must not control timers or DOM.
 */

import { getAlgorithm } from '../data/algorithmRegistry.js';
import { EventType } from './events.js';
import { accumulateEvent, recalculateStats } from './statistics.js';

export default class StepPlayer {
  constructor(audioSynth = null) {
    this.audioSynth = audioSynth;
    this.generator = null;
    this.algoKey = null;
    this.initialArray = [];
    this.history = [];
    this.currentIndex = -1;
    this.isFinished = false;
    this.isPlaying = false;
    this.timer = null;
    this.delay = 50;

    this.comparisons = 0;
    this.swaps = 0;
    this.accesses = 0;
    this.startTime = null;
    this.elapsedSeconds = 0;
    this.clockInterval = null;

    this.onStepRender = null;
    this.onStateChange = null;
  }

  loadAlgorithm(algoKey, arrayData) {
    this.reset();
    this.algoKey = algoKey;
    this.initialArray = [...arrayData];
    const entry = getAlgorithm(algoKey);
    if (!entry?.generator) {
      throw new Error(`Algorithm '${algoKey}' not found.`);
    }
    this.generator = entry.generator([...arrayData]);

    const initialEvent = {
      type: EventType.INITIAL,
      indices: [],
      array: [...arrayData],
      line: 1,
      description: `Loaded initial array of size ${arrayData.length}`,
      why: 'This is the starting state before any sorting operations run.',
    };
    this.history = [initialEvent];
    this.currentIndex = 0;
    this.renderCurrentStep();
  }

  reset() {
    this.pause();
    this.generator = null;
    this.history = [];
    this.currentIndex = -1;
    this.isFinished = false;
    this.comparisons = 0;
    this.swaps = 0;
    this.accesses = 0;
    this.elapsedSeconds = 0;
    this.stopClock();
    if (this.onStateChange) this.onStateChange();
  }

  play() {
    if (this.isPlaying || this.isFinished) return;
    this.isPlaying = true;
    this.startClock();
    if (this.onStateChange) this.onStateChange();

    const loop = () => {
      if (!this.isPlaying) return;
      const hasNext = this.stepForward();
      if (hasNext) {
        this.timer = setTimeout(loop, this.delay);
      } else {
        this.pause();
        this.isFinished = true;
        this.triggerFinishAnimation();
        if (this.onStateChange) this.onStateChange();
      }
    };
    loop();
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.stopClock();
    if (this.onStateChange) this.onStateChange();
  }

  stepForward() {
    if (this.currentIndex + 1 < this.history.length) {
      this.currentIndex += 1;
      this.renderCurrentStep();
      return true;
    }

    if (!this.generator) return false;

    const res = this.generator.next();
    if (res.done) {
      this.isFinished = true;
      return false;
    }

    const event = res.value;
    if (!event.why) {
      event.why = explainEvent(event);
    }
    this.history.push(event);
    this.currentIndex += 1;
    this.accumulateMetrics(event);
    this.renderCurrentStep();
    return true;
  }

  stepBackward() {
    if (this.currentIndex <= 0) return false;
    this.pause();
    this.currentIndex -= 1;
    this.recalculateMetricsUpTo(this.currentIndex);
    this.renderCurrentStep();
    return true;
  }

  accumulateMetrics(event) {
    const before = {
      comparisons: this.comparisons,
      swaps: this.swaps,
      accesses: this.accesses,
    };
    accumulateEvent(this, event);
    this.playAudioForEvent(event, before);
  }

  recalculateMetricsUpTo(targetIdx) {
    const stats = recalculateStats(this.history, targetIdx);
    this.comparisons = stats.comparisons;
    this.swaps = stats.swaps;
    this.accesses = stats.accesses;
  }

  playAudioForEvent(event) {
    if (!this.audioSynth) return;
    if (event.type === EventType.COMPARE && event.indices?.length > 0) {
      const val = event.array[event.indices[0]] || 50;
      this.audioSynth.playTone(val, Math.max(...event.array), 'sine', 0.04);
    } else if (
      (event.type === EventType.SWAP || event.type === EventType.OVERWRITE) &&
      event.indices?.length > 0
    ) {
      const val = event.array[event.indices[0]] || 50;
      this.audioSynth.playTone(val, Math.max(...event.array), 'triangle', 0.06);
    }
  }

  renderCurrentStep() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      const event = this.history[this.currentIndex];
      if (this.onStepRender) {
        this.onStepRender(event, {
          comparisons: this.comparisons,
          swaps: this.swaps,
          accesses: this.accesses,
          elapsedSeconds: this.elapsedSeconds,
          stepIndex: this.currentIndex,
          totalSteps: this.history.length,
          isFinished: this.isFinished,
          isPlaying: this.isPlaying,
        });
      }
    }
  }

  triggerFinishAnimation() {
    if (this.audioSynth && this.history.length > 0) {
      const lastSnapshot = this.history[this.history.length - 1].array;
      this.audioSynth.playCompletionCascade(lastSnapshot);
    }
  }

  startClock() {
    if (!this.clockInterval) {
      this.startTime = Date.now() - this.elapsedSeconds * 1000;
      this.clockInterval = setInterval(() => {
        this.elapsedSeconds = (Date.now() - this.startTime) / 1000;
        if (this.onStepRender) this.renderCurrentStep();
      }, 100);
    }
  }

  stopClock() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  getProgress() {
    const total = Math.max(1, this.history.length);
    return {
      stepIndex: this.currentIndex,
      totalSteps: this.history.length,
      ratio: this.currentIndex / total,
    };
  }
}

/**
 * Deterministic local explanation for an operation event.
 */
export function explainEvent(event) {
  const arr = event.array || [];
  const idx = event.indices || [];
  switch (event.type) {
    case EventType.COMPARE: {
      if (idx.length >= 2) {
        return `Comparing arr[${idx[0]}] = ${arr[idx[0]]} with arr[${idx[1]}] = ${arr[idx[1]]} to decide order.`;
      }
      return 'Comparing elements to determine their relative order.';
    }
    case EventType.SWAP: {
      if (idx.length >= 2) {
        return `${arr[idx[1]]} and ${arr[idx[0]]} were out of order, so they are swapped.`;
      }
      return 'Elements are swapped to move closer to sorted order.';
    }
    case EventType.OVERWRITE: {
      if (idx.length >= 1) {
        return `Writing ${arr[idx[0]]} into position ${idx[0]}.`;
      }
      return 'An array slot is overwritten with a new value.';
    }
    case EventType.PIVOT: {
      if (idx.length >= 1) {
        return `${arr[idx[0]]} is selected as the pivot for this partition.`;
      }
      return 'A pivot value is chosen for partitioning.';
    }
    case EventType.MARK_SORTED:
      return 'This element has reached its final sorted position.';
    case EventType.AUX:
      return 'Auxiliary structures (counts, buckets, or bins) are being updated.';
    case EventType.LINE:
      return event.description || 'Advancing through the algorithm control flow.';
    case EventType.INITIAL:
      return 'This is the starting state before any sorting operations run.';
    default:
      return event.description || 'Executing the next algorithm step.';
  }
}
