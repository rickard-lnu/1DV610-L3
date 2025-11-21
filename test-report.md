# Test Report - L3 Statistics Calculator

**Project:** Statistics Calculator (L3)  
**Tester:** Rickard M  
**Last updated:** 2025-11-21  
**Version:** 1.0.0

## Summary

All 9 requirements have been verified through manual tests, and all have passed. The application works as expected and handles both normal scenarios and edge cases correctly.

## Test Environment

- **Browser:** Google Chrome
- **Operating System:** Windows 11
- **Method:** Manual testing via user interface
- **Build:** `npm run build` (production build)
- **Dev Server:** `npm run dev` (Vite dev server)

## Overview

| Req-ID | Requirement | Test-case | Status |
|---------|------|----------|--------|
| FR1 | Manually entering data | TC1, TC7, TC8 | ✅ Pass |
| FR2 | CSV upload | TC2 | ✅ Pass |
| FR3 | Metric selection | TC3 | ✅ Pass |
| FR4 | Show result | TC1, TC4, TC10 | ✅ Pass |
| FR5 | Custom percentiles | TC4 | ✅ Pass |
| FR6 | Dataset history | TC5 | ✅ Pass |
| FR7 | JSON export | TC6 | ✅ Pass |
| FR8 | Input validation | TC7, TC8 | ✅ Pass |
| FR9 | Edge case handling | TC9 | ✅ Pass |

## Detailed Test Cases

### TC1: Calculate basic statistics
**Goal:** Verify that the application can calculate basic statistics.  
**Prerequisites:**
- The app is running in the browser
- No previous datasets in its history

**Input:**
```
1,2,3,4,5
```

**Selected metrics:** Count, Sum, Mean, Median, Std Dev

**Test steps:**
1. Enter "1,2,3,4,5" in the input field
2. Ensure Count, Sum, Mean, Median, Std Dev are selected
3. Click "Calculate"

**Expected result:**
- count: 5
- sum: 15
- mean: 3
- median: 3
- stdDev: ≈ 1.414 (sqrt(2))

**Actual result:** ✅ Pass
- All values are displayed correctly
- Dataset is added to the history list

---

### TC2: Handle CSV uploads
**Goal:** Verify that the user can upload CSV files with numerical data.

**Prerequisites:**
- CSV file created with contents: `10,20,30,40,50`

**Input:**
- CSV file with numbers (comma- or line-separated)

**Test steps:**
1. Click "Upload CSV"
2. Select the CSV file from the file system
3. Verify that the data loads

**Expected result:**
- Numbers are extracted from the file
- Statistics are calculated automatically
- Dataset appears in history

**Actual result:** ✅ Pass
- Works with both comma-separated and line-separated values
- Handles whitespace and special characters correctly
- File input is cleared after upload (can select the same file again)

---

### TC3: Metric selection - validation
**Goal:** Verify that the system requires at least one selected metric.

**Prerequisites:**
- Data is present in the input field or selected from history

**Input:**
```
1,2,3,4,5
```

**Test steps:**
1. Enter data
2. Uncheck ALL metric checkboxes
3. Click "Calculate"

**Expected result:**
- Error message: "Please select at least one metric to display."
- No calculation is performed

**Actual result:** ✅ Pass
- A red error message is shown
- No results are rendered
- The user is guided to select at least one metric

---

### TC4: Custom percentile
**Goal:** Verify that users can calculate an arbitrary percentile.

**Prerequisites:**
- Dataset with 100 values (1–100) is available

**Input:**
- Data: `1,2,3,...,100` (generate or enter manually)
- Percentile: 75

**Test steps:**
1. Enter or load the dataset with 1–100
2. Select some metrics (e.g., mean, median)
3. Enter "75" in the percentile field
4. Click "Show Percentile"

**Expected result:**
- p75: 75 (or ~75 depending on interpolation)
- The percentile value is displayed together with the selected metrics
- The percentile row is highlighted (yellow border)

**Actual result:** ✅ Pass
- Percentile is calculated correctly via the module
- The value is added together with the selected metrics (not standalone)
- Percentile rows receive visual highlighting (yellow border)

---

### TC5: Dataset history
**Goal:** Verify that datasets are saved and can be reused.

**Prerequisites:**
- No previous datasets

**Input:**
- Dataset 1: `1,2,3,4,5`
- Dataset 2: `10,20,30,40,50`

**Test steps:**
1. Enter and calculate dataset 1
2. Enter and calculate dataset 2
3. Check the dataset list
4. Select dataset 1 from the dropdown
5. Click "Use selected"

**Expected result:**
- Both datasets are shown in the dropdown with timestamp
- Selecting dataset 1 loads the correct data

**Actual result:** ✅ Pass
- Datasets are saved with label: "Manual [timestamp]" or "CSV [timestamp]"
- Dropdown updates dynamically
- "Use selected" loads the correct dataset and recalculates

---

### TC6: Export JSON
**Goal:** Verify that users can export a dataset as JSON.

**Prerequisites:**
- At least one dataset exists in history

**Input:**
- Dataset: `5,10,15,20,25`

**Test steps:**
1. Calculate the dataset
2. Select the dataset from the history dropdown
3. Click "Export JSON"

**Expected result:**
- JSON file downloads with filename based on the label
- Content: `{ "label": "...", "array": [5,10,15,20,25] }`

**Actual result:** ✅ Pass
- File downloads automatically (Blob + URL.createObjectURL)
- JSON is formatted with `JSON.stringify(dataset, null, 2)`
- Filename: `[label].json`

---

### TC7: Invalid input
**Goal:** Verify that the system validates input and shows clear error messages.

**Prerequisites:**
- Input contains an invalid token

**Input:**
```
1,2,abc,3
```

**Test steps:**
1. Enter "1,2,abc,3"
2. Click "Calculate"

**Expected result:**
- Error message: "Invalid number: abc"
- No calculation is performed

**Actual result:** ✅ Pass
- Try-catch in `handleCalculate` catches parsing errors
- `parseInput` throws Error with a descriptive message
- A red error message is shown to the user

---

### TC8: Empty input
**Goal:** Verify that the system handles empty input.

**Prerequisites:**
- Input field is empty or only whitespace

**Input:**
```
(empty string or "   ")
```

**Test steps:**
1. Leave the input field empty
2. Click "Calculate"

**Expected result:**
- Error message: "Please enter at least one number."

**Actual result:** ✅ Pass
- `parseInput` returns an empty array
- `handleCalculate` checks `nums.length === 0`
- A clear error message is shown

---

### TC9: Product overflow handling
**Goal:** Verify that the product is handled correctly for very large numbers (Infinity scenarios).

**Prerequisites:**
- Dataset with large numbers that cause overflow

**Input:**
```
1e100, 1e100, 1e100
```
(alternatively: `999999999, 999999999, 999999999`)

**Test steps:**
1. Enter large numbers
2. Select the "product" metric
3. Calculate

**Expected result:**
- Product is shown in scientific notation (e.g., "1.00000e+300")
- Not "Infinity"

**Actual result:** ✅ Pass
- `computeProductSafely` in the Model detects overflow
- Uses logarithms to compute exponent and mantissa
- Returns readable string: format `[sign]mantissa.toPrecision(6)e+exponent`

**Edge cases tested:**
- Product with 0: returns 0 correctly
- Negative numbers: handles sign correctly

---

## Edge Cases & Additional Tests

### Large Datasets (Performance)
**Input:** 10,000 random numbers  
**Result:** ✅ Calculations are fast (<500ms)

### Negative Numbers
**Input:** `-5,-10,-15,-20`  
**Result:** ✅ Mean, median, etc. calculated correctly

### Decimals
**Input:** `1.5, 2.7, 3.9, 4.2`  
**Result:** ✅ Handled correctly, no precision loss

### Duplicates (Mode)
**Input:** `1,1,1,2,2,3`  
**Result:** ✅ Mode: 1 (via module)

### Clear functionality
**Steps:** Enter data, click Clear  
**Result:** ✅ Input field clears, results disappear, model resets

## Non-Functional Requirements

### NFR1: Load Time
**Tested:** Yes  
**Result:** ✅ Initial load <1s (Vite-optimized), calculations <100ms

### NFR2: Clean Code
**Tested:** Manual code review  
**Result:** ✅ Follows principles from Clean Code chapters 2–11 (see `reflection.md`)

### NFR3: MVC Architecture
**Tested:** Code review  
**Result:** ✅ Clear separation: Model (data), View (UI), Controller (logic)

### NFR4: Deployment
**Tested:** `npm run build` generates `dist/`  
**Result:** ✅ Can be deployed to Netlify/Vercel/GitHub Pages

### NFR5: Browser Compatibility
**Tested:** Chrome, Firefox, Safari  
**Result:** ✅ Works in all modern browsers (ES6 modules supported)

## Known Limitations

1. **Mode for large datasets:** 
   - The module's `mode()` can return `null` for certain datasets
   - The app shows `null` instead of falling back to a local calculation
   - **Impact:** Low (rare scenario)

2. **CSV parsing:**
   - Simple regex-based parsing
   - May fail with complex CSV formats (quoted fields, etc.)
   - **Remedy:** Use simple CSV files, or maybe using some library

3. **No automated tests:**
   - Manual testing only
   - **Improvement:** Add Jest/Vitest unit tests

## Summary & Recommendations

**Status:** ✅ All requirements met

**Test results:**
- All test cases passed
- Edge cases handled correctly
- No critical bugs

**For future development:**
1. Add automated unit tests
2. Improve CSV parsing with a robust library
3. Add mode fallback for large datasets
5. Add tooltips/help text for metrics

---

**Tester:**  
Rickard M

