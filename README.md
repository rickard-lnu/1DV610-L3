# Statistics Calculator (L3)

Minimal MVC single-page app built with Vite and the `basic-statistics-calculator` module.

## Features
- Manual numeric input or CSV upload
- Select which metrics to display (mean, median, stdDev, etc.)
- Custom percentile query (0–100)
- Dataset history + JSON export
- Product calculation (scientific notation on overflow)

## Quick Start
```powershell
npm install
npm run dev
```
Visit the printed local URL (default: http://localhost:5173).

## Build & Deploy
```powershell
npm run build
```
Deploy the `dist/` folder (Netlify config already in `netlify.toml`).

## Usage
1. Enter numbers (comma separated) or upload a CSV.
2. Tick desired metrics.
3. Click Calculate.
4. (Optional) Enter a percentile and press Show Percentile.
5. Export or reuse datasets from history.

## Project Structure
`src/models` (data + stats) · `src/controllers` (orchestration) · `src/views` (DOM) · `index.html` (shell).

## License
MIT
