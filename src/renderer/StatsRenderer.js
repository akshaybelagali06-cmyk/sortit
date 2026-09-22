/**
 * Metrics / statistics dashboard renderer.
 */

export default class StatsRenderer {
  constructor(dom) {
    this.dom = dom || {};
  }

  render(metrics = {}) {
    if (this.dom.metricComparisons) {
      this.dom.metricComparisons.textContent = metrics.comparisons ?? 0;
    }
    if (this.dom.metricSwaps) {
      this.dom.metricSwaps.textContent = metrics.swaps ?? 0;
    }
    if (this.dom.metricAccesses) {
      this.dom.metricAccesses.textContent = metrics.accesses ?? 0;
    }
    if (this.dom.metricTime) {
      const t = Number(metrics.elapsedSeconds || 0);
      this.dom.metricTime.textContent = `${t.toFixed(2)}s`;
    }
  }

  renderTimeline(stepIndex = 0, totalSteps = 1) {
    if (this.dom.timelineText) {
      this.dom.timelineText.textContent = `Step ${stepIndex} / ${Math.max(totalSteps - 1, 0)}`;
    }
    if (this.dom.timelineFill) {
      const max = Math.max(1, totalSteps - 1);
      const pct = Math.min(100, Math.max(0, (stepIndex / max) * 100));
      this.dom.timelineFill.style.width = `${pct}%`;
      this.dom.timelineFill.setAttribute('aria-valuenow', String(stepIndex));
      this.dom.timelineFill.setAttribute('aria-valuemax', String(max));
    }
  }
}
