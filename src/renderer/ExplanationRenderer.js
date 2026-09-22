/**
 * Current-operation + Why explanation renderer.
 */

import { explainEvent } from '../engine/StepPlayer.js';

export default class ExplanationRenderer {
  constructor(dom) {
    this.dom = dom || {};
  }

  render(event) {
    if (!event) return;
    const operation = event.description || 'Waiting for the next operation…';
    const why = event.why || explainEvent(event);

    if (this.dom.narrationText) {
      this.dom.narrationText.textContent = operation;
    }
    if (this.dom.operationType) {
      this.dom.operationType.textContent = formatType(event.type);
    }
    if (this.dom.whyText) {
      this.dom.whyText.textContent = why;
    }
    if (this.dom.explanationLive) {
      this.dom.explanationLive.textContent = `${formatType(event.type)}: ${operation}. Why: ${why}`;
    }
  }
}

function formatType(type) {
  if (!type) return 'Idle';
  return String(type)
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase());
}
