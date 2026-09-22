/**
 * Pseudocode highlighting renderer.
 */

export default class PseudocodeRenderer {
  constructor(container) {
    this.container = container;
  }

  escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  render(lines = [], activeLineNum = -1) {
    if (!this.container) return;
    this.container.innerHTML = lines
      .map((lineText, idx) => {
        const lineNum = idx + 1;
        const isActive = lineNum === activeLineNum;
        return `
        <div class="code-line ${isActive ? 'active' : ''}" ${isActive ? 'aria-current="step"' : ''}>
          <span class="line-num">${lineNum}</span>
          <span>${this.escapeHTML(lineText)}</span>
        </div>`;
      })
      .join('');
  }
}
