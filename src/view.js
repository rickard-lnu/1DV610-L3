export default class View {
  constructor() {
    this.input = document.getElementById('dataInput');
    this.results = document.getElementById('results');
    this.calcBtn = document.getElementById('calcBtn');
    this.clearBtn = document.getElementById('clearBtn');
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
