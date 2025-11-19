# Reflektion - Clean Code
 
**Author:** Rickard M
**Course:** 1DV610 - Introduktion till mjukvarukvalitet  
**Assignment:** L3

## Kapitel 2: Meaningful Names (Meningsfulla namn)
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

## Chapter 3: Functions

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

## Chapter 4: Comments

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

## Chapter 5: Formatting

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

## Chapter 6–11 (Selected Principles Applied Briefly)

While not all later chapters are shown in code snippets here, their influence is still present:
- **Chapter 6: Objects and Data Structures** – The Model encapsulates the statistics library as the consumers never touch internal state directly.
- **Chapter 7: Error Handling** – Errors are surfaced with clear user‑facing messages (“Invalid number: abc”) instead of silent failures.
- **Chapter 8: Boundaries** – The thirdparty statistics module is wrapped in the Model, so if it changes, only one class is affected.
- **Chapter 9: Unit Tests** – Currently manual tests, the design kept testable (pure parsing in `parseInput`). Future improvement: add Jest
- **Chapter 10: Classes** – Small, single‑purpose classes (Model/View/Controller) with clear responsibilities.
- **Chapter 11: Systems** – Separation of concerns (MVC) supports evolution (adding persistence or new metrics) without large rewrites.

## Impact

Applying these principles produced code that is easier to read, safer to change, and simpler to extend. Naming plus small focused functions have reduced the load as a developer, as it is easier to read and understand. Encapsulation at the boundaries (wrapping the statistics library) isolates risk. The remaining improvement areas could be automated tests and a fallback for `mode()` on large datasets.

## Planned Improvements
1. Introduce automated unit tests (Jest) for parsing, percentile combination, and product overflow logic.
2. Add local mode calculation when the library returns `null`.
3. Add JSDoc for public method signatures to improve discoverability.
4. ?? Maybe implement persistence (localStorage) for dataset history.

---

