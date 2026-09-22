/**
 * SortIt V2 — Algorithm Observatory entry point.
 */
import { createComparisonLab } from './ui/comparisonLab.js';
import {
  ALGORITHM_METADATA,
  getAlgorithm,
  listAlgorithms,
  runSelfTests,
} from './data/algorithmRegistry.js';
import AudioSynthesizer from './engine/audio.js';
import StepPlayer from './engine/StepPlayer.js';
import BarRenderer from './renderer/BarRenderer.js';
import ExplanationRenderer from './renderer/ExplanationRenderer.js';
import PseudocodeRenderer from './renderer/PseudocodeRenderer.js';
import StatsRenderer from './renderer/StatsRenderer.js';
import {
  bindPlaybackControls,
  populateAlgorithmSelect,
  updatePlaybackButtons,
} from './ui/controls.js';
import {
  bindInputControls,
  buildArrayFromControls,
  parseAndValidateCustom,
  populatePresetSelect,
  showInputMessage,
} from './ui/input.js';
import { bindKeyboardShortcuts } from './ui/keyboard.js';

class SortingVisualizerApp {
  constructor() {
    this.audioSynth = new AudioSynthesizer();
    this.player = new StepPlayer(this.audioSynth);
    this.currentArray = [];
    this.initDOMReferences();
    this.initRenderers();
    this.bootstrapSelectors();
    this.bindEvents();
    this.runStartupSelfTest();
    this.generateNewArray();
    this.initComparisonLab();
  }

  initDOMReferences() {
    this.dom = {
      algoSelect: document.getElementById('algoSelect'),
      arrayInput: document.getElementById('arrayInput'),
      inputMessage: document.getElementById('inputMessage'),
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
      operationType: document.getElementById('operationType'),
      whyText: document.getElementById('whyText'),
      explanationLive: document.getElementById('explanationLive'),

      metricComparisons: document.getElementById('metricComparisons'),
      metricSwaps: document.getElementById('metricSwaps'),
      metricAccesses: document.getElementById('metricAccesses'),
      metricTime: document.getElementById('metricTime'),
      timelineText: document.getElementById('timelineText'),
      timelineFill: document.getElementById('timelineFill'),

      infoAlgoTitle: document.getElementById('infoAlgoTitle'),
      infoCategoryBadge: document.getElementById('infoCategoryBadge'),
      infoDescription: document.getElementById('infoDescription'),
      infoStable: document.getElementById('infoStable'),
      infoInPlace: document.getElementById('infoInPlace'),
      infoNote: document.getElementById('infoNote'),
      compBest: document.getElementById('compBest'),
      compAvg: document.getElementById('compAvg'),
      compWorst: document.getElementById('compWorst'),
      compSpace: document.getElementById('compSpace'),
      pseudocodeContainer: document.getElementById('pseudocodeContainer'),

      selfTestBadge: document.getElementById('selfTestBadge'),
      selfTestText: document.getElementById('selfTestText'),
      comparisonLabContainer: document.getElementById('comparison-lab-container'),
    };
  }

  initRenderers() {
    this.barRenderer = new BarRenderer(this.dom.arrayContainer);
    this.pseudoRenderer = new PseudocodeRenderer(this.dom.pseudocodeContainer);
    this.statsRenderer = new StatsRenderer(this.dom);
    this.explanationRenderer = new ExplanationRenderer(this.dom);
  }
  initComparisonLab() {
    if (!this.dom.comparisonLabContainer) {
      console.warn('Comparison Lab container not found.');
      return;
    }

    createComparisonLab(
      this.dom.comparisonLabContainer,
      () => [...this.currentArray]
    );
  }
  bootstrapSelectors() {
    populateAlgorithmSelect(this.dom.algoSelect, listAlgorithms());
    populatePresetSelect(this.dom.presetSelect);
    if (this.dom.algoSelect) this.dom.algoSelect.value = 'bubble';
  }

  bindEvents() {
    this.player.onStateChange = () => this.updatePlaybackUI();
    this.player.onStepRender = (event, metrics) => this.renderStep(event, metrics);

    this.dom.algoSelect?.addEventListener('change', () => {
      this.updateAlgorithmMetadata();
      this.resetPlayerWithCurrentArray();
    });

    bindInputControls(this.dom, {
      onGenerate: () => this.generateNewArray(),
      onCustomInput: () => this.parseCustomInput(),
    });

    bindPlaybackControls(this.dom, this.player, {
      onReset: () => this.resetPlayerWithCurrentArray(),
    });

    this.dom.soundToggle?.addEventListener('change', (e) => {
      this.audioSynth.enabled = e.target.checked;
    });
    this.dom.volumeSlider?.addEventListener('input', (e) => {
      this.audioSynth.volume = Number(e.target.value);
    });

    bindKeyboardShortcuts(this.player, {
      onReset: () => this.resetPlayerWithCurrentArray(),
    });
  }

  runStartupSelfTest() {
    const res = runSelfTests();
    if (!this.dom.selfTestBadge || !this.dom.selfTestText) return;
    if (res.passed === res.total) {
      this.dom.selfTestBadge.style.borderColor = '#10b981';
      this.dom.selfTestText.textContent = `Self-Test: ${res.passed}/${res.total} Passed ✓`;
    } else {
      this.dom.selfTestBadge.style.borderColor = '#ef4444';
      this.dom.selfTestText.textContent = `Self-Test: ${res.passed}/${res.total} Passed`;
    }
  }

  generateNewArray() {
    const algoKey = this.dom.algoSelect?.value || 'bubble';
    const result = buildArrayFromControls(this.dom, algoKey);
    if (!result.ok) {
      showInputMessage(this.dom.inputMessage, result.error, true);
      return;
    }
    this.currentArray = result.values;
    if (this.dom.arrayInput) this.dom.arrayInput.value = result.values.join(', ');
    showInputMessage(this.dom.inputMessage, result.warning || '');
    this.updateAlgorithmMetadata();
    this.resetPlayerWithCurrentArray();
  }

  parseCustomInput() {
    const algoKey = this.dom.algoSelect?.value || 'bubble';
    const result = parseAndValidateCustom(this.dom, algoKey);
    if (!result.ok) {
      showInputMessage(this.dom.inputMessage, result.error, true);
      return;
    }
    this.currentArray = result.values;
    if (this.dom.sizeSlider) {
      this.dom.sizeSlider.value = String(Math.min(80, result.values.length));
    }
    if (this.dom.sizeVal) this.dom.sizeVal.textContent = String(result.values.length);
    showInputMessage(this.dom.inputMessage, result.warning || 'Custom array loaded.');
    this.resetPlayerWithCurrentArray();
  }

  updateAlgorithmMetadata() {
    const key = this.dom.algoSelect?.value || 'bubble';
    const meta = getAlgorithm(key) || ALGORITHM_METADATA[key] || {};

    if (this.dom.infoAlgoTitle) this.dom.infoAlgoTitle.textContent = meta.name || key;
    if (this.dom.infoCategoryBadge) {
      this.dom.infoCategoryBadge.textContent = meta.category || 'Sorting Algorithm';
    }
    if (this.dom.infoDescription) {
      this.dom.infoDescription.textContent = meta.description || '';
    }
    if (this.dom.compBest) this.dom.compBest.textContent = meta.timeBest || '-';
    if (this.dom.compAvg) this.dom.compAvg.textContent = meta.timeAvg || '-';
    if (this.dom.compWorst) this.dom.compWorst.textContent = meta.timeWorst || '-';
    if (this.dom.compSpace) this.dom.compSpace.textContent = meta.space || '-';
    if (this.dom.infoStable) {
      this.dom.infoStable.textContent = meta.stable ? 'Stable' : 'Unstable';
    }
    if (this.dom.infoInPlace) {
      this.dom.infoInPlace.textContent = meta.inPlace ? 'In-place' : 'Not in-place';
    }
    if (this.dom.infoNote) {
      this.dom.infoNote.textContent = meta.note || '';
      this.dom.infoNote.style.display = meta.note ? 'block' : 'none';
    }

    this.pseudoRenderer.render(meta.pseudocode || [], -1);
  }

  resetPlayerWithCurrentArray() {
    const key = this.dom.algoSelect?.value || 'bubble';
    const entry = getAlgorithm(key);
    if (entry && this.currentArray.length > (entry.maxSize || 200)) {
      showInputMessage(
        this.dom.inputMessage,
        `${entry.name} is limited to ${entry.maxSize} elements.`,
        true
      );
      return;
    }
    this.player.loadAlgorithm(key, this.currentArray);
  }

  updatePlaybackUI() {
    updatePlaybackButtons(this.dom, this.player);
  }

  renderStep(event, metrics) {
    this.barRenderer.render(event.array, event.indices, event.type);
    this.barRenderer.renderAux(
      this.dom.auxContainer,
      this.dom.auxLabel,
      this.dom.auxItemsGrid,
      event.auxData
    );
    this.explanationRenderer.render(event);

    const key = this.dom.algoSelect?.value || 'bubble';
    const meta = getAlgorithm(key) || {};
    this.pseudoRenderer.render(meta.pseudocode || [], event.line);

    this.statsRenderer.render(metrics);
    this.statsRenderer.renderTimeline(metrics.stepIndex, metrics.totalSteps);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new SortingVisualizerApp();
});

export { SortingVisualizerApp };
