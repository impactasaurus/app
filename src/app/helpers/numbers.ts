export function precisionRound(num: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

/**
 * Simple sum function that sums the numbers in a number[]
 * undefined elements are skipped.
 * If all elements in the array are undefined then zero is returned.
 */

export function sum(numArray: number[]): number {
  let total = 0;
  for (const num of numArray) {
    if (num !== undefined) {
      total += num;
    }
  }
  return total;
}

/**
 * Simple average function that computes the arithmetic mean
 * of numbers in a number[].
 * Counts the number of valid values i.e. values that are not undefined
 * and divides the sum of the numbers by that count.
 * if an empty array is passed then 0 is returned.
 */

export function average(numArray: number[]): number {
  if (numArray.length === 0) {
    return 0;
  }
  const arraySum = sum(numArray);
  let validValues = 0; // number of cells that are not undefined
  for (const num of numArray) {
    if (num !== undefined) {
      validValues += 1;
    }
  }

  if (validValues === 0) {
    return 0; // to avoid dividing by zero in case all cells are undefined
  }
  return arraySum / validValues;
}
