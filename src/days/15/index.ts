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

export const part2: Solver = (input) => {
  const strings = input[0]!.split(',');

  const boxes = fillBoxesWithLenses(strings);

  return [...boxes.entries()]
    .flatMap(([boxIndex, lenses]) => {
      return lenses.map(({ focalLength }, lensIndex) => {
        const a = boxIndex + 1;
        const b = lensIndex + 1;
        const c = focalLength;

        return a * b * c;
      });
    })
    .reduce((a, b) => a + b);
};

function fillBoxesWithLenses(steps: ReadonlyArray<string>) {
  const boxes = new Map<number, { label: string; focalLength: number }[]>();

  for (const step of steps) {
    // Wrap the delimiter in a group to include it in the result
    const [label, operation, focalLength] = step.split(/([=-])/) as [string, string, `${number}` | ''];

    const key = hash(label);

    if (!boxes.has(key)) {
      boxes.set(key, []);
    }

    const lenses = boxes.get(key)!;

    const labelIndex = lenses.findIndex((item) => item.label === label);

    if (operation === '=') {
      const item = { label, focalLength: Number(focalLength) };
      if (labelIndex !== -1) {
        lenses.splice(labelIndex, 1, item);
      } else {
        lenses.push(item);
      }
    } else if (operation === '-') {
      if (labelIndex !== -1) {
        lenses.splice(labelIndex, 1);
      }
    }
  }

  return boxes;
}
