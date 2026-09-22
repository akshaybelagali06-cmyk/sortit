import { ALGORITHM_KEYS, getAlgorithm } from "../data/algorithmRegistry.js";
import ComparisonRunner from "../comparison/ComparisonRunner.js";

let comparisonRunner = null;
let selectedAlgorithms = new Set();

export function createComparisonLab(container, getCurrentArray) {
  if (!container) {
    throw new Error("Comparison Lab container was not provided.");
  }

  if (typeof getCurrentArray !== "function") {
    throw new Error("getCurrentArray must be a function.");
  }

  comparisonRunner = new ComparisonRunner();
  selectedAlgorithms = new Set();

  const selectionRoot = container.querySelector("#comparison-algorithm-selection");
  if (!selectionRoot) {
    throw new Error("Comparison Lab selection container was not found.");
  }

  renderAlgorithmSelection(selectionRoot);
  attachComparisonEvents(container, getCurrentArray);
  updateSelectedAlgorithms(container, getCurrentArray);
  updateExperimentDetails(container, getCurrentArray());
  setStatus(container, "Select at least two algorithms.");

  return {
    runner: comparisonRunner,
  };
}

function renderAlgorithmSelection(selectionRoot) {
  selectionRoot.innerHTML = "";

  for (const key of ALGORITHM_KEYS) {
    const algorithm = getAlgorithm(key);
    if (!algorithm) continue;

    const label = document.createElement("label");
    label.className = "comparison-algorithm-card";
    label.setAttribute("for", `comparison-${key}`);
    label.innerHTML = `
      <input
        id="comparison-${key}"
        type="checkbox"
        value="${key}"
        class="comparison-checkbox"
        aria-label="Select ${escapeHTML(algorithm.name)}"
      />
      <span class="comparison-card-main">
        <span class="comparison-algorithm-name">${escapeHTML(algorithm.name)}</span>
        <span class="comparison-algorithm-meta">${escapeHTML(algorithm.category || "Sorting")}</span>
      </span>
      <span class="comparison-algorithm-complexity">${escapeHTML(algorithm.timeAvg || "—")}</span>
    `;

    selectionRoot.appendChild(label);
  }
}

function attachComparisonEvents(container, getCurrentArray) {
  const selectAllButton = container.querySelector("#comparison-select-all");
  const clearAllButton = container.querySelector("#comparison-clear-all");
  const runButton = container.querySelector("#comparison-run");

  selectAllButton?.addEventListener("click", () => {
    container.querySelectorAll(".comparison-checkbox").forEach((checkbox) => {
      checkbox.checked = true;
    });
    updateSelectedAlgorithms(container, getCurrentArray);
  });

  clearAllButton?.addEventListener("click", () => {
    container.querySelectorAll(".comparison-checkbox").forEach((checkbox) => {
      checkbox.checked = false;
    });
    updateSelectedAlgorithms(container, getCurrentArray);
  });

  container.querySelectorAll(".comparison-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateSelectedAlgorithms(container, getCurrentArray);
    });
  });

  runButton?.addEventListener("click", () => {
    runComparison(container, getCurrentArray);
  });
}

function updateSelectedAlgorithms(container, getCurrentArray = () => []) {
  selectedAlgorithms.clear();

  const cards = container.querySelectorAll(".comparison-algorithm-card");
  cards.forEach((card) => {
    const checkbox = card.querySelector(".comparison-checkbox");
    const isSelected = !!(checkbox && checkbox.checked);
    card.classList.toggle("is-selected", isSelected);
    if (isSelected) {
      selectedAlgorithms.add(checkbox.value);
    }
  });

  const status = container.querySelector("#comparison-status");
  if (!status) return;

  if (selectedAlgorithms.size < 2) {
    status.textContent = "Select at least two algorithms.";
    status.dataset.tone = "neutral";
  } else {
    status.textContent = `${selectedAlgorithms.size} algorithms selected. Ready to compare.`;
    status.dataset.tone = "ready";
  }

  updateRunButtonState(container);
  updateExperimentDetails(container, getCurrentArray());
}

function updateExperimentDetails(container, currentArray) {
  const inputSize = Array.isArray(currentArray) ? currentArray.length : 0;
  const inputSizeNode = container.querySelector("#comparison-input-size");
  const countNode = container.querySelector("#comparison-algorithm-count");

  if (inputSizeNode) inputSizeNode.textContent = String(inputSize);
  if (countNode) countNode.textContent = String(selectedAlgorithms.size || 0);
}

function updateRunButtonState(container) {
  const runButton = container.querySelector("#comparison-run");
  if (!runButton) return;

  const enabled = selectedAlgorithms.size >= 2;
  runButton.disabled = !enabled;
  runButton.setAttribute("aria-disabled", String(!enabled));
  runButton.title = enabled
    ? "Run comparison on the selected algorithms"
    : "Select at least two algorithms to run";
}

function runComparison(container, getCurrentArray) {
  if (selectedAlgorithms.size < 2) {
    setStatus(container, "Please select at least two algorithms.");
    return;
  }

  const originalArray = getCurrentArray();
  if (!Array.isArray(originalArray) || originalArray.length === 0) {
    setStatus(container, "Generate or enter an array first.");
    return;
  }

  const algorithmKeys = [...selectedAlgorithms];
  updateExperimentDetails(container, originalArray);
  setStatus(container, `Running comparison on ${originalArray.length} values...`);

  try {
    const unsafeAlgorithms = algorithmKeys.filter((key) => {
      const algorithm = getAlgorithm(key);
      return algorithm && Number.isFinite(algorithm.maxSize) && originalArray.length > algorithm.maxSize;
    });

    const results = comparisonRunner.run(originalArray, algorithmKeys);
    renderResults(container, results);
    renderFastest(container);

    if (unsafeAlgorithms.length > 0) {
      setStatus(
        container,
        `Comparison completed using ${originalArray.length} values. Some algorithms exceed their recommended maximum size.`
      );
    } else {
      setStatus(container, `Comparison completed using ${originalArray.length} values.`);
    }
  } catch (error) {
    console.error("Comparison Lab error:", error);
    setStatus(container, `Comparison failed: ${error.message}`);
  }
}

function renderResults(container, results) {
  const body = container.querySelector("#comparison-results-body");
  if (!body) return;

  body.innerHTML = "";

  const comparisonResults = comparisonRunner.getComparisonResults();

  if (!comparisonResults.length) {
    body.innerHTML = `
      <tr>
        <td colspan="5" class="comparison-empty">No algorithms selected yet.</td>
      </tr>
    `;
    return;
  }

  for (const result of comparisonResults) {
    const row = document.createElement("tr");
    row.classList.toggle("is-error", result.status === "ERROR");
    row.classList.toggle("is-failed", result.status === "FAILED");

    const time = Number.isFinite(result.time) ? `${result.time.toFixed(4)} ms` : "—";
    const difference = Number.isFinite(result.differenceMs)
      ? `${result.differenceMs >= 0 ? "+" : ""}${result.differenceMs.toFixed(4)} ms`
      : "—";

    let statusLabel = "—";
    if (result.status === "COMPLETED") statusLabel = "✓ Sorted";
    else if (result.status === "FAILED") statusLabel = "✗ Failed";
    else if (result.status === "ERROR") statusLabel = "⚠ Error";
    else statusLabel = result.status;

    row.innerHTML = `
      <td><strong>${escapeHTML(result.name)}</strong></td>
      <td>${time}</td>
      <td>${result.steps ?? "—"}</td>
      <td><span class="comparison-status-pill ${result.status === "COMPLETED" ? "is-success" : result.status === "ERROR" ? "is-error" : result.status === "FAILED" ? "is-failed" : ""}">${statusLabel}</span></td>
      <td>${difference}</td>
    `;

    body.appendChild(row);
  }
}

function renderFastest(container) {
  const fastest = comparisonRunner.getFastest();
  const element = container.querySelector("#comparison-fastest");
  if (!element) return;

  if (!fastest) {
    element.hidden = true;
    element.innerHTML = "";
    return;
  }

  element.hidden = false;
  element.innerHTML = `
    <div class="comparison-fastest-icon" aria-hidden="true">⚡</div>
    <div>
      <span class="comparison-fastest-label">Fastest in this experiment</span>
      <strong>${escapeHTML(fastest.name)}</strong>
      <span>${fastest.time.toFixed(4)} ms</span>
    </div>
  `;
}

function setStatus(container, message) {
  const element = container.querySelector("#comparison-status");
  if (element) {
    element.textContent = message;
    element.dataset.tone = message.toLowerCase().includes("error") || message.toLowerCase().includes("failed") ? "error" : message.toLowerCase().includes("running") ? "running" : "neutral";
  }
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
