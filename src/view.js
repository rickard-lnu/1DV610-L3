export default class View {
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
  }

  bindCalculate(handler) {
    this.calcBtn.addEventListener('click', () => {
      const raw = this.input.value;
      handler(raw);
    });
  }

  bindClear(handler) {
    this.clearBtn.addEventListener('click', () => {
      this.input.value = '';
      this.results.innerHTML = '';
      handler();
    });
  }

  bindFile(handler) {
    if (!this.fileInput) return;
    this.fileInput.addEventListener('change', (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        handler(reader.result);
      };
      reader.readAsText(f);
      // clear file input so same file can be re-selected
      ev.target.value = '';
    });
  }

  bindUseSelected(handler) {
    this.useSelectedBtn.addEventListener('click', () => {
      const idx = this.datasetList.selectedIndex;
      if (idx < 0) return;
      handler(this._datasets[idx]);
    });
  }

  bindExport(handler) {
    this.exportBtn.addEventListener('click', () => {
      const idx = this.datasetList.selectedIndex;
      if (idx < 0) return;
      handler(this._datasets[idx]);
    });
  }

  bindMetricChange(handler) {
    this.metricCheckboxes.forEach(cb => cb.addEventListener('change', () => handler(this.selectedMetrics())));
  }

  selectedMetrics() {
    return this.metricCheckboxes.filter(cb => cb.checked).map(cb => cb.getAttribute('data-metric'));
  }

  addDataset(label, array) {
    this._datasets.push({ label, array });
    const opt = document.createElement('option');
    opt.textContent = label;
    this.datasetList.appendChild(opt);
  }

  exportJSON(dataset) {
    const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.label || 'dataset'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  drawHistogram(values) {
    if (!this.histogramCanvas) return;
    const ctx = this.histogramCanvas.getContext('2d');
    ctx.clearRect(0,0,this.histogramCanvas.width,this.histogramCanvas.height);
    if (!values || values.length === 0) return;

    // simple binning
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

  renderSummary(summary) {
    if (!summary) {
      this.results.innerHTML = '<p>No data</p>';
      return;
    }

    const html = `
      <h2>Results</h2>
      <ul>
        <li>Count: ${summary.count}</li>
        <li>Mean: ${summary.mean}</li>
        <li>Median: ${summary.median}</li>
        <li>Std Dev: ${summary.stdDev}</li>
        <li>Range: ${summary.range}</li>
        <li>Sum: ${summary.sum}</li>
        <li>Q1: ${summary.q1}</li>
        <li>Q3: ${summary.q3}</li>
        <li>IQR: ${summary.iqr}</li>
      </ul>
    `;

    this.results.innerHTML = html;
  }

  showError(message) {
    this.results.innerHTML = `<p class="error">${message}</p>`;
  }
}
