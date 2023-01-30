import decimal from "decimal.js"

class Rounder {
  num: number | string
  scientificStr: string
  isNegative: boolean = false
  isZero: boolean = false
  isScientificStr: boolean = false

  constructor(num: number | string) {
    if (num < 0) this.isNegative = true;
    if (+num === 0) this.isZero = true;
    if (`${num}`.includes(`×10`)) {
      this.isScientificStr = true;
      this.scientificStr = `${num}`;
      num = Rounder.scientificStrToNum(`${num}`)
    }
    this.num = num
  }

  static Round(num: number, decimalPlace: number): string {
    let isNegative: boolean = false;
    if (num < 0) {
      isNegative = true
      num = Math.abs(num)
    }
    decimalPlace < 0 ? decimalPlace = 0 : "";
    if (num === 0) {
      if (decimalPlace === 0) return "0";
      let str = '0.'
      for (let i = 0; i < decimalPlace; i++) {
        str += '0'
      }
      return str;
    }
    const judge = new decimal(num).mul(Math.pow(10, decimalPlace)).toNumber();
    if (Math.abs(judge) % 2 == 0.5) {
      const ret = Rounder.RoundDown(num, decimalPlace);
      return isNegative ? `-${ret}` : ret;
    } else {
      const ret = Rounder.RoundNormal(num, decimalPlace)
      return isNegative ? `-${ret}` : ret;
    }
  }

  static RoundDown(num: number, decimalPlace: number): string {
    let isNegative: boolean = false;
    if (num < 0) {
      isNegative = true
      num = Math.abs(num)
    }
    decimalPlace < 0 ? decimalPlace = 0 : "";
    if (num === 0) {
      if (decimalPlace === 0) return "0";
      let str = '0.'
      for (let i = 0; i < decimalPlace; i++) {
        str += '0'
      }
      return str;
    }
    let ret = `${num}`;
    const roundDownRet: number = Math.floor(Number(`${num}e${decimalPlace}`)) / Math.pow(10, decimalPlace);
    ret = roundDownRet.toFixed(decimalPlace);
    return isNegative ? `-${ret}` : ret;
  }

  static RoundNormal(num: number, decimalPlace: number): string {
    let isNegative: boolean = false;
    if (num < 0) {
      isNegative = true
      num = Math.abs(num)
    }
    if (num === 0) {
      if (Number(decimalPlace) === 0) return "0";
      let str = '0.'
      for (let i = 0; i < decimalPlace; i++) {
        str += '0'
      }
      return str;
    }
    decimalPlace < 0 ? decimalPlace = 0 : "";
    let ret = `${num}`;
    let roundNormalRet: number = Math.round(Number(`${num}e${decimalPlace}`)) / Math.pow(10, decimalPlace);
    ret = roundNormalRet.toFixed(decimalPlace);
    return isNegative ? `-${ret}` : ret;
  }

  /**
   * 
   * @param refNum 参考值 refference Num
   * @param realNum 样本值 sample Num
   * @returns Relative Error
   */
  static calcRE(refNum: number, realNum: number): number {
    return new decimal(realNum).minus(refNum).div(refNum).toNumber() * 100;
  }
  static calcAvg(...numList: number[]): number {
    numList = numList || [];
    let sum = new decimal(0);
    let count = 0;
    numList.forEach(num => {
      if (typeof +num != 'number') { console.debug('AVG: not a number'); return; }
      sum = sum.add(Number(num))
      count++;
    })
    return count != 0 ? sum.div(count).toNumber() : 0;
  }

  // Absolute Devitation
  static calcAD(numList: number[], refPos = 0) {
    const avg = Rounder.calcAvg(...numList);
    const AD = new decimal(numList[refPos]).minus(avg).toNumber();
    return AD;
  }

  // 两个值计算相对偏差，(a-b)/(a+b)
  static calc2RD(...numList: string[]): string {
    // if (refPos > numList.length - 1) throw Error(`refPos is not a valid position index for numList`);
    // const AD = Rounder.calcAD(numList, refPos);
    // const RD = new decimal(numList[refPos]).minus(AD)
    let a: string = '0';
    let b: string = '0';
    [a, b] = numList;
    const step1 = new decimal(a).minus(b).abs(); // a - b
    const step2 = new decimal(a).add(b); // a + b
    const RD: string = step1.div(step2).mul(100).toString(); // (a - b) / (a + b)
    return RD;
  }

  static calcSD(...numList: string[]): number {
    const _numList = numList.map((num) => Number(num));
    const avg = Rounder.calcAvg(..._numList);
    let xiMinusAvgPowSum = new decimal(0); // (xi - X-)2
    for (let i = 0; i < numList.length; i++) {
      const x = numList[i];
      const xiMinusAvgPow = new decimal(x).minus(avg).pow(2);
      xiMinusAvgPowSum = xiMinusAvgPowSum.add(xiMinusAvgPow);
    }
    const SD = new decimal(xiMinusAvgPowSum).div(numList.length - 1).pow(0.5).toNumber();
    return SD;

  }
  // RSD
  static calcRSD(...numList: string[]): string {
    const _numList = numList.map((num) => Number(num));
    const avg = Rounder.calcAvg(..._numList);
    // console.log(`avg : ${avg}`)
    const SD = Rounder.calcSD(...numList);
    // console.log(`SD : ${SD}`)
    // avg 与 SD 经过两次取值是否会有偏差？
    const RSD = new decimal(SD).div(avg).mul(100).toString();
    // console.log(`RSD : ${RSD}`)
    return RSD;
  }

  static scientificStrToNum(sciStr: string): number {
    const baseNumberMap = { "º": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9, "⁻¹": "-1", "⁻²": "-2", "⁻³": "-3", "⁻⁴": "-4", "⁻⁵": "-5", "⁻⁶": "-6", "⁻⁷": "-7", "⁻⁸": "-8", "⁻⁹": "-9" };
    if (sciStr.includes('×10')) {
      const [m, n] = sciStr.split('×10'); //m × 10n
      const retNum = new decimal(Number(m)).mul(decimal.pow(10, baseNumberMap[n])).toNumber();
      return retNum;
    } else {
      const num = Number(sciStr);
      if (!Number.isFinite(num)) {
        throw new Error(`[LabRounder] scientificStrToNum Error with ${sciStr}`);
      }
      return num;
    }
  }

  static numToScientificStr(num: number, validDigit: number): string {
    const supNumberMap = { 0: "º", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "-1": "⁻¹", "-2": "⁻²", "-3": "⁻³", "-4": "⁻⁴", "-5": "⁻⁵", "-6": "⁻⁶", "-7": "⁻⁷", "-8": "⁻⁸", "-9": "⁻⁹" }
    const splitString = Math.abs(num) >= 1 ? 'e+' : 'e';

    const expNum = num.toExponential(); // 0: 0e+0 , 1000: 1e+3 , 1210: 1.21e+3
    const [m, n] = expNum.toString().split(splitString); //m × 10n, 当num小于0时，m为负数，当num为小数时，n为负数
    // 修约到有效位数
    // 判断有效位数
    let ValidDigitNum = validDigit;
    if (Number(m) >= 1) {
      const strm = String(m);
      const [decimalBeforeNum] = strm.split('.');
      const decimalBeforeLen = decimalBeforeNum.length;
      ValidDigitNum = ValidDigitNum - decimalBeforeLen;
    }
    let roundedM: string = Number(Rounder.Round(Math.abs(Number(m)), ValidDigitNum)).toPrecision(validDigit);
    // num为负数的处理，加个负号
    num < 0 ? roundedM = `-${roundedM}` : '';
    const retStr: string = `${roundedM}×10${supNumberMap[n]}`;
    return retStr;
  }

  /**
     * 判断复核数值类型的字符串 / 数值
     * @param value 是否为一个有效的数据
     * @returns boolean
     */
  static isValidNumber(value: any): boolean {
    let ret: boolean = true;
    if (isNaN(+value)) {
      ret = false;
    }
    if (value == undefined) {
      ret = false;
    }
    if (value == null) {
      ret = false;
    }
    if (String(value).trim() == '') {
      ret = false;
    }
    return ret;
  }

  /**
   * 向下修约 可修约至`0.00`
   * @param decimalPlace 指定修约到第几小数位
   * @returns sting
   */
  roundDown(decimalPlace: number): string {
    return Rounder.RoundDown(Number(this.num), decimalPlace);
  }

  /**
   * 普通的四舍五入
   * @param {number} num 待修约的数
   * @param {number} precision 修约到的小数位数
   * @returns {number} 修约后的数
   */
  roundNormal(decimalPlace: number): string {
    return Rounder.RoundNormal(Number(this.num), decimalPlace);
  }

  /**
   * 四舍六入五成双修约法
   * @param {number} decimalPlace 指定修约到第几小数位数，应当大于等于0
   */
  round(decimalPlace: number): string {
    return Rounder.Round(Number(this.num), decimalPlace);
  }

  toString() {
    return `${this.num}`;
  }


  // /**
  //  * 科学技术法 a×10^b, a的取值区间（1≤|a|<10）
  //  * @param {number} validDigit 保留的有效位数
  //  * @returns 转换后的科学计数法字符串
  //  */
  // TOSCIENTIFIC(validDigit: number): string {
  //   const num: number = Number(this.num);
  //   // 原生科学计数法分隔符
  //   const splitString = Math.abs(num) >= 1 ? 'e+' : 'e';

  //   const expNum = num.toExponential(); // 0: 0e+0 , 1000: 1e+3 , 1210: 1.21e+3
  //   const [m, n] = expNum.toString().split(splitString); //m × 10n, 当num小于0时，m为负数，当num为小数时，n为负数
  //   // 修约到有效位数
  //   // 判断有效位数
  //   let ValidDigitNum = validDigit;
  //   if (Number(m) >= 1) {
  //     const strm = String(m);
  //     const [decimalBeforeNum] = strm.split('.');
  //     const decimalBeforeLen = decimalBeforeNum.length;
  //     ValidDigitNum = ValidDigitNum - decimalBeforeLen;
  //   }
  //   let roundedM = Number(this.round(Math.abs(Number(m)), ValidDigitNum)).toPrecision(validDigit);
  //   // num为负数的处理，加个负号
  //   num < 0 ? roundedM = -roundedM : '';
  //   const retStr = `${roundedM}×10${this.supNumberMap[n]}`;
  //   return retStr;
  // }

  // /**
  // * 将科学计数法转换为普通数字
  // * @param {String} sciNum 科学计数法字符串
  // * @returns 转换后的数字
  // */
  // SCIENTIFICTONUM(value: string): number {
  //   if (!`${value}`.includes('×10')) {
  //     return value;
  //   }
  //   const [m, n] = sciNum.split('×10'); //m × 10n
  //   const retNum = decimal(m).mul(decimal.pow(10, this.baseNumberMap[n])).toNumber();
  //   return retNum;
  // }


  // /**
  //  * 一元线性回归斜率b值计算
  //  * @param {Array} listx x轴的值
  //  * @param {Array} listy y轴的值
  //  * @param {number} precision 斜率的保留小数位
  //  * @returns {String}  y = a + bx   返回修约后的b
  //  */
  // SLOPE(listx, listy, precision = 2) {
  //   try {
  //     // const { table: list } = this.datasource;
  //     const xList = listx.filter(i => `${i}`.trim() != '');
  //     const yList = listy.filter(i => `${i}`.trim() != '');
  //     // 计算公式
  //     // https://baike.baidu.com/item/%E4%B8%80%E5%85%83%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92%E6%96%B9%E7%A8%8B
  //     const len = Math.min(xList.length, yList.length);
  //     const calcxList = xList.slice(0, len);
  //     const calcyList = yList.slice(0, len);
  //     const avgX = AVG(...calcxList);
  //     const avgY = AVG(...calcyList);
  //     let multiSum = decimal(0);
  //     let xMinusXAvgPow2Sum = decimal(0);
  //     for (let i = 0; i < len; i++) {
  //       const x = calcxList[i];
  //       const y = calcyList[i];
  //       const xMinusXAvg = decimal(x).minus(avgX);
  //       const yMinusYAvg = decimal(y).minus(avgY);
  //       const multi = xMinusXAvg.mul(yMinusYAvg);
  //       multiSum = multiSum.add(multi);

  //       const xMinusXAvgPow2 = decimal.pow(xMinusXAvg, 2);
  //       xMinusXAvgPow2Sum = xMinusXAvgPow2Sum.add(xMinusXAvgPow2);
  //     }

  //     const originB = multiSum.div(xMinusXAvgPow2Sum).toString();
  //     const roundedB = ROUND(originB, precision);

  //     console.debug(`SLOPE claculate`, 'xList:', xList, "yList", yList, "originRet", originB, "roundedB", roundedB);

  //     return roundedB || "";
  //   } catch (error) {
  //     console.debug('SLOPE claculate failed. ');
  //   }
  // }
  // /**
  //  * 一元线性回归截距a值计算
  //  * @param {Array} listx x轴的值
  //  * @param {Array} listy y轴的值
  //  * @param {number} precision 截距的保留小数位
  //  * @returns {String} y = a + bx   返回修约后的a
  //  */
  // INTERCEPT(listx, listy, precision = 2) {
  //   try {
  //     // const { table: list } = this.datasource;
  //     const xList = listx.filter(i => `${i}`.trim() != '');
  //     const yList = listy.filter(i => `${i}`.trim() != '');
  //     // 计算公式
  //     // https://baike.baidu.com/item/%E4%B8%80%E5%85%83%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92%E6%96%B9%E7%A8%8B
  //     const len = Math.min(xList.length, yList.length);
  //     const calcxList = xList.slice(0, len);
  //     const calcyList = yList.slice(0, len);
  //     const avgX = AVG(...calcxList);
  //     const avgY = AVG(...calcyList);
  //     let multiSum = decimal(0);
  //     let xMinusXAvgPow2Sum = decimal(0);
  //     for (let i = 0; i < len; i++) {
  //       const x = calcxList[i];
  //       const y = calcyList[i];
  //       const xMinusXAvg = decimal(x).minus(avgX);
  //       const yMinusYAvg = decimal(y).minus(avgY);
  //       const multi = xMinusXAvg.mul(yMinusYAvg);
  //       multiSum = multiSum.add(multi);

  //       const xMinusXAvgPow2 = decimal.pow(xMinusXAvg, 2);
  //       xMinusXAvgPow2Sum = xMinusXAvgPow2Sum.add(xMinusXAvgPow2);
  //     }

  //     const originB = multiSum.div(xMinusXAvgPow2Sum);
  //     const originA = decimal(avgY).minus(decimal(originB).mul(avgX)).toString();
  //     const roundedA = ROUND(originA, precision);
  //     console.debug(`INTERCEPT claculate`, 'xList:', calcxList, "yList", calcyList, "originB", originB, "roundedB", "originA", originA, "roundedA", roundedA);

  //     return roundedA || "";
  //   } catch (error) {
  //     console.debug('INTERCEPT claculate failed. ');
  //   }
  // }
  // /**
  //  * 返回两组数值的相关系数
  //  * @param {Array} listx x轴的值
  //  * @param {Array} listy y轴的值
  //  * @param {number} precision R值的保留小数位
  //  * @returns {String} 返回向下修约后的r
  //  */
  // CORREL(listx, listy, precision = 4) {
  //   try {
  //     const xList = listx.filter(i => `${i}`.trim() != '');
  //     const yList = listy.filter(i => `${i}`.trim() != '');
  //     // 计算公式
  //     // https://baike.baidu.com/item/%E4%B8%80%E5%85%83%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92%E6%96%B9%E7%A8%8B
  //     const len = Math.min(xList.length, yList.length);
  //     const calcxList = xList.slice(0, len);
  //     const calcyList = yList.slice(0, len);
  //     const avgX = AVG(...calcxList);
  //     const avgY = AVG(...calcyList);
  //     let xMinusXAvgMulyMinusYAvgSum = decimal(0);
  //     let xMinusXAvgPowSum = decimal(0);
  //     let yMinusYAvgPowSum = decimal(0);
  //     for (let i = 0; i < len; i++) {
  //       const x = calcxList[i];
  //       const y = calcyList[i];
  //       const xMinusXAvg = decimal(x).minus(avgX);
  //       const yMinusYAvg = decimal(y).minus(avgY);
  //       const xMinusXAvgMulyMinusYAvg = decimal(xMinusXAvg).mul(yMinusYAvg);
  //       xMinusXAvgMulyMinusYAvgSum = xMinusXAvgMulyMinusYAvgSum.add(xMinusXAvgMulyMinusYAvg);
  //       const xMinusXAvgPow = decimal.pow(xMinusXAvg, 2);
  //       xMinusXAvgPowSum = xMinusXAvgPowSum.add(xMinusXAvgPow);
  //       const yMinusYAvgPow = decimal.pow(yMinusYAvg, 2);
  //       yMinusYAvgPowSum = yMinusYAvgPowSum.add(yMinusYAvgPow);
  //     }
  //     const step1 = decimal.pow(xMinusXAvgPowSum, 0.5).mul(decimal.pow(yMinusYAvgPowSum, 0.5));
  //     const originR = xMinusXAvgMulyMinusYAvgSum.div(step1).abs().toString();
  //     const roundedR = roundDown(originR, precision);
  //     console.debug(`CORREL claculate`, 'xList:', calcxList, "yList", calcyList, "originR", originR, "roundedR", roundedR);
  //     return roundedR || "";
  //   } catch (error) {
  //     console.debug('CORREL claculate failed. ');
  //   }
  // }
}

export default Rounder;