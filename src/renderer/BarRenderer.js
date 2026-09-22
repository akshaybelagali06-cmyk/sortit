/**
 * Renders primary array bars from a step event.
 */

export default class BarRenderer {
  constructor(container) {
    this.container = container;
  }

  render(arraySnapshot, activeIndices = [], stateType = 'default') {
    if (!this.container) return;
    const maxVal = Math.max(...arraySnapshot, 100);
    this.container.innerHTML = '';
    const indexSet = new Set(activeIndices);

    arraySnapshot.forEach((val, idx) => {
      const heightPercent = Math.max(8, Math.min(100, (val / maxVal) * 100));
      const barWrapper = document.createElement('div');
      barWrapper.className = 'bar-wrapper';

      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${heightPercent}%`;
      bar.setAttribute('role', 'img');
      bar.setAttribute('aria-label', `Index ${idx}, value ${val}${indexSet.has(idx) ? `, ${stateType}` : ''}`);

      if (indexSet.has(idx)) {
        if (stateType === 'compare') bar.classList.add('state-compare');
        else if (stateType === 'swap' || stateType === 'overwrite') bar.classList.add('state-swap');
        else if (stateType === 'pivot') bar.classList.add('state-pivot');
        else if (stateType === 'markSorted') bar.classList.add('state-sorted');
      } else if (stateType === 'markSorted') {
        bar.classList.add('state-sorted');
      }

      if (arraySnapshot.length <= 45) {
        const label = document.createElement('span');
        label.className = 'bar-label';
        label.textContent = val;
        bar.appendChild(label);
      }

      barWrapper.appendChild(bar);
      this.container.appendChild(barWrapper);
    });
  }

  renderAux(auxContainer, auxLabel, auxItemsGrid, auxData) {
    if (!auxContainer) return;
    if (!auxData) {
      auxContainer.style.display = 'none';
      return;
    }
    auxContainer.style.display = 'flex';
    if (auxLabel) auxLabel.textContent = auxData.label;
    if (auxItemsGrid) {
      auxItemsGrid.innerHTML = (auxData.items || [])
        .map((item) => `<div class="aux-chip ${item.state || ''}">${item.value}</div>`)
        .join('');
    }
  }
}
