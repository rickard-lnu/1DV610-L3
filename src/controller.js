export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindCalculate(this.handleCalculate.bind(this));
    this.view.bindClear(this.handleClear.bind(this));
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
      this.view.renderSummary(summary);
    } catch (err) {
      this.view.showError(err.message || 'Invalid input');
    }
  }

  handleClear() {
    this.model.setData([]);
  }
}
