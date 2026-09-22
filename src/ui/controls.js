/**
 * Playback + control panel bindings.
 */

export function bindPlaybackControls(dom, player, handlers = {}) {
  if (dom.btnPlay) {
    dom.btnPlay.addEventListener('click', () => player.play());
  }
  if (dom.btnPause) {
    dom.btnPause.addEventListener('click', () => player.pause());
  }
  if (dom.btnStepForward) {
    dom.btnStepForward.addEventListener('click', () => player.stepForward());
  }
  if (dom.btnStepBack) {
    dom.btnStepBack.addEventListener('click', () => player.stepBackward());
  }
  if (dom.btnReset && handlers.onReset) {
    dom.btnReset.addEventListener('click', handlers.onReset);
  }
  if (dom.speedSlider) {
    dom.speedSlider.addEventListener('input', (e) => {
      const ms = Number(e.target.value);
      if (dom.speedVal) dom.speedVal.textContent = `${ms} ms`;
      player.delay = ms;
    });
  }
}

export function updatePlaybackButtons(dom, player) {
  if (!dom || !player) return;
  if (dom.btnPlay) dom.btnPlay.disabled = player.isPlaying || player.isFinished;
  if (dom.btnPause) dom.btnPause.disabled = !player.isPlaying;
  if (dom.btnStepForward) {
    dom.btnStepForward.disabled = player.isPlaying || player.isFinished;
  }
  if (dom.btnStepBack) {
    dom.btnStepBack.disabled = player.isPlaying || player.currentIndex <= 0;
  }
}

export function populateAlgorithmSelect(selectEl, registryEntries, groups) {
  if (!selectEl) return;
  selectEl.innerHTML = '';

  const byCategory = new Map();
  for (const entry of registryEntries) {
    const cat = entry.category || 'Other';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push(entry);
  }

  const preferredOrder = groups || [
    'Simple O(N²)',
    'Efficient O(N log N)',
    'Non-Comparison',
    'Non-Comparison / Sublist',
    'Exotic / Esoteric',
  ];

  const orderedCats = [
    ...preferredOrder.filter((c) => byCategory.has(c)),
    ...[...byCategory.keys()].filter((c) => !preferredOrder.includes(c)),
  ];

  for (const cat of orderedCats) {
    const group = document.createElement('optgroup');
    group.label = cat;
    for (const entry of byCategory.get(cat)) {
      const opt = document.createElement('option');
      opt.value = entry.id;
      opt.textContent = entry.name;
      group.appendChild(opt);
    }
    selectEl.appendChild(group);
  }
}
