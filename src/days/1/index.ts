import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  return sumCalibrationValues(
    input.map((line) => {
      const digits = [...(line.match(/\d/g) ?? [])].map(Number);

      return [digits.at(0)!, digits.at(-1)!];
    })
  );
};

export const part2: Solver = (input) => {
  return sumCalibrationValues(input.map(getCalibrationValueFromLine));
};

const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'] as const;

// Combine number words with their numeric values: [one, two, ... nine, 1, 2, ... 9]
const needles = numbers.flatMap((num, index) => [num, String(index + 1)]);

type FindNeedleResult = {
  needle: string;
  index: number;
};

function getCalibrationValueFromLine(line: string): [number, number] {
  const matches = needles
    .flatMap((needle) => {
      // Determine the first and last indexes of the needle in a string, for example:
      // Input: eightwothree
      // Output: { needle: 'eight', firstIndex: 0, lastIndex: 0 }

      const firstIndex = line.indexOf(needle);
      const lastIndex = line.lastIndexOf(needle);

      // This number wasn't found at all
      if (firstIndex === -1 && lastIndex === -1) {
        return;
      }

      const needleAsNum = Number.isNaN(+needle) ? String(numbers.indexOf(needle) + 1) : needle;
      return {
        needle: needleAsNum,
        firstIndex,
        lastIndex,
      };
    })
    .filter(Boolean)
    .reduce<{ needle: string; first: FindNeedleResult; last: FindNeedleResult }>(
      (results, { needle, firstIndex, lastIndex }) => {
        // Determine the left-most and right-most numbers found by taking the min and max indexes
        // of all the needle results we found earlier

        if (firstIndex < results.first.index) {
          results.first.needle = needle;
          results.first.index = firstIndex;
        }

        if (lastIndex > results.last.index) {
          results.last.needle = needle;
          results.last.index = lastIndex;
        }

        return results;
      },
      {
        // We need a baseline to compare against, which we can use the extreme values possible for
        needle: '',
        first: { needle: '', index: Number.MAX_SAFE_INTEGER },
        last: { needle: '', index: Number.MIN_SAFE_INTEGER },
      }
    );

  return [+matches.first.needle, +matches.last.needle];
}

function sumCalibrationValues(digits: ReadonlyArray<[number, number]>): number {
  return digits
    .map(([leftDigit, rightDigit]): number => {
      return Number(`${leftDigit}${rightDigit}`);
    })
    .reduce((a, b) => a + b, 0);
}
