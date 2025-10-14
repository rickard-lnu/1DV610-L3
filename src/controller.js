export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindCalculate(this.handleCalculate.bind(this));
    this.view.bindClear(this.handleClear.bind(this));
    this.view.bindFile(this.handleFile.bind(this));
    this.view.bindUseSelected(this.handleUseSelected.bind(this));
    this.view.bindExport(this.handleExport.bind(this));
    this.view.bindMetricChange(this.handleMetricChange.bind(this));
  }

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
      this.view.renderSummary(summary);
      this.view.drawHistogram(nums);
    } catch (err) {
      this.view.showError(err.message || 'Invalid input');
    }
  }

  handleClear() {
    this.model.setData([]);
  }

  handleFile(text) {
    // CSV parse: split by non-number separators
    const nums = text.split(/[^0-9+\-.eE]+/).map(s => s.trim()).filter(s => s !== '').map(Number).filter(n => !Number.isNaN(n));
    if (nums.length === 0) {
      this.view.showError('No numeric values found in file');
      return;
    }
    this.model.setData(nums);
    const summary = this.model.getSummary();
    this.view.addDataset(`CSV ${new Date().toLocaleString()}`, nums.slice());
    this.view.renderSummary(summary);
    this.view.drawHistogram(nums);
  }

  handleUseSelected(dataset) {
    this.model.setData(dataset.array);
    const summary = this.model.getSummary();
    this.view.renderSummary(summary);
    this.view.drawHistogram(dataset.array);
  }

  handleExport(dataset) {
    this.view.exportJSON(dataset);
  }

  handleMetricChange(metrics) {
    // re-render with a filtered summary
    const summary = this.model.getSummary();
    if (!summary) return;
    const filtered = {};
    metrics.forEach(m => { if (m in summary) filtered[m] = summary[m]; });
    this.view.renderSummary(filtered);
  }
}
