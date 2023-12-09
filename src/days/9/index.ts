import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  return input
    .map((line) => {
      const numbers = line.split(' ').map(Number);

      return determineNextNumber(numbers);
    })
    .reduce((a, b) => a + b);
};

export const part2: Solver = (input) => {
  return input
    .map((line) => {
      const numbers = line.split(' ').map(Number);

      return determinePreviousNumber(numbers);
    })
    .reduce((a, b) => a + b);
};

function determineNextNumber(line: readonly number[]): number {
  const diffs = calculateSteps(line);

  const allZeroes = diffs.every((num) => num === 0);

  const lastNum = line.at(-1)!;

  if (!allZeroes) {
    return determineNextNumber(diffs) + lastNum;
  }

  return lastNum + diffs.at(-1)!;
}

function determinePreviousNumber(line: readonly number[]): number {
  const diffs = calculateSteps(line);

  const allZeroes = diffs.every((num) => num === 0);

  const firstNum = line.at(0)!;

  if (!allZeroes) {
    return firstNum - determinePreviousNumber(diffs);
  }

  return firstNum - diffs.at(0)!;
}

function calculateSteps(numbers: readonly number[]): number[] {
  return numbers
    .map((num, index, self) => {
      const nextNum = self.at(index + 1);
      if (nextNum === undefined) {
        return Number.MIN_SAFE_INTEGER;
      }

      return nextNum - num;
    })
    .filter((num) => num !== Number.MIN_SAFE_INTEGER);
}
