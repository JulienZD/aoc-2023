import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  const strings = input[0]!.split(',');

  return strings.map(hash).reduce((a, b) => a + b);
};

function hash(input: string): number {
  const chars = input.split('');

  return chars.reduce<number>((currentValue, char) => {
    const asciiCode = char.codePointAt(0)!;

    currentValue += asciiCode;
    currentValue *= 17;
    currentValue %= 256;

    return currentValue;
  }, 0);
}
