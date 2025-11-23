# Reflection - Clean Code 

**Course:** 1DV610 - Introduktion till mjukvarukvalitet  
**Assignment:** L3 + Refactor of L2

## REFLECTION FOR APP

### Kapitel 2: Meaningful Names
The chapter regarding meaningful names has had quite a bit of an impact on my code. I've used **intention-revealing names** such as `computeProductSafely` instead of something like `calcProd`. The method name reveals both what it does (calculates product) and how (that it does it in a way that safely deals with overflow). I have also followed the principle of **searchable names** by using `this._datasets` instead of using only characters, making it easier to search for and understand things inn the code. A challenge was to balance **meaningsful context** with keeping things short and concise. For example: `handleCalculate` instead of `calculate` gives a context that it is an event handler. I avoid using **mental mapping** by not using abbreviations like `ctrl` or `mdl` and instead write them out as their full words (controller, model).

**Example in my code:**
```javascript
// Model.js - intention revealing name and avoiding disinformation
getSummary() {
  const computeProductSafely = (arr) => {
  const productSafe = computeProductSafely(this._raw);
}

// Controller.js - Searchable names and meaningful context
handleCalculate(raw) {
  const nums = this.parseInput(raw);
  const filtered = this._buildFilteredSummary(summary);
}
```

### Chapter 3: Functions

This chapter influenced how I structure methods. I follow **"Do One Thing"**, like for example `parseInput` only parses and throws errors on invalid values, while `handleCalculate` controls the entire flow. I keep functions **small**, aiming for under ~20 lines when it's feasible. Methods in the View class like `bindCalculate`, `bindClear`, `bindFile` also follow **one level of abstraction** as each binds events at a consistent level. I use **descriptive names** like `_buildFilteredSummary` which I think clearly conveys its purpose. There is a minor tension around **function arguments**, some methods take two parameters (e.g. `addDataset(label, array)`), which goes slightly against "fewer arguments", but an object wrapper felt unnecessary and less clear.

**Code Example:**
```javascript
// Controller.js - Small function doing one thing
parseInput(raw) {
  if (!raw || raw.trim() === '') return [];
  return nums;
}

// View.js - descriptive name, single abstraction level
bindCalculate(handler) {
  this.calcBtn.addEventListener('click', () => {/* Lines 51-53 omitted */});
}
```

### Chapter 4: Comments

The book’s mantra **"comments are a failure"** has led me to focus on self‑explanatory code. Instead of adding comments I use **explanation in code** through clear variable and method names. For instance `computeProductSafely` needs no extra comment, its intent I feel is obvious. The few comments I do keep however are **informative comments** that explain *why* (e.g. “clear file input so same file can be re‑selected”) instead of *what*. I avoid **redundant comments** like `// set data` above `setData()`. A challenge is that some more complex logic (histogram drawing) might arguably benefit from a brief rationale, but I prefer extracting to smaller methods with descriptive names.

**Code Example:**
```javascript
// View.js - comment explains WHY, and not WHAT
bindFile(handler) {
  this.fileInput.addEventListener('change', (ev) => {/* Lines 66-73 omitted */});
}

// Model.js - Self‑explanatory code instead of comments
const productSafe = computeProductSafely(this._raw);
```

### Chapter 5: Formatting

I apply **vertical openness** by separating logical blocks with blank lines, visible in `getSummary()` where I first define a helper, then compute, then return the object. **Vertical density** keeps related code close, all checkbox bindings in View are grouped. I use **vertical ordering** so public methods (`setData`, `getSummary`) appear before helpers (`_buildFilteredSummary`), keeping **dependent functions** near each other. **Horizontal formatting** keeps most lines below around 100 characters for readability. There is some vertical length in the object literal of `getSummary()`, but I personally prefer one cohesive return object instead of splitting into multiple fragments.

**Code Example:**
```javascript
// Model.js - vertical openness between logical sections
getSummary() {
  const computeProductSafely = (arr) => {/* Lines 89-98 omitted */};
}

// Controller.js - Dependent functions are close together
handleCalculate(raw) {
  // ... uses _buildFilteredSummary
  const filtered = this._buildFilteredSummary(summary);
}

_buildFilteredSummary(summary) {
  // Helper function immediately after its caller
}
```

### Chapter 6–11 (Selected Principles Applied Briefly)

While not all later chapters are shown in code snippets here, their influence is still present:
- **Chapter 6: Objects and Data Structures** – The Model encapsulates the statistics library as the consumers never touch internal state directly.
- **Chapter 7: Error Handling** – Errors are surfaced with clear user‑facing messages (“Invalid number: abc”) instead of silent failures.
- **Chapter 8: Boundaries** – The thirdparty statistics module is wrapped in the Model, so if it changes, only one class is affected.
- **Chapter 9: Unit Tests** – Currently manual tests, the design kept testable (pure parsing in `parseInput`). Future improvement: add Jest
- **Chapter 10: Classes** – Small, single‑purpose classes (Model/View/Controller) with clear responsibilities.
- **Chapter 11: Systems** – Separation of concerns (MVC) supports evolution (adding persistence or new metrics) without large rewrites.

### Impact

Applying these principles produced code that is easier to read, safer to change, and simpler to extend. Naming plus small focused functions have reduced the load as a developer, as it is easier to read and understand. Encapsulation at the boundaries (wrapping the statistics library) isolates risk. The remaining improvement areas could be automated tests and a fallback for `mode()` on large datasets.

---
## REFLECTION FOR MODULE

Module: `StatisticsCalculator` (refactored version)

---
### Chapter 2 – Meaningful Names
I reinforced intention‑revealing names by keeping clear statistical method names (`mean`, `median`, `variance`) and adding a more professional alternative `qualityScore()` while keeping the old `happinessIndex()` for backward compatibility. That’s a conscious compromise between "Meaningful Distinctions" and API stability – renaming `stdDev()` to `standardDeviation()` would improve consistency but break tests and users. I applied *Don’t Be Cute* by deprecating the playful name via JSDoc instead of ripping it out. Consistent helper naming (`_validateAddData`, `_computePercentile`) lowers mental mapping and clarifies abstraction. The trade‑off though, is keeping the abbreviation `stdDev` is a tiny style mismatch but pragmatic.

```javascript
// Chapter 2 example
qualityScore() { /* clearer name */ }
/** Deprecated: use qualityScore(). */
happinessIndex() { return this.qualityScore() }
_validateAddData(values) { /* intention-revealing */ }
```

### Chapter 3 – Functions
I applied "Do One Thing" by splitting former long methods: `addData` → `_validateAddData` + `_appendValues`, `mode` → `_buildFrequencyMap`, `_maxCount`, `_extractModes`, `percentile` → `_validatePercentile` + `_computePercentile`. This cuts mixed abstraction levels ("Functions should descend only one level of abstraction") and keeps functions *Small*. Separate helpers lower temporal coupling because now the order is explicit in the public flow. Extracting bubble sort to `_bubbleSort` boosts it's testability and future algorithm swaps without touching public code. Trade‑off, more tiny functions increases count but lowers cognitive load.

```javascript
// Chapter 3 example
addData(values) { this._validateAddData(values); this._appendValues(values) }
mode() { const freq = this._buildFrequencyMap(); const max = this._maxCount(freq); return this._extractModes(freq, max) }
percentile(p) { this._validatePercentile(p); return this._computePercentile(p) }
```

### Chapter 4 – Comments
I removed redundant "explaining" comments and leaned more towards on self‑documenting names. JSDoc stayed for public methods where the contract (null return or errors) matters – these are more like legal comments than fluff. The deprecation comment for `happinessIndex` is a justified exception that signals intent without duplicating logic. Former inline bubble sort loop commentary was replaced by `_bubbleSort` which follows the idea that code should be understandable without narration. Trade‑off, removing too many comments can reduce teaching value, but consumers get a cleaner API.

```javascript
/** Deprecated: use qualityScore(). Kept for backward compatibility. */
happinessIndex() { return this.qualityScore() }
// Helper names replace prior loop commentary
_bubbleSort(arr) { /* ... */ }
```

### Chapter 5 – Formatting
I kept vertical grouping consistent as public statistical methods first, then a clearly separated helper section. Prettier rules (no semicolons, single quotes, low column width) helps tidy horizontal formatting which in turn aids scanning. Blank lines split logical blocks to avoid dense code walls. Grouped helpers create visual symmetry and support the "newspaper metaphor" for quick top‑down reading. The Trade‑off here is a manual helper section banner instead of splitting files favors simplicity at this size.

```javascript
// ===================== Private / Helper Methods =====================
_validateAddData(values) { /* ... */ }
_appendValues(values) { /* ... */ }
_bubbleSort(arr) { /* ... */ }
```

### Chapter 6 – Objects and Data Structures
I protect the internal representation by never exposing `numbers` directly, only derived results (encapsulation). The frequency map for `mode` is built internally then discarded, reducing risk of external mutation. Helpers focus on behavior around data instead of creating anemic structures. Trade‑off: I don’t clone on `addData` (just push) which is simpler and faster but less purely functional; I chose performance and clarity here. I think the design keeps high cohesion, only statistical logic lives in the class.

```javascript
constructor() { this.numbers = [] }
_buildFrequencyMap() { /* local structure, not exposed */ }
```

### Chapter 7 – Error Handling
Adding `DataValidationError` and `PercentileRangeError` i think gives semantic clarity and separates business logic from error policy. I "fail fast" via early validation (`_validateAddData`, `_validatePercentile`) before any heavy lifting. Messages stayed identical to avoid breaking tests which is a deliberate backward compatibility move. Isolated validation lowers hidden side effects and applies "use exceptions rather than return codes". But, its not without its trade-offs either, this leads to custom error classes aren’t yet consumed in external tests, but enable richer handling later.

```javascript
class DataValidationError extends Error {}
_validateAddData(values) { throw new DataValidationError('Data has to be an array') }
_validatePercentile(p) { throw new PercentileRangeError('Percentile has to be between 0 and 100') }
```

### Chapter 8 – Boundaries
I kept the public interface stable (all original methods remain) while changing internal structure thus respecting the boundary between public API and implementation details. `qualityScore` evolves the design without breaking existing `happinessIndex` calls. Sorting lives behind `_bubbleSort`, so swapping to a faster algorithm later won’t leak changes outward. No internal temporary structures are returned, which helps avoid detail leakage. Not extracting sorting to its own module reduces reuse potential but keeps things pretty lightweight.

```javascript
sortData() { const copy = this._copyNumbers(); return this._bubbleSort(copy) }
happinessIndex() { return this.qualityScore() } // boundary stability
```

### Chapter 9 – Unit Tests
All 26 existing tests still pass post‑refactor, satisfying FIRST (Fast, Independent, Repeatable, Self‑Validating, Timely). Finer‑grained public methods improve potential test targeting if I ever expose specific behavior differences. I skipped writing tests for helpers to preserve a black‑box perspective and limit coupling. The refactor backs the chapter's idea that cleaner function design lowers the need for complicated test setup. Only trade off i can think of is that helpers lack direct coverage BUT public behavior, the real contract, is intact.

```javascript
// Public method chaining small internal steps
percentile(p) { this._validatePercentile(p); return this._computePercentile(p) }
```

### Chapter 10 – Classes
Class cohesion increased by extracting mixed responsibilities into focused helpers grouped at the bottom. Single Responsibility is stronger as the class now handles dataset storage plus statistical operations—nothing extra. Size remains fairly manageable and per‑method complexity is rather low, reflecting "keep classes small" pragmatically. Deprecation via delegation (`happinessIndex` → `qualityScore`) shows controlled evolution without expanding responsibility. 

```javascript
qualityScore() { /* aggregates _scoreSingleNumber */ }
_scoreSingleNumber(num) { /* focused responsibility */ }
```

### Chapter 11 – Systems
Refactoring enforces micro‑level separation of concerns: input, validation, computation, and result presentation are cleanly separated. The module stays small and composable, aligned with the chapter's push for organizing systems from clean components. Internal layering emerged: API -> stats logic -> helper algorithms. I resisted over‑engineering (no DI container or strategy pattern) to avoid accidental complexity. But yes, not splitting into multiple files limits structural scaling, but i think current size justifies simplicity.

```javascript
// Layering: public -> internal -> algorithm
addData(values) { this._validateAddData(values); this._appendValues(values) }
sortData() { const copy = this._copyNumbers(); return this._bubbleSort(copy) }
```

---

