/**
 * app.js - UI Controller, Audio Synthesizer, and StepPlayer Engine
 * 
 * Handles playback of ES6 pure generator sorting events, history navigation (forward/backward step),
 * DOM bar rendering, pseudocode highlighting, real-time statistics tracking, and Web Audio API tone output.
 */

import { ALGORITHMS, ALGORITHM_METADATA, runSelfTests } from './algorithms.js';

/* ==========================================================================
   WEB AUDIO API SYNTHESIZER
   ========================================================================== */
class AudioSynthesizer {
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

      // Pitch mapped linearly from 180Hz to 900Hz
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
    } catch (e) {
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

/* ==========================================================================
   STEP PLAYER ENGINE (Decoupled Generator Playback)
   ========================================================================== */
class StepPlayer {
  constructor(audioSynth) {
    this.audioSynth = audioSynth;
    this.generator = null;
    this.initialArray = [];
    this.history = [];           // Stack of all generated event steps
    this.currentIndex = -1;      // Current step position in history
    this.isFinished = false;
    this.isPlaying = false;
    this.timer = null;
    this.delay = 50;             // ms

    // Real-Time Metrics
    this.comparisons = 0;
    this.swaps = 0;
    this.accesses = 0;
    this.startTime = null;
    this.elapsedSeconds = 0;
    this.clockInterval = null;

    // Callbacks for UI updates
    this.onStepRender = null;
    this.onStateChange = null;
  }

  loadAlgorithm(algoKey, arrayData) {
    this.reset();
    this.initialArray = [...arrayData];
    const genFn = ALGORITHMS[algoKey];
    if (!genFn) throw new Error(`Algorithm '${algoKey}' not found.`);
    this.generator = genFn([...arrayData]);

    // Initial state event (Step 0)
    const initialEvent = {
      type: 'initial',
      indices: [],
      array: [...arrayData],
      line: 1,
      description: `Loaded initial array of size ${arrayData.length}`
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
      // Step into pre-computed history (e.g. after stepping back)
      this.currentIndex++;
      this.renderCurrentStep();
      return true;
    }

    if (!this.generator) return false;

    // Pull next event step from generator
    const res = this.generator.next();
    if (res.done) {
      this.isFinished = true;
      return false;
    }

    const event = res.value;
    this.history.push(event);
    this.currentIndex++;
    this.accumulateMetrics(event);
    this.renderCurrentStep();
    return true;
  }

  stepBackward() {
    if (this.currentIndex <= 0) return false;
    this.pause();
    this.currentIndex--;
    this.recalculateMetricsUpTo(this.currentIndex);
    this.renderCurrentStep();
    return true;
  }

  accumulateMetrics(event) {
    if (event.type === 'compare') {
      this.comparisons++;
      this.accesses += event.indices.length;
      if (event.indices.length > 0) {
        const val = event.array[event.indices[0]] || 50;
        this.audioSynth.playTone(val, Math.max(...event.array), 'sine', 0.04);
      }
    } else if (event.type === 'swap' || event.type === 'overwrite') {
      this.swaps++;
      this.accesses += event.indices.length;
      if (event.indices.length > 0) {
        const val = event.array[event.indices[0]] || 50;
        this.audioSynth.playTone(val, Math.max(...event.array), 'triangle', 0.06);
      }
    }
  }

  recalculateMetricsUpTo(targetIdx) {
    this.comparisons = 0;
    this.swaps = 0;
    this.accesses = 0;
    for (let i = 1; i <= targetIdx; i++) {
      const ev = this.history[i];
      if (ev.type === 'compare') {
        this.comparisons++;
        this.accesses += ev.indices.length;
      } else if (ev.type === 'swap' || ev.type === 'overwrite') {
        this.swaps++;
        this.accesses += ev.indices.length;
      }
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
          totalSteps: this.history.length
        });
      }
    }
  }

  triggerFinishAnimation() {
    if (this.history.length > 0) {
      const lastSnapshot = this.history[this.history.length - 1].array;
      this.audioSynth.playCompletionCascade(lastSnapshot);
    }
  }

  startClock() {
    if (!this.clockInterval) {
      this.startTime = Date.now() - (this.elapsedSeconds * 1000);
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
}

/* ==========================================================================
   UI APP CONTROLLER & DOM MANAGER
   ========================================================================== */
class SortingVisualizerApp {
  constructor() {
    this.audioSynth = new AudioSynthesizer();
    this.player = new StepPlayer(this.audioSynth);
    this.currentArray = [];
    this.initDOMReferences();
    this.bindEvents();
    this.runStartupSelfTest();
    this.generateNewArray();
  }

  initDOMReferences() {
    this.dom = {
      algoSelect: document.getElementById('algoSelect'),
      arrayInput: document.getElementById('arrayInput'),
      presetSelect: document.getElementById('presetSelect'),
      btnGenerate: document.getElementById('btnGenerate'),
      sizeSlider: document.getElementById('sizeSlider'),
      sizeVal: document.getElementById('sizeVal'),
      speedSlider: document.getElementById('speedSlider'),
      speedVal: document.getElementById('speedVal'),
      soundToggle: document.getElementById('soundToggle'),
      volumeSlider: document.getElementById('volumeSlider'),
      btnPlay: document.getElementById('btnPlay'),
      btnPause: document.getElementById('btnPause'),
      btnStepBack: document.getElementById('btnStepBack'),
      btnStepForward: document.getElementById('btnStepForward'),
      btnReset: document.getElementById('btnReset'),
      
      arrayContainer: document.getElementById('arrayContainer'),
      auxContainer: document.getElementById('auxContainer'),
      auxLabel: document.getElementById('auxLabel'),
      auxItemsGrid: document.getElementById('auxItemsGrid'),
      narrationText: document.getElementById('narrationText'),
      
      metricComparisons: document.getElementById('metricComparisons'),
      metricSwaps: document.getElementById('metricSwaps'),
      metricAccesses: document.getElementById('metricAccesses'),
      metricTime: document.getElementById('metricTime'),
      
      infoAlgoTitle: document.getElementById('infoAlgoTitle'),
      infoCategoryBadge: document.getElementById('infoCategoryBadge'),
      infoDescription: document.getElementById('infoDescription'),
      compBest: document.getElementById('compBest'),
      compAvg: document.getElementById('compAvg'),
      compWorst: document.getElementById('compWorst'),
      compSpace: document.getElementById('compSpace'),
      pseudocodeContainer: document.getElementById('pseudocodeContainer'),
      
      selfTestBadge: document.getElementById('selfTestBadge'),
      selfTestText: document.getElementById('selfTestText')
    };
  }

  bindEvents() {
    // Player State Sync Callback
    this.player.onStateChange = () => this.updatePlaybackUI();
    this.player.onStepRender = (event, metrics) => this.renderStep(event, metrics);

    // Algorithm selection
    this.dom.algoSelect.addEventListener('change', () => {
      this.updateAlgorithmMetadata();
      this.resetPlayerWithCurrentArray();
    });

    // Array Generation
    this.dom.btnGenerate.addEventListener('click', () => this.generateNewArray());
    this.dom.presetSelect.addEventListener('change', () => this.generateNewArray());

    // Custom Array Input
    this.dom.arrayInput.addEventListener('change', () => this.parseCustomInput());

    // Sliders
    this.dom.sizeSlider.addEventListener('input', (e) => {
      this.dom.sizeVal.textContent = e.target.value;
      this.generateNewArray();
    });

    this.dom.speedSlider.addEventListener('input', (e) => {
      const ms = Number(e.target.value);
      this.dom.speedVal.textContent = `${ms} ms`;
      this.player.delay = ms;
    });

    // Audio Controls
    this.dom.soundToggle.addEventListener('change', (e) => {
      this.audioSynth.enabled = e.target.checked;
    });
    this.dom.volumeSlider.addEventListener('input', (e) => {
      this.audioSynth.volume = Number(e.target.value);
    });

    // Playback Buttons
    this.dom.btnPlay.addEventListener('click', () => this.player.play());
    this.dom.btnPause.addEventListener('click', () => this.player.pause());
    this.dom.btnStepForward.addEventListener('click', () => this.player.stepForward());
    this.dom.btnStepBack.addEventListener('click', () => this.player.stepBackward());
    this.dom.btnReset.addEventListener('click', () => this.resetPlayerWithCurrentArray());

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.player.isPlaying) this.player.pause();
        else this.player.play();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.player.stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.player.stepBackward();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        this.resetPlayerWithCurrentArray();
      }
    });
  }

  runStartupSelfTest() {
    const res = runSelfTests();
    if (res.passed === res.total) {
      this.dom.selfTestBadge.style.borderColor = '#10b981';
      this.dom.selfTestText.textContent = `Self-Test: ${res.passed}/${res.total} Passed ✓`;
    } else {
      this.dom.selfTestBadge.style.borderColor = '#ef4444';
      this.dom.selfTestText.textContent = `Self-Test: ${res.passed}/${res.total} Passed`;
    }
  }

  generateNewArray() {
    const size = Number(this.dom.sizeSlider.value);
    const pattern = this.dom.presetSelect.value;
    let arr = [];

    if (pattern === 'random') {
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 90) + 10);
      }
    } else if (pattern === 'nearlySorted') {
      for (let i = 1; i <= size; i++) arr.push(i * 3 + 5);
      // Swap ~10% of elements randomly
      for (let k = 0; k < Math.floor(size / 5); k++) {
        const i1 = Math.floor(Math.random() * size);
        const i2 = Math.floor(Math.random() * size);
        [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
      }
    } else if (pattern === 'reversed') {
      for (let i = size; i >= 1; i--) arr.push(i * 3 + 5);
    } else if (pattern === 'fewUnique') {
      const uniques = [15, 35, 60, 85];
      for (let i = 0; i < size; i++) {
        arr.push(uniques[Math.floor(Math.random() * uniques.length)]);
      }
    }

    this.currentArray = arr;
    this.dom.arrayInput.value = arr.join(', ');
    this.updateAlgorithmMetadata();
    this.resetPlayerWithCurrentArray();
  }

  parseCustomInput() {
    const val = this.dom.arrayInput.value;
    const parsed = val
      .split(/[\s,]+/)
      .map(v => parseInt(v.trim(), 10))
      .filter(v => !isNaN(v) && v > 0);

    if (parsed.length >= 3) {
      this.currentArray = parsed;
      this.dom.sizeSlider.value = Math.min(80, parsed.length);
      this.dom.sizeVal.textContent = parsed.length;
      this.resetPlayerWithCurrentArray();
    }
  }

  updateAlgorithmMetadata() {
    const key = this.dom.algoSelect.value;
    const meta = ALGORITHM_METADATA[key] || {};

    this.dom.infoAlgoTitle.textContent = meta.name || key;
    this.dom.infoCategoryBadge.textContent = meta.category || "Sorting Algorithm";
    this.dom.infoDescription.textContent = meta.description || "";
    this.dom.compBest.textContent = meta.timeBest || "-";
    this.dom.compAvg.textContent = meta.timeAvg || "-";
    this.dom.compWorst.textContent = meta.timeWorst || "-";
    this.dom.compSpace.textContent = meta.space || "-";

    this.renderPseudocode(meta.pseudocode || [], -1);
  }

  resetPlayerWithCurrentArray() {
    const key = this.dom.algoSelect.value;
    this.player.loadAlgorithm(key, this.currentArray);
  }

  updatePlaybackUI() {
    this.dom.btnPlay.disabled = this.player.isPlaying || this.player.isFinished;
    this.dom.btnPause.disabled = !this.player.isPlaying;
    this.dom.btnStepForward.disabled = this.player.isPlaying || this.player.isFinished;
    this.dom.btnStepBack.disabled = this.player.isPlaying || this.player.currentIndex <= 0;
  }

  renderStep(event, metrics) {
    // 1. Render Flex Bars
    this.renderBars(event.array, event.indices, event.type);

    // 2. Render Auxiliary Bins (if present)
    if (event.auxData) {
      this.dom.auxContainer.style.display = 'flex';
      this.dom.auxLabel.textContent = event.auxData.label;
      this.dom.auxItemsGrid.innerHTML = event.auxData.items.map(item => `
        <div class="aux-chip ${item.state || ''}">${item.value}</div>
      `).join('');
    } else {
      this.dom.auxContainer.style.display = 'none';
    }

    // 3. Narration Text
    this.dom.narrationText.textContent = event.description || "Executing algorithm step...";

    // 4. Highlight Pseudocode Line
    const key = this.dom.algoSelect.value;
    const meta = ALGORITHM_METADATA[key] || {};
    this.renderPseudocode(meta.pseudocode || [], event.line);

    // 5. Update Metrics Dashboard
    this.dom.metricComparisons.textContent = metrics.comparisons;
    this.dom.metricSwaps.textContent = metrics.swaps;
    this.dom.metricAccesses.textContent = metrics.accesses;
    this.dom.metricTime.textContent = `${metrics.elapsedSeconds.toFixed(2)}s`;
  }

  renderBars(arraySnapshot, activeIndices = [], stateType = 'default') {
    const maxVal = Math.max(...arraySnapshot, 100);
    const container = this.dom.arrayContainer;
    container.innerHTML = '';

    const indexSet = new Set(activeIndices);

    arraySnapshot.forEach((val, idx) => {
      const heightPercent = Math.max(8, Math.min(100, (val / maxVal) * 100));

      const barWrapper = document.createElement('div');
      barWrapper.className = 'bar-wrapper';

      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${heightPercent}%`;

      if (indexSet.has(idx)) {
        if (stateType === 'compare') bar.classList.add('state-compare');
        else if (stateType === 'swap') bar.classList.add('state-swap');
        else if (stateType === 'pivot') bar.classList.add('state-pivot');
        else if (stateType === 'overwrite') bar.classList.add('state-swap');
        else if (stateType === 'markSorted') bar.classList.add('state-sorted');
      } else if (stateType === 'markSorted') {
        bar.classList.add('state-sorted');
      }

      // Show bar numeric label inside/below bar depending on array size
      if (arraySnapshot.length <= 45) {
        const label = document.createElement('span');
        label.className = 'bar-label';
        label.textContent = val;
        bar.appendChild(label);
      }

      barWrapper.appendChild(bar);
      container.appendChild(barWrapper);
    });
  }

  renderPseudocode(lines, activeLineNum) {
    const container = this.dom.pseudocodeContainer;
    container.innerHTML = lines.map((lineText, idx) => {
      const lineNum = idx + 1;
      const isActive = lineNum === activeLineNum;
      return `
        <div class="code-line ${isActive ? 'active' : ''}">
          <span class="line-num">${lineNum}</span>
          <span>${this.escapeHTML(lineText)}</span>
        </div>
      `;
    }).join('');
  }

  escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Instantiate App on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new SortingVisualizerApp();
});
