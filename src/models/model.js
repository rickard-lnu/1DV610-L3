/**
 * Model layer wrapping the third-party `basic-statistics-calculator` module.
 * Holds current dataset and exposes aggregate statistics with safe product handling.
 */
import StatisticsCalculator from 'basic-statistics-calculator';

export default class Model {
  /**
   * Create a new Model with an empty dataset.
   */
  constructor() {
    this._calc = new StatisticsCalculator();
    this._raw = [];
  }

  /**
   * Replace current dataset
   * @param {number[]} array - Finite numeric values.
   */
  setData(array) {
    this._calc.clearData();
    this._calc.addData(array);
    this._raw = array.slice();
  }

  /**
   * Calculate descriptive statistics. the product is guarded: if overflow occurs,
   * falls back to logarithmic accumulation, thus returning scientific notation.
   * Null values means metric unsupported by underlying calculator.
   * @returns {Object<string, number|string|null>} Summary map.
   */
  getSummary() {
    /**
     * compute product on overflow derive mantissa/exponent via log10.
     * @param {number[]} arr
     * @returns {number|string|null}
     */
    const computeProductSafely = (arr) => {
      if (!arr || arr.length === 0) return null;
      let prod = 1;
      for (let v of arr) {
        prod *= v;
        if (!Number.isFinite(prod)) {
          if (arr.some(x => x === 0)) return 0;
          let sumLog10 = 0;
          let sign = 1;
            for (let x of arr) {
              if (x < 0) sign *= -1;
              sumLog10 += Math.log10(Math.abs(x));
            }
          const exp = Math.floor(sumLog10);
          const mant = Math.pow(10, sumLog10 - exp);
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
      p10: this._calc.percentile ? this._calc.percentile(10) : null,
      p25: this._calc.percentile ? this._calc.percentile(25) : null,
      p50: this._calc.percentile ? this._calc.percentile(50) : null,
      p75: this._calc.percentile ? this._calc.percentile(75) : null,
      p90: this._calc.percentile ? this._calc.percentile(90) : null,
      happinessIndex: this._calc.happinessIndex ? this._calc.happinessIndex() : null
    };
  }

  /**
   * Get copy of raw dataset
   * @returns {number[]}
   */
  getRaw() {
    return this._raw.slice();
  }

  /**
   * get arbitrary percentile.
   * @param {number} p - Percentile in [0,100].
   * @returns {number|null}
   */
  getPercentile(p) {
    if (!this._calc || typeof this._calc.percentile !== 'function') return null;
    return this._calc.percentile(p);
  }
}
