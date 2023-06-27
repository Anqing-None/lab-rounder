# What is lab-rounder?
lab-rounder is a rounding tool. You can see the definition in wikipedia about [Rounding](https://en.wikipedia.org/wiki/Rounding).
> Rounding means replacing a number with an approximate value that has a shorter, simpler, or more explicit representation.

"Rounding half to even" method is a special way to round numbers. It is often used in laboratory and Statistics.

> This variant of the round-to-nearest method is also called convergent rounding, statistician's rounding, Dutch rounding, Gaussian rounding, odd–even rounding, or bankers' rounding.

lab-rounder is a implementation of the "Rounding half to even" using JS language. And it alse has some statistical calculate methods.

# How to use?

1. install lab-rounder through npm

```bash
npm i lab-rounder
```

2. import lab-rounder in your project

```js
import Rounder from 'lab-rounder'

Rounder.roundHalfToEven('23.5', 0) // 24
Rounder.roundHalfToEven('24.5', 0) // 24
Rounder.roundHalfToEven('25.5', 0) // 26

```

## Transfer number format methods
### roundDown
```js
import Rounder from 'lab-rounder'

Rounder.roundDown('23.5', 0) // 23
```
### roundNormal
```js
import Rounder from 'lab-rounder'

Rounder.roundNormal('23.5', 0) // 23.4
Rounder.roundNormal('23.49', 0) // 23
```

### roundHalfToEven
```js
import Rounder from 'lab-rounder'

Rounder.roundHalfToEven('23.5', 0) // 24
Rounder.roundHalfToEven('24.5', 0) // 24
Rounder.roundHalfToEven('25.5', 0) // 26
```

### roundSignificantDigit
Round a number to a certain position of significant digit. You can see the the definition in wikipedia about [Significant_figures](https://en.wikipedia.org/wiki/Significant_figures).
`Rounder.roundSignificantDigit(number, digit)` method use roundHalfToEven to round numbers. If number's significant digits bigger than digit, Rounder will transfer your number to scientific string.
```js
import Rounder from 'lab-rounder'

Rounder.roundSignificantDigit('1000', 2) // 1.0×10³
Rounder.roundSignificantDigit('999', 2); // 1.0×10³
Rounder.roundSignificantDigit('9999', 5); // 9.9990×10³
```

### numToScientificStr
Transfer a number to scientific string depend on the follow charactor.
`Rounder.numToScientificStr(number, digit)` method use roundHalfToEven to round numbers.
```js
// baseNumberMap = { "º": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9, "⁻¹": "-1", "⁻²": "-2", "⁻³": "-3", "⁻⁴": "-4", "⁻⁵": "-5", "⁻⁶": "-6", "⁻⁷": "-7", "⁻⁸": "-8", "⁻⁹": "-9" };

// supNumberMap = { 0: "º", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "-1": "⁻¹", "-2": "⁻²", "-3": "⁻³", "-4": "⁻⁴", "-5": "⁻⁵", "-6": "⁻⁶", "-7": "⁻⁷", "-8": "⁻⁸", "-9": "⁻⁹" }

import Rounder from 'lab-rounder'
Rounder.numToScientificStr(1000.123, 2) // 1.0×10³
```

### scientificStrToNum
Transfer a scientific string to a number.
```js
import Rounder from 'lab-rounder'

Rounder.numToScientificStr('1.0×10³') // 1000
```

## statistical calculation methods

### calcAvg
Calculate average of a list of numbers.

```js
const nums = [1, 2, 3, 4]
Rounder.calcAvg(...nums) // 2.5
```

### calcRSD
Calculate relative standard deviation (RSD).

```js
const numList = [10.1, 10.2, 10.3, 10.4, 10.5];
Rounder.calcRSD(numList) // 1.5

```

### calcSlope
Calculate one-dimensional linear regression curve's slope

```js
const listx = [1, 2, 3, 4];
const listy = [1, 2, 3, 4];
Rounder.calcSlope(listx, listy, precision = 2) // 1.00
```

