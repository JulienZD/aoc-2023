 import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  const results: number[] = [];

  for (let i = 0; i < input.length; i++) {
    const currentLine = input[i]!;
    const lineAbove = input[i - 1];
    const lineBelow = input[i + 1];

    const partNumbers = getPartNumbers(currentLine, lineBelow, lineAbove);

    if (!partNumbers.length) {
      continue;
    }

    results.push(...partNumbers);
  }

  return results.reduce((a, b) => a + b, 0);
};

export const part2: Solver = (input) => {
  return 'todo';
};

const SYMBOLS = ['*', '$', '#', '%', '@', '&', '-', '+', '=', '/'];

function getPartNumbers(currentLine: string, lineBelow = '', lineAbove = ''): number[] {
  const numberIndexes = currentLine
    .split('')
    .map((char, index) => {
      if (isNumber(char)) {
        return index;
      }

      return -1;
    })
    .filter((index) => index !== -1);

  const symbolIndexes = [currentLine, lineBelow, lineAbove]
    .flatMap((line) => {
      return line.split('').map((char, index) => {
        if (SYMBOLS.includes(char)) {
          return index;
        }

        return -1;
      });
    })
    .filter((index) => index !== -1);

  const numbersIndexesWithAdjecentSymbols = numberIndexes.filter((numIndex) => {
    return symbolIndexes.some((symbolIndex) => {
      return symbolIndex === numIndex || numIndex + 1 === symbolIndex || numIndex - 1 === symbolIndex;
    });
  });

  const numberStartEndPositions = numbersIndexesWithAdjecentSymbols
    .map((numIndex) => findStartAndEndPosOfNumber(numIndex, currentLine))
    .filter((results) => results.length)
    .filter(([start, end], index, self) => {
      const otherIndex = self.findIndex(([otherStart, otherEnd]) => {
        return otherStart === start && otherEnd === end;
      });

      return otherIndex === index;
    });

  return numberStartEndPositions.map(([start, end]) => Number(currentLine.slice(start, end + 1)));
}

function isNumber(char?: string): boolean {
  return !char ? false : Number.isInteger(+char);
}

function findStartAndEndPosOfNumber(index: number, line: string) {
  const startingIndex = findBackwards(index, line);

  const endingIndex = findForwards(index, line);

  return [startingIndex, endingIndex] as const;
}

function findBackwards(start: number, line: string) {
  const prevChar = line[start - 1];
  if (isNumber(prevChar)) {
    return findBackwards(start - 1, line);
  }

  return start;
}

function findForwards(start: number, line: string) {
  const nextChar = line[start + 1];
  if (isNumber(nextChar)) {
    return findForwards(start + 1, line);
  }

  return start;
}
