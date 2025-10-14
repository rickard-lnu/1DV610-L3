import StatisticsCalculator from 'basic-statistics-calculator';

export default class Model {
  constructor() {
    this._calc = new StatisticsCalculator();
    this._raw = [];
  }

  setData(array) {
    this._calc.clearData();
    this._calc.addData(array);
    this._raw = array.slice();
  }

  getSummary() {
    // Return a comprehensive summary using the module's API
    return {
      count: this._calc.count(),
      sum: this._calc.sum(),
      sumOfSquares: this._calc.sumOfSquares ? this._calc.sumOfSquares() : null,
      product: this._calc.product ? this._calc.product() : null,
      mean: this._calc.mean(),
      meanAbsolute: this._calc.meanAbsolute ? this._calc.meanAbsolute() : null,
      median: this._calc.median(),
      mode: this._calc.mode ? this._calc.mode() : null,
      min: this._calc.min ? this._calc.min() : null,
      max: this._calc.max ? this._calc.max() : null,
      range: this._calc.range(),
      variance: this._calc.variance ? this._calc.variance() : null,
      stdDev: this._calc.stdDev(),
      q1: this._calc.q1 ? this._calc.q1() : null,
      q3: this._calc.q3 ? this._calc.q3() : null,
      iqr: this._calc.iqr ? this._calc.iqr() : null,
      // common percentiles
      p10: this._calc.percentile ? this._calc.percentile(10) : null,
      p25: this._calc.percentile ? this._calc.percentile(25) : null,
      p50: this._calc.percentile ? this._calc.percentile(50) : null,
      p75: this._calc.percentile ? this._calc.percentile(75) : null,
      p90: this._calc.percentile ? this._calc.percentile(90) : null,
      happinessIndex: this._calc.happinessIndex ? this._calc.happinessIndex() : null
    };
  }

  getRaw() {
    return this._raw.slice();
  }

  getPercentile(p) {
    if (!this._calc || typeof this._calc.percentile !== 'function') return null;
    return this._calc.percentile(p);
  }
}
