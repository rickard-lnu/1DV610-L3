/**
 * Controller: coordinates input parsing, model updates, and view rendering.
 * `handle*` methods are bound as event callbacks by View.
 */
export default class Controller {
  /**
   * @param {import('../models/model.js').default} model
   * @param {import('../views/view.js').default} view
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindCalculate(this.handleCalculate.bind(this));
    this.view.bindClear(this.handleClear.bind(this));
    this.view.bindFile(this.handleFile.bind(this));
    this.view.bindUseSelected(this.handleUseSelected.bind(this));
    this.view.bindExport(this.handleExport.bind(this));
    this.view.bindMetricChange(this.handleMetricChange.bind(this));
    this.view.bindPercentile(this.handlePercentile.bind(this));
  }

  /**
   * Parse comma separated numbers.
   * @param {string} raw
   * @returns {number[]}
   * @throws {Error} if any token invalid.
   */
  parseInput(raw) {
    if (!raw || raw.trim() === '') return [];
    const parts = raw.split(',').map(s => s.trim()).filter(s => s !== '');
    const nums = parts.map(p => {
      const n = Number(p);
      if (Number.isNaN(n)) throw new Error(`Invalid number: ${p}`);
      return n;
    });
    return nums;
  }

  /**
   * Manual calculation flow: parse, update model, filter metrics
   * @param {string} raw
   */
  handleCalculate(raw) {
    try {
      const nums = this.parseInput(raw);
      if (nums.length === 0) {
        this.view.showError('Please enter at least one number.');
        return;
      }

      this.model.setData(nums);
      const summary = this.model.getSummary();
      this.view.addDataset(`Manual ${new Date().toLocaleString()}`, nums.slice());
      const filtered = this._buildFilteredSummary(summary);
      if (!filtered) return;
      this.view.renderSummary(filtered);
      this.view.drawHistogram(nums);
    } catch (err) {
      this.view.showError(err.message || 'Invalid input');
    }
  }

  /** Clear current dataset. */
  handleClear() {
    this.model.setData([]);
  }

  /**
   * handle CSV text input
   * @param {string} text
   */
  handleFile(text) {
    const nums = text.split(/[^0-9+\-.eE]+/).map(s => s.trim()).filter(s => s !== '').map(Number).filter(n => !Number.isNaN(n));
    if (nums.length === 0) {
      this.view.showError('No numeric values found in file');
      return;
    }
    this.model.setData(nums);
    const summary = this.model.getSummary();
    this.view.addDataset(`CSV ${new Date().toLocaleString()}`, nums.slice());
    const filtered = this._buildFilteredSummary(summary);
    if (!filtered) return;
    this.view.renderSummary(filtered);
    this.view.drawHistogram(nums);
  }

  /**
   * Load dataset from history and re-render.
   * @param {{label:string,array:number[]}} dataset
   */
  handleUseSelected(dataset) {
    this.model.setData(dataset.array);
    const summary = this.model.getSummary();
    const filtered = this._buildFilteredSummary(summary);
    if (!filtered) return;
    this.view.renderSummary(filtered);
    this.view.drawHistogram(dataset.array);
  }

  /** Export selected dataset as JSON. */
  handleExport(dataset) {
    this.view.exportJSON(dataset);
  }

  /**
   * Re-render metrics when selection changes
   * @param {string[]} metrics
   */
  handleMetricChange(metrics) {
    const summary = this.model.getSummary();
    if (!summary) return;
    const filtered = {};
    metrics.forEach(m => { if (m in summary) filtered[m] = summary[m]; });
    this.view.renderSummary(filtered);
  }

  /**
   * add custom percentile to current filtered metrics.
   * @param {number} p
   */
  handlePercentile(p) {
    if (typeof p !== 'number' || p < 0 || p > 100) {
      this.view.showError('Percentile must be a number between 0 and 100');
      return;
    }

    const val = this.model.getPercentile(p);
    const summary = this.model.getSummary() || {};
    const selected = (this.view && typeof this.view.selectedMetrics === 'function') ? this.view.selectedMetrics() : Object.keys(summary);
    const filtered = {};
    selected.forEach(m => { if (m in summary) filtered[m] = summary[m]; });
    filtered[`p${p}`] = val;
    this.view.renderSummary(filtered);
  }

  /**
   * build filtered summary based on selected metrics.
   * @param {Object} summary
   * @returns {Object|null}
   * @private
   */
  _buildFilteredSummary(summary) {
    if (!this.view || typeof this.view.selectedMetrics !== 'function') return summary;
    const selected = this.view.selectedMetrics();
    if (!selected || selected.length === 0) {
      this.view.showError('Please select at least one metric to display.');
      return null;
    }
    const filtered = {};
    selected.forEach(m => { if (m in summary) filtered[m] = summary[m]; });
    return filtered;
  }
}
