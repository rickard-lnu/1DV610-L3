/**
 * View: DOM interaction & rendering. Maintains dataset history only.
 */
export default class View {
  /** Initialize DOM references. */
  constructor() {
    this.input = document.getElementById('dataInput');
    this.results = document.getElementById('results');
    this.calcBtn = document.getElementById('calcBtn');
    this.clearBtn = document.getElementById('clearBtn');
    this.fileInput = document.getElementById('fileInput');
    this.datasetList = document.getElementById('datasetList');
    this.useSelectedBtn = document.getElementById('useSelected');
    this.exportBtn = document.getElementById('exportBtn');
    this.metricCheckboxes = Array.from(document.querySelectorAll('[data-metric]'));
    this.histogramCanvas = document.getElementById('histogramCanvas');
    this._datasets = [];
    this.percentileInput = document.getElementById('percentileInput');
    this.percentileBtn = document.getElementById('percentileBtn');
  }

  /** Bind calculate button. */
  bindCalculate(handler) {
    this.calcBtn.addEventListener('click', () => {
      const raw = this.input.value;
      handler(raw);
    });
  }

  /** Bind clear button. */
  bindClear(handler) {
    this.clearBtn.addEventListener('click', () => {
      this.input.value = '';
      this.results.innerHTML = '';
      handler();
    });
  }

  /** Bind file input for CSV uploads. */
  bindFile(handler) {
    if (!this.fileInput) return;
    this.fileInput.addEventListener('change', (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => { handler(reader.result); };
      reader.readAsText(f);
      ev.target.value = '';
    });
  }

  /** Bind dataset selection usage. */
  bindUseSelected(handler) {
    this.useSelectedBtn.addEventListener('click', () => {
      const idx = this.datasetList.selectedIndex;
      if (idx < 0) return;
      handler(this._datasets[idx]);
    });
  }

  /** Bind export button. */
  bindExport(handler) {
    this.exportBtn.addEventListener('click', () => {
      const idx = this.datasetList.selectedIndex;
      if (idx < 0) return;
      handler(this._datasets[idx]);
    });
  }

  /** Bind metric checkbox changes. */
  bindMetricChange(handler) {
    this.metricCheckboxes.forEach(cb => cb.addEventListener('change', () => handler(this.selectedMetrics())));
  }

  /** Bind percentile button. */
  bindPercentile(handler) {
    if (!this.percentileBtn) return;
    this.percentileBtn.addEventListener('click', () => {
      const p = Number(this.percentileInput.value);
      handler(p);
    });
  }

  /** Get selected metric keys. */
  selectedMetrics() {
    return this.metricCheckboxes.filter(cb => cb.checked).map(cb => cb.getAttribute('data-metric'));
  }

  /** Add dataset to history & dropdown. */
  addDataset(label, array) {
    this._datasets.push({ label, array });
    const opt = document.createElement('option');
    opt.textContent = label;
    this.datasetList.appendChild(opt);
  }

  /** Trigger JSON download of dataset. */
  exportJSON(dataset) {
    const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.label || 'dataset'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /** Draw simple fixed-bin histogram. */
  drawHistogram(values) {
    if (!this.histogramCanvas) return;
    const ctx = this.histogramCanvas.getContext('2d');
    ctx.clearRect(0,0,this.histogramCanvas.width,this.histogramCanvas.height);
    if (!values || values.length === 0) return;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const bins = 10;
    const binSize = (max - min) / bins || 1;
    const counts = new Array(bins).fill(0);
    values.forEach(v => {
      const i = Math.min(bins - 1, Math.floor((v - min) / binSize));
      counts[i]++;
    });
    const w = this.histogramCanvas.width;
    const h = this.histogramCanvas.height;
    const barW = w / bins;
    const maxCount = Math.max(...counts);
    ctx.fillStyle = '#0ea5a0';
    counts.forEach((c, i) => {
      const barH = (c / maxCount) * (h - 20);
      const x = i * barW;
      const y = h - barH;
      ctx.fillRect(x + 2, y, barW - 4, barH);
    });
  }

  /** Render metric summary list (percentiles highlighted). */
  renderSummary(summary) {
    if (!summary || Object.keys(summary).length === 0) {
      this.results.innerHTML = '<p>No data</p>';
      return;
    }
    const rows = Object.keys(summary).map(k => {
      const val = Array.isArray(summary[k]) ? JSON.stringify(summary[k]) : summary[k];
      const isPercentile = /^p\d+(?:\.\d+)?$/.test(k);
      const cls = isPercentile ? 'percentile' : '';
      return `<li class="${cls}"><strong>${k}:</strong> <span class="value">${val}</span></li>`;
    }).join('\n');
    const html = `\n      <h2>Results</h2>\n      <ul>\n        ${rows}\n      </ul>\n    `;
    this.results.innerHTML = html;
  }

  /** Show error message in results area. */
  showError(message) {
    this.results.innerHTML = `<p class="error">${message}</p>`;
  }
}
