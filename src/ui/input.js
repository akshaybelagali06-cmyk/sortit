/**
 * Array input, presets, and size controls.
 */

import { generatePreset, PRESET_IDS, PRESET_LABELS } from '../data/presets.js';
import { getAlgorithm } from '../data/algorithmRegistry.js';
import { validateArrayInput, validateForAlgorithm } from '../utils/validation.js';

export function populatePresetSelect(selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = '';
  for (const id of PRESET_IDS) {
    if (id === 'custom') continue;
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = PRESET_LABELS[id] || id;
    selectEl.appendChild(opt);
  }
}

export function bindInputControls(dom, handlers) {
  if (dom.btnGenerate) {
    dom.btnGenerate.addEventListener('click', () => handlers.onGenerate?.());
  }
  if (dom.presetSelect) {
    dom.presetSelect.addEventListener('change', () => handlers.onGenerate?.());
  }
  if (dom.arrayInput) {
    dom.arrayInput.addEventListener('change', () => handlers.onCustomInput?.());
  }
  if (dom.sizeSlider) {
    dom.sizeSlider.addEventListener('input', (e) => {
      if (dom.sizeVal) dom.sizeVal.textContent = e.target.value;
      handlers.onGenerate?.();
    });
  }
}

export function buildArrayFromControls(dom, algoKey) {
  const requested = Number(dom.sizeSlider?.value || 30);
  const entry = getAlgorithm(algoKey);
  const maxSize = entry?.maxSize ?? 200;
  const size = Math.min(requested, maxSize);
  if (dom.sizeSlider && size !== requested) {
    dom.sizeSlider.value = String(size);
    if (dom.sizeVal) dom.sizeVal.textContent = String(size);
  }
  const pattern = dom.presetSelect?.value || 'random';
  const arr = generatePreset(pattern, size);
  return validateForAlgorithm(arr, algoKey);
}

export function parseAndValidateCustom(dom, algoKey) {
  return validateArrayInput(dom.arrayInput?.value || '', algoKey);
}

export function showInputMessage(el, message, isError = false) {
  if (!el) return;
  el.textContent = message || '';
  el.classList.toggle('is-error', Boolean(isError && message));
  el.classList.toggle('is-warning', Boolean(!isError && message));
}
