import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  const result = getSeedLocations(input);

  return Math.min(...result);
};

export const part2: Solver = (input) => {
  return 'todo';
};

function getSeedLocations(input: readonly string[]) {
  const { seeds, conversionMaps } = buildListOfMaps(input);

  const locations = seeds.map((seed) => {
    let current = seed;
    for (const [_name, maps] of conversionMaps) {
      current = getNextNumber(current, maps);
    }

    return current;
  });

  return locations;
}

type ConversionMap = {
  destRangeStart: number;
  srcRangeStart: number;
  rangeLength: number;
};

function getNextNumber(num: number, mapList: readonly ConversionMap[]): number {
  for (const map of mapList) {
    const isInRange = num >= map.srcRangeStart && num <= map.srcRangeStart + (map.rangeLength - 1);
    if (!isInRange) {
      continue;
    }

    const offset = num - map.srcRangeStart;

    const nextDestination = map.destRangeStart + offset;

    return nextDestination;
  }

  return num;
}

function buildListOfMaps(input: readonly string[]): {
  seeds: number[];
  conversionMaps: Map<string, readonly ConversionMap[]>;
} {
  const seeds = input[0]!.match(/\d+/g)!.map(Number);

  const conversionMaps = new Map<string, ConversionMap[]>(
    input
      .map((line, index) => (!line.length ? index : -1))
      .filter((index) => index !== -1)
      .map((index, _idx, self) => {
        const next = self[_idx + 1];

        const [mapName, ...maps] = input.slice(index + 1, next);

        return [
          mapName!.split(' map:')[0]!,
          maps.map((mapStr): ConversionMap => {
            const [dest, src, range] = mapStr.match(/\d+/g)!.map(Number);

            return {
              destRangeStart: Number(dest),
              srcRangeStart: Number(src),
              rangeLength: Number(range),
            };
          }),
        ] as const;
      })
  );

  return { seeds, conversionMaps };
}
