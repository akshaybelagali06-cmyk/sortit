# ⚡ SortIt - Interactive Sorting Algorithm Visualizer

SortIt is a state-of-the-art, interactive web application built to visualize and understand **25 sorting algorithms** in real time. It features color-coded step-by-step animations, live operation narration, Web Audio API pitch synthesis, pseudocode line execution tracking, and an automated startup self-test suite.

---

## 🌟 Key Features

- **25 Sorting Algorithms**: Simple O(N²), Efficient O(N log N), Distribution / Non-Comparison, and Exotic algorithms.
- **Pure Generator Architecture**: Algorithms yield pure step events (`compare`, `swap`, `overwrite`, `pivot`, `markSorted`) without mutating the DOM or using timer delays.
- **Full Playback Control**: Play, Pause, Step Forward, Step Backward (history stack navigation), and Speed control (1 ms to 250 ms).
- **Web Audio API Tone Synthesizer**: Pitch scales dynamically with element value; customizable volume and sound toggle.
- **Auxiliary Bin Visualizer**: Dedicated visualization panel for non-comparison distribution sorts (Counting, Radix, Bucket, Pigeonhole, Strand).
- **Live Pseudocode Execution**: Displays pseudocode for all 25 algorithms and highlights the currently executing line at each step.
- **Automated Self-Test Suite**: Automatically runs every generator on startup against test arrays to verify mathematical correctness vs native `Array.prototype.sort()`.

---

## 📂 Project Structure

```
sort-it/
├── index.html        # Accessible HTML5 workstation layout
├── styles.css        # Cyberpunk dark mode design system & flex bar animations
├── app.js            # UI Controller, StepPlayer engine, & Audio Synthesizer
├── algorithms.js     # 25 ES6 pure generator functions & pseudocode metadata
└── README.md         # Documentation & guide to adding custom algorithms
```

---

## 🚀 How to Run

Because the application uses standard ES6 modules (`import/export`), open `index.html` via any local HTTP server (or VS Code Live Server / Python HTTP server):

```bash
# Using Python
python -m http.server 8000

# Using Node npx serve
npx serve .
```

Then visit `http://localhost:8000` in your web browser.

---

## 🛠️ Architecture: The Generator Event Model

Algorithms in SortIt do **NOT** handle rendering, DOM manipulation, or `setTimeout` delays. Instead, each algorithm is written as an **ES6 Generator Function** (`function*`) that yields event objects:

```js
yield {
  type: 'compare' | 'swap' | 'overwrite' | 'pivot' | 'markSorted' | 'line',
  indices: [i, j],              // Primary array indices involved in operation
  array: [...currentSnapshot],  // Full snapshot copy of primary array
  line: 4,                      // 1-based index of active pseudocode line
  description: "Comparing arr[i] and arr[j]", // Live narration text
  auxData?: {                   // Optional auxiliary bin data
    label: "Buckets",
    items: [{ value: "B0: 12, 15", state: "active" }]
  }
};
```

---

## 📖 How to Add a New Algorithm (e.g., 26th Algorithm)

Adding a new algorithm is quick and straightforward:

### Step 1: Open `algorithms.js`

1. **Add Metadata & Pseudocode**:
   Add your algorithm entry to `ALGORITHM_METADATA`:

   ```javascript
   export const ALGORITHM_METADATA = {
     // ... existing algorithms
     mySort: {
       name: "My Custom Sort",
       category: "Simple O(N²)",
       timeBest: "O(N)",
       timeAvg: "O(N²)",
       timeWorst: "O(N²)",
       space: "O(1)",
       description: "Description of how My Custom Sort works.",
       pseudocode: [
         "for i = 0 to n - 1",
         "  compare & swap if out of order"
       ]
     }
   };
   ```

2. **Write the Generator Function**:
   Define your generator function `mySort(arr)`:

   ```javascript
   export function* mySort(arr) {
     let a = [...arr];
     let n = a.length;

     for (let i = 0; i < n - 1; i++) {
       // Yield compare event
       yield {
         type: "compare",
         indices: [i, i + 1],
         array: [...a],
         line: 2,
         description: `Comparing arr[${i}] (${a[i]}) and arr[${i+1}] (${a[i+1]})`
       };

       if (a[i] > a[i + 1]) {
         let temp = a[i];
         a[i] = a[i + 1];
         a[i + 1] = temp;

         // Yield swap event
         yield {
           type: "swap",
           indices: [i, i + 1],
           array: [...a],
           line: 2,
           description: `Swapped arr[${i}] and arr[${i+1}]`
         };
       }
     }

     // Mark final sorted state
     for (let k = 0; k < n; k++) {
       yield { type: "markSorted", indices: [k], array: [...a], line: 2, description: "Sorting Complete!" };
     }
   }
   ```

3. **Register in `ALGORITHMS` Export Map**:

   ```javascript
   export const ALGORITHMS = {
     // ...
     mySort: mySort
   };
   ```

### Step 2: Update `index.html` Select Dropdown

In `index.html`, add an `<option>` element inside the `<select id="algoSelect">`:

```html
<option value="mySort">My Custom Sort</option>
```

That's it! SortIt will automatically:
1. Include `mySort` in the automated self-test runner on startup.
2. Render its pseudocode and complexities.
3. Handle play/pause/stepping/audio synthesis for your algorithm.

---

## 🧪 Self-Test Verification

On page load, `runSelfTests()` executes all registered generators against sample input arrays and validates that the final state array matches `Array.prototype.sort((a,b)=>a-b)`. The status badge in the header displays:
`Self-Test: 25/25 Passed ✓`

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play / Pause visualization |
| `←` (Left Arrow) | Step Backward |
| `→` (Right Arrow) | Step Forward |
| `R` | Reset Array |
