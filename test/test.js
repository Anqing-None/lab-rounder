import { strictEqual } from 'assert';
// import { describe } from 'node:test';
import Rounder from '../index.umd.js';
import decimal from 'decimal.js'



describe("labRounder", function () {

  /**-----------static method--------- */
  describe('Rounder.RoundDown', () => {
    it('RoundDown(0,0) -> 0', () => {
      const r = Rounder.RoundDown(0, 0);
      strictEqual(r, '0')
    })
    it('RoundDown(0.0,0) -> 0', () => {
      const r = Rounder.RoundDown(0.0, 0);
      strictEqual(r, '0')
    })

    it('RoundDown(0,2) -> 0.00', () => {
      const r = Rounder.RoundDown(0, 2);
      strictEqual(r, '0.00')
    })
    it('RoundDown(-0.123,2) -> -0.12', () => {
      const r = Rounder.RoundDown(-0.123, 2);
      strictEqual(r, '-0.12')
    })
    it('RoundDown(0.123,2) -> 0.12', () => {
      const r = Rounder.RoundDown(0.123, 2);
      strictEqual(r, '0.12')
    })
    it('RoundDown(0.129,2) -> 0.12', () => {
      const r = Rounder.RoundDown(0.129, 2);
      strictEqual(r, '0.12')
    })
  })

  describe('Rounder.RoundNormal', () => {
    it('RoundNormal(0,0) -> 0', () => {
      const r = Rounder.RoundNormal(0, 0);
      strictEqual(r, '0')
    })
    it('RoundNormal(0.0,0) -> 0', () => {
      const r = Rounder.RoundNormal(0.0, 0);
      strictEqual(r, '0')
    })

    it('RoundNormal(0,2) -> 0.00', () => {
      const r = Rounder.RoundNormal(0, 2);
      strictEqual(r, '0.00')
    })
    it('RoundNormal(-0.125,2) -> -0.13', () => {
      const r = Rounder.RoundNormal(-0.125, 2);
      strictEqual(r, '-0.13')
    })
    it('RoundNormal(0.12499,2) -> 0.12', () => {
      const r = Rounder.RoundNormal(0.12499, 2);
      strictEqual(r, '0.12')
    })
    it('RoundNormal(0.129,2) -> 0.13', () => {
      const r = Rounder.RoundNormal(0.129, 2);
      strictEqual(r, '0.13')
    })
  })

  describe('Rounder.Round', () => {
    it('Round(0,0) -> 0', () => {
      const r = Rounder.Round(0, 0);
      strictEqual(r, '0')
    })
    it('Round(0.0,0) -> 0', () => {
      const r = Rounder.Round(0.0, 0);
      strictEqual(r, '0')
    })

    it('Round(0,2) -> 0.00', () => {
      const r = Rounder.Round(0, 2);
      strictEqual(r, '0.00')
    })
    it('Round(-0.125,2) -> -0.12', () => {
      const r = Rounder.Round(-0.125, 2);
      strictEqual(r, '-0.12')
    })
    it('Round(0.12499,2) -> 0.12', () => {
      const r = Rounder.Round(0.12499, 2);
      strictEqual(r, '0.12')
    })
    it('Round(0.125,2) -> 0.12', () => {
      const r = Rounder.Round(0.125, 2);
      strictEqual(r, '0.12')
    })
    it('Round(0.1251,2) -> 0.13', () => {
      const r = Rounder.Round(0.1251, 2);
      strictEqual(r, '0.13')
    })
    it('Round(0.135,2) -> 0.14', () => {
      const r = Rounder.Round(0.135, 2);
      strictEqual(r, '0.14')
    })
    it('Round(0.1351,2) -> 0.14', () => {
      const r = Rounder.Round(0.1351, 2);
      strictEqual(r, '0.14')
    })
    it('Round(0.145,2) -> 0.14', () => {
      const r = Rounder.Round(0.145, 2);
      strictEqual(r, '0.14')
    })
    it('Round(0.1451,2) -> 0.15', () => {
      const r = Rounder.Round(0.1451, 2);
      strictEqual(r, '0.15')
    })
  })

  describe('Rounder.numToScientificStr', () => {
    it('numToScientificStr(1000.123, 2) -> 1.0×10³', () => {
      const r = Rounder.numToScientificStr(1000.123, 2);
      strictEqual(r, '1.0×10³')
    })
    it('numToScientificStr(1050, 2) -> 1.0×10³', () => {
      const r = Rounder.numToScientificStr(1050, 2);
      strictEqual(r, '1.0×10³')
    })
    it('numToScientificStr(1150, 2) -> 1.2×10³', () => {
      const r = Rounder.numToScientificStr(1150, 2);
      strictEqual(r, '1.2×10³')
    })
    it('numToScientificStr(1050,3) -> 1.05×10³', () => {
      const r = Rounder.numToScientificStr(1050, 3);
      strictEqual(r, '1.05×10³')
    })
    it('numToScientificStr(1150, 3) -> 1.15×10³', () => {
      const r = Rounder.numToScientificStr(1150, 3);
      strictEqual(r, '1.15×10³')
    })
    it('numToScientificStr(100000000000000, 3) -> 1.00×10¹³', () => {
      const r = Rounder.numToScientificStr(10000000000000, 3);
      strictEqual(r, '1.00×10¹³')
      const r2 = Rounder.numToScientificStr(0.0000000000001, 3)
      strictEqual(r2, '1.00×10⁻¹³')

    })

  })

  describe('Rounder.scientificStrToNum', () => {
    it('scientificStrToNum(1.03×10³) -> 1030', () => {
      const r = Rounder.scientificStrToNum('1.03×10³');
      strictEqual(r, 1030)
    })

    it('scientificStrToNum(1.00×10¹³) -> 10000000000000', () => {
      const r = Rounder.scientificStrToNum('1.00×10¹³');
      strictEqual(r, 10000000000000)
      const r2 = Rounder.scientificStrToNum('1.00×10⁻¹³')
      strictEqual(r2, 0.0000000000001)
    })

  })

  describe('Rounder.calcRSD', () => {
    it('calcRSD(...[]) -> 1.5 ', () => {
      const numList = [10.1, 10.2, 10.3, 10.4, 10.5];
      const r = Rounder.calcRSD(...numList); // 52.7
      const roundR = new Rounder(r).round(1);
      strictEqual(roundR, '1.5')
    })

    it('calcRSD(...[]) -> 52.7', () => {
      const numList = [0.1, 0.2, 0.3, 0.4, 0.5];
      const r = Rounder.calcRSD(...numList); // 52.7
      const roundR = new Rounder(r).round(1);
      strictEqual(roundR, '52.7')
    })

    it('calcRSD(...[]) -> 47.1', () => {
      const numList = [1, 2]
      const r = Rounder.calcRSD(...numList);
      const roundR = new Rounder(r).round(1);
      strictEqual(roundR, '47.1')
    })
  })


  describe('Rounder.calcRE', () => {
    it('calcRE([1,2]) -> 100 ', () => {
      const [refNum, realNum] = [1, 2];
      const r = Rounder.calcRE(refNum, realNum);
      // const roundR = new Rounder(r).round(1);
      strictEqual(r, 100)
    })

    it('calcRE([0.1,0.5]) -> 400', () => {
      const [refNum, realNum] = [0.1, 0.5, 0.3, 0.4, 0.5];
      const r = Rounder.calcRE(refNum, realNum);
      // const r = Rounder.calcRE(...numList);
      // const roundR = new Rounder(r).round(1);
      strictEqual(r, 400)
    })
  })

  describe('Rounder.calc2RD', () => {
    it('calc2RD([1,2]) -> 33.3 ', () => {
      const numList = [1, 2];
      const r = Rounder.calc2RD(...numList);
      const roundR = new Rounder(r).round(1);
      strictEqual(roundR, '33.3')
    })

    it('calc2RD([0.1,0.5]) -> 66.7', () => {
      const numList = [0.1, 0.5]
      const r = Rounder.calc2RD(...numList);
      const roundR = new Rounder(r).round(1);
      strictEqual(roundR, '66.7')
    })
  })

  /**---------class method----------- */
  describe('new Rounder(num).round(n)', () => {
    it(
      `
      0.1451 round(0) -> 0,
      0.1451 round(1) -> 0.1,
      0.1451 round(2) -> 0.15,
      0.1451 round(3) -> 0.145,
      0.1451 round(4) -> 0.1451,
      0.1451 round(5) -> 0.14510,
      
      `
      , () => {
        const r = new Rounder(0.1451)
        strictEqual(r.round(0), '0')
        strictEqual(r.round(1), '0.1')
        strictEqual(r.round(2), '0.15')
        strictEqual(r.round(3), '0.145')
        strictEqual(r.round(4), '0.1451')
        strictEqual(r.round(5), '0.14510')
      })
  })

});
