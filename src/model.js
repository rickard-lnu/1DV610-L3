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
    // Return a summary using the module's API
    const computeProductSafely = (arr) => {
      if (!arr || arr.length === 0) return null;
      // try straightforward multiplication first
      let prod = 1;
      for (let v of arr) {
        prod *= v;
        if (!Number.isFinite(prod)) {
          // If any value is 0, product is 0.
          if (arr.some(x => x === 0)) return 0;
          let sumLog10 = 0;
          let sign = 1;
          for (let x of arr) {
            if (x < 0) sign *= -1;
            sumLog10 += Math.log10(Math.abs(x));
          }
          const exp = Math.floor(sumLog10);
          const mant = Math.pow(10, sumLog10 - exp);
          // return readable scientific string with limited precision
          return (sign < 0 ? '-' : '') + mant.toPrecision(6) + 'e+' + exp;
        }
      }
      return prod;
    };

    const productSafe = computeProductSafely(this._raw);

    return {
      count: this._calc.count(),
      sum: this._calc.sum(),
      sumOfSquares: this._calc.sumOfSquares ? this._calc.sumOfSquares() : null,
      product: productSafe,
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
