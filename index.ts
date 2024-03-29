import decimal from "decimal.js";

class Rounder {
  num: number | string;
  scientificStr: string;
  isNegative: boolean = false;
  isZero: boolean = false;
  isScientificStr: boolean = false;

  constructor(num: number | string) {
    num = `${num}`.trim();
    if (`${num}`.includes(`×10`)) {
      this.isScientificStr = true;
      this.scientificStr = `${num}`;
      num = Rounder.scientificStrToNum(`${num}`);
    } else if (!Rounder.isValidNumber(num)) {
      num = 0;
    }
    if (!`${num}`.includes(`×10`) && +num < 0) this.isNegative = true;
    if (+num === 0) this.isZero = true;
    this.num = num;
  }

  static roundDown(num: number, decimalPlace: number): string {
    let isNegative: boolean = false;
    if (num < 0) {
      isNegative = true;
      num = Math.abs(num);
    }
    decimalPlace < 0 ? (decimalPlace = 0) : "";
    if (num === 0) {
      if (decimalPlace === 0) return "0";
      let str = "0.";
      for (let i = 0; i < decimalPlace; i++) {
        str += "0";
      }
      return str;
    }
    let ret = `${num}`;
    const roundDownRet: number =
      Math.floor(Number(`${num}e${decimalPlace}`)) / Math.pow(10, decimalPlace);
    ret = roundDownRet.toFixed(decimalPlace);
    return isNegative ? `-${ret}` : ret;
  }

  static roundNormal(num: number, decimalPlace: number): string {
    let isNegative: boolean = false;
    if (num < 0) {
      isNegative = true;
      num = Math.abs(num);
    }
    if (num === 0) {
      if (Number(decimalPlace) === 0) return "0";
      let str = "0.";
      for (let i = 0; i < decimalPlace; i++) {
        str += "0";
      }
      return str;
    }
    decimalPlace < 0 ? (decimalPlace = 0) : "";
    let ret = `${num}`;
    let roundNormalRet: number =
      Math.round(Number(`${num}e${decimalPlace}`)) / Math.pow(10, decimalPlace);
    ret = roundNormalRet.toFixed(decimalPlace);
    return isNegative ? `-${ret}` : ret;
  }

  static roundHalfToEven(num: number, decimalPlace: number): string {
    let isNegative: boolean = false;
    if (num < 0) {
      isNegative = true;
      num = Math.abs(num);
    }
    decimalPlace < 0 ? (decimalPlace = 0) : "";
    if (num === 0) {
      if (decimalPlace === 0) return "0";
      let str = "0.";
      for (let i = 0; i < decimalPlace; i++) {
        str += "0";
      }
      return str;
    }
    const judge = new decimal(num).mul(Math.pow(10, decimalPlace)).toNumber();
    if (Math.abs(judge) % 2 == 0.5) {
      const ret = Rounder.roundDown(num, decimalPlace);
      return isNegative ? `-${ret}` : ret;
    } else {
      const ret = Rounder.roundNormal(num, decimalPlace);
      return isNegative ? `-${ret}` : ret;
    }
  }

  static roundSignificantDigit(num: string | number, digit: number): string {
    if (Number(digit) <= 0) return `${num}`;

    let isNegtive = false
    if (Number(num) < 0) {
      isNegtive = true
      num = Math.abs(Number(num));
    } else if (Number(num) == 0) {
      if (digit === 0) return '0'
      let str = '0.'
      for (let i = 0; i < digit; i++) {
        str = str + '0'
      }
      return str
    }
    /**先对数字进行四舍五入到个位数，判断修约后的数字是否符合有效位要求 */
    const firstRound = Rounder.roundNormal(Number(num), 0);
    const firstRoundDecimalBeforeLen = decimal.log10(Math.abs(Number(firstRound))).floor().toNumber() + 1;
    /**如果正好等于有效位 返回 */
    if (firstRoundDecimalBeforeLen == Number(digit) && Number(firstRound) == Math.pow(10, digit - 1)) {
      return firstRound;
    }
    /**如果数字已经有足够有效位，直接转科学记数法 */
    if (Number(digit) < firstRoundDecimalBeforeLen) {
      return Rounder.numToScientificStr(Number(num), digit);
    }
    /**上述是数字修约到个位数时，有效位>=的情况，以下是数字的有效位不足指定的有效位的情况 */
    // decimalBeforeLen是判断数字个位以上的数字个数，如123->3, 123.32233->3
    const decimalBeforeLen = decimal.log10(Math.abs(Number(num))).floor().toNumber() + 1;
    // 缩放数字到修约位
    const scale = new decimal(num).mul(decimal.pow(10, Number(digit) - decimalBeforeLen)).toNumber();
    const scaleRounded = Rounder.roundNormal(scale, 0)
    // 复原缩放的数字
    const rounded = new decimal(scaleRounded).div(Math.pow(10, Number(digit) - decimalBeforeLen)).toString();
    // 修约后的位数,数字修约后的位数决定了数字最终要保留的位数，如9.99修约到有效位2位，结果位10
    const roundeddecimalBeforeLen = decimal.log10(Math.abs(Number(rounded))).floor().toNumber() + 1;
    // 最终保留小数位
    const roundPosDigit = digit - roundeddecimalBeforeLen;

    let ret: string = `${rounded}`;
    if (roundPosDigit < 0) {
      ret = Rounder.numToScientificStr(Number(rounded), digit)
    } else {
      ret = Rounder.roundHalfToEven(Number(rounded), roundPosDigit)
    }

    return isNegtive ? `-${ret}` : ret;
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
    numList.forEach((num) => {
      if (typeof +num != "number") {
        console.debug("AVG: not a number");
        return;
      }
      sum = sum.add(Number(num));
      count++;
    });
    return count != 0 ? sum.div(count).toNumber() : 0;
  }

  // Absolute Devitation
  static calcAD(numList: number[], refPos = 0) {
    const avg = Rounder.calcAvg(...numList);
    const AD = new decimal(numList[refPos]).minus(avg).toNumber();
    return AD;
  }

  // mean deviation 简单平均偏差
  static calcMD(...numList: number[]): string {
    const avg = Rounder.calcAvg(...numList);
    let subSum = 0;
    for (let i = 0; i < numList.length; i++) {
      const num = numList[i];
      const sub = new decimal(num).minus(avg).abs().toNumber();
      subSum += sub;
    }
    const MD = new decimal(subSum).div(numList.length).toString();
    return MD;
  }

  // 两个值计算相对偏差，(a-b)/(a+b)
  static calc2RD(...numList: string[]): string {
    // if (refPos > numList.length - 1) throw Error(`refPos is not a valid position index for numList`);
    // const AD = Rounder.calcAD(numList, refPos);
    // const RD = new decimal(numList[refPos]).minus(AD)
    let a: string = "0";
    let b: string = "0";
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
    const SD = new decimal(xiMinusAvgPowSum)
      .div(numList.length - 1)
      .pow(0.5)
      .toNumber();
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
    const baseNumberMap = {
      º: 0,
      "¹": 1,
      "²": 2,
      "³": 3,
      "⁴": 4,
      "⁵": 5,
      "⁶": 6,
      "⁷": 7,
      "⁸": 8,
      "⁹": 9,
      "⁻¹": "-1",
      "⁻²": "-2",
      "⁻³": "-3",
      "⁻⁴": "-4",
      "⁻⁵": "-5",
      "⁻⁶": "-6",
      "⁻⁷": "-7",
      "⁻⁸": "-8",
      "⁻⁹": "-9",
      "⁻": "-",
    };
    if (sciStr.includes("×10")) {
      const [m, n] = sciStr.split("×10"); //m × 10n
      const strN = `${n}`;
      let supN = "";
      for (let i = 0; i < strN.length; i++) {
        const str = strN[i];
        supN += baseNumberMap[str];
      }
      const retNum = new decimal(Number(m))
        .mul(decimal.pow(10, supN))
        .toNumber();
      return retNum;
    } else {
      const num = Number(sciStr);
      if (!Number.isFinite(num)) {
        throw new Error(`[LabRounder] scientificStrToNum Error with ${sciStr}`);
      }
      return num;
    }
  }

  static numToScientificStr(num: number, digit: number): string {
    const supNumberMap = {
      0: "º",
      1: "¹",
      2: "²",
      3: "³",
      4: "⁴",
      5: "⁵",
      6: "⁶",
      7: "⁷",
      8: "⁸",
      9: "⁹",
      "-1": "⁻¹",
      "-2": "⁻²",
      "-3": "⁻³",
      "-4": "⁻⁴",
      "-5": "⁻⁵",
      "-6": "⁻⁶",
      "-7": "⁻⁷",
      "-8": "⁻⁸",
      "-9": "⁻⁹",
      "-": "⁻",
    };
    const splitString = Math.abs(num) >= 1 ? "e+" : "e";

    const expNum = num.toExponential(); // 0: 0e+0 , 1000: 1e+3 , 1210: 1.21e+3
    const [m, n] = expNum.toString().split(splitString); //m × 10n, 当num小于0时，m为负数，当num为小数时，n为负数
    // 修约到有效位数
    // 判断有效位数
    let ValidDigitNum = digit;
    if (Number(m) >= 1) {
      const strm = String(m);
      const [decimalBeforeNum] = strm.split(".");
      const decimalBeforeLen = decimalBeforeNum.length;
      ValidDigitNum = ValidDigitNum - decimalBeforeLen;
    }
    let roundedM: string = Number(
      Rounder.roundHalfToEven(Math.abs(Number(m)), ValidDigitNum)
    ).toPrecision(digit);
    // num为负数的处理，加个负号
    num < 0 ? (roundedM = `-${roundedM}`) : "";
    let sup = ``;
    let strN = `${n}`;
    for (let i = 0; i < strN.length; i++) {
      const str = strN[i];
      console.log(str);
      sup += supNumberMap[str];
    }
    const retStr: string = `${roundedM}×10${sup}`;
    return retStr;
  }

  /**
   * 判断复核数值类型的字符串 / 数值
   * @param num 是否为一个有效的数据
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
    if (String(value).trim() == "") {
      ret = false;
    }
    return ret;
  }

  /**
   * 一元线性回归斜率b值计算
   * @param {Array} listx x轴的值
   * @param {Array} listy y轴的值
   * @param {number} precision 斜率的保留小数位
   * @returns {String}  y = a + bx   返回修约后的b
   */
  static calcSlope(listx, listy, precision = 2) {
    try {
      const xList = listx.filter((i) => `${i}`.trim() != "");
      const yList = listy.filter((i) => `${i}`.trim() != "");
      // 计算公式
      // https://baike.baidu.com/item/%E4%B8%80%E5%85%83%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92%E6%96%B9%E7%A8%8B
      const len = Math.min(xList.length, yList.length);
      const calcxList = xList.slice(0, len);
      const calcyList = yList.slice(0, len);
      const avgX = Rounder.calcAvg(...calcxList);
      const avgY = Rounder.calcAvg(...calcyList);
      let multiSum = new decimal(0);
      let xMinusXAvgPow2Sum = new decimal(0);
      for (let i = 0; i < len; i++) {
        const x = calcxList[i];
        const y = calcyList[i];
        const xMinusXAvg = new decimal(x).minus(avgX);
        const yMinusYAvg = new decimal(y).minus(avgY);
        const multi = xMinusXAvg.mul(yMinusYAvg);
        multiSum = multiSum.add(multi);

        const xMinusXAvgPow2 = decimal.pow(xMinusXAvg, 2);
        xMinusXAvgPow2Sum = xMinusXAvgPow2Sum.add(xMinusXAvgPow2);
      }

      const originB = multiSum.div(xMinusXAvgPow2Sum).toString();
      const roundedB = Rounder.roundHalfToEven(+originB, precision);

      return roundedB || "";
    } catch (error) {
      console.debug(
        "SLOPE claculate failed. ",
        "listx: ",
        listx,
        "listy: ",
        listy,
        precision
      );
    }
  }

  /**
   * 一元线性回归截距a值计算
   * @param {Array} listx x轴的值
   * @param {Array} listy y轴的值
   * @param {number} precision 截距的保留小数位
   * @returns {String} y = a + bx   返回修约后的a
   */
  static calcIntercept(listx, listy, precision = 2) {
    try {
      // const { table: list } = this.datasource;
      const xList = listx.filter((i) => `${i}`.trim() != "");
      const yList = listy.filter((i) => `${i}`.trim() != "");
      // 计算公式
      // https://baike.baidu.com/item/%E4%B8%80%E5%85%83%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92%E6%96%B9%E7%A8%8B
      const len = Math.min(xList.length, yList.length);
      const calcxList = xList.slice(0, len);
      const calcyList = yList.slice(0, len);
      const avgX = Rounder.calcAvg(...calcxList);
      const avgY = Rounder.calcAvg(...calcyList);
      let multiSum = new decimal(0);
      let xMinusXAvgPow2Sum = new decimal(0);
      for (let i = 0; i < len; i++) {
        const x = calcxList[i];
        const y = calcyList[i];
        const xMinusXAvg = new decimal(x).minus(avgX);
        const yMinusYAvg = new decimal(y).minus(avgY);
        const multi = xMinusXAvg.mul(yMinusYAvg);
        multiSum = multiSum.add(multi);

        const xMinusXAvgPow2 = decimal.pow(xMinusXAvg, 2);
        xMinusXAvgPow2Sum = xMinusXAvgPow2Sum.add(xMinusXAvgPow2);
      }

      const originB = multiSum.div(xMinusXAvgPow2Sum);
      const originA = new decimal(avgY)
        .minus(new decimal(originB).mul(avgX))
        .toString();
      const roundedA = Rounder.roundHalfToEven(+originA, precision);

      return roundedA || "";
    } catch (error) {
      console.debug(
        `INTERCEPT claculate`,
        "xList: ",
        listx,
        "yList: ",
        listy,
        "precision: ",
        precision
      );
    }
  }

  /**
   * 返回两组数值的相关系数
   * @param {Array} listx x轴的值
   * @param {Array} listy y轴的值
   * @param {number} precision R值的保留小数位
   * @returns {String} 返回向下修约后的r
   */
  static calcCorrel(listx, listy, precision = 4) {
    try {
      const xList = listx.filter((i) => `${i}`.trim() != "");
      const yList = listy.filter((i) => `${i}`.trim() != "");
      // 计算公式
      // https://baike.baidu.com/item/%E4%B8%80%E5%85%83%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92%E6%96%B9%E7%A8%8B
      const len = Math.min(xList.length, yList.length);
      const calcxList = xList.slice(0, len);
      const calcyList = yList.slice(0, len);
      const avgX = Rounder.calcAvg(...calcxList);
      const avgY = Rounder.calcAvg(...calcyList);
      let xMinusXAvgMulyMinusYAvgSum = new decimal(0);
      let xMinusXAvgPowSum = new decimal(0);
      let yMinusYAvgPowSum = new decimal(0);
      for (let i = 0; i < len; i++) {
        const x = calcxList[i];
        const y = calcyList[i];
        const xMinusXAvg = new decimal(x).minus(avgX);
        const yMinusYAvg = new decimal(y).minus(avgY);
        const xMinusXAvgMulyMinusYAvg = new decimal(xMinusXAvg).mul(yMinusYAvg);
        xMinusXAvgMulyMinusYAvgSum = xMinusXAvgMulyMinusYAvgSum.add(
          xMinusXAvgMulyMinusYAvg
        );
        const xMinusXAvgPow = decimal.pow(xMinusXAvg, 2);
        xMinusXAvgPowSum = xMinusXAvgPowSum.add(xMinusXAvgPow);
        const yMinusYAvgPow = decimal.pow(yMinusYAvg, 2);
        yMinusYAvgPowSum = yMinusYAvgPowSum.add(yMinusYAvgPow);
      }
      const step1 = decimal
        .pow(xMinusXAvgPowSum, 0.5)
        .mul(decimal.pow(yMinusYAvgPowSum, 0.5));
      const originR = xMinusXAvgMulyMinusYAvgSum.div(step1).abs().toString();
      const roundedR = Rounder.roundDown(+originR, precision);

      return roundedR || "";
    } catch (error) {
      console.debug(
        `CORREL claculate`,
        "xList:",
        listx,
        "yList",
        listy,
        "precision",
        precision
      );
    }
  }

  /**
   * 向下修约 可修约至`0.00`
   * @param decimalPlace 指定修约到第几小数位
   * @returns sting
   */
  roundDown(decimalPlace: number): string {
    return Rounder.roundDown(Number(this.num), decimalPlace);
  }

  /**
   * 普通的四舍五入
   * @param {number} num 待修约的数
   * @param {number} precision 修约到的小数位数
   * @returns {number} 修约后的数
   */
  roundNormal(decimalPlace: number): string {
    return Rounder.roundNormal(Number(this.num), decimalPlace);
  }

  /**
   * 四舍六入五成双修约法
   * @param {number} decimalPlace 指定修约到第几小数位数，应当大于等于0
   */
  roundHalfToEven(decimalPlace: number): string {
    return Rounder.roundHalfToEven(Number(this.num), decimalPlace);
  }

  /**
   * 将一个数字修约到有效位
   * @param {number} validDigit 有效位必须大于等于1 !!
   */
  roundSignificantDigit(validDigit: number = 1): string {
    return Rounder.roundSignificantDigit(this.num, validDigit);
  }

  tostr() {
    return `${this.num}`;
  }
}

export default Rounder;
