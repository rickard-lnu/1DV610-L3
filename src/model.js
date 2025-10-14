import StatisticsCalculator from 'basic-statistics-calculator';

export default class Model {
  constructor() {
    this._calc = new StatisticsCalculator();
  }

  setData(array) {
    this._calc.clearData();
    this._calc.addData(array);
  }

  getSummary() {
    return {
      count: this._calc.count(),
      mean: this._calc.mean(),
      median: this._calc.median(),
      stdDev: this._calc.stdDev(),
      range: this._calc.range(),
      sum: this._calc.sum(),
      q1: this._calc.q1(),
      q3: this._calc.q3(),
      iqr: this._calc.iqr()
    };
  }
}
