import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import { Solver } from '../../solution.js';
import { ConversionMap, getLocationForSeed } from './shared.js';

export const part1: Solver = (input) => {
  const seeds = input[0]!.match(/\d+/g)!.map(Number);

  const conversionMaps = buildListOfMaps(input);

  const result = seeds.map((seed) => getLocationForSeed(seed, conversionMaps));

  return Math.min(...result);
};

export const part2: Solver = async (input) => {
  const seeds = input[0]!.match(/(\d+)\s(\d+)/g)!.map((match) => {
    const [min, range] = match.split(' ').map(Number) as [number, number];

    return { min, max: min + range - 1 };
  });

  const conversionMaps = buildListOfMaps(input);

  const workerPath = path.join(fileURLToPath(import.meta.url), '../', 'worker.ts');

  const promises = seeds.map((seed) => {
    const worker = new Worker(workerPath, {
      workerData: {
        seed,
        conversionMaps,
      },
    });

    return new Promise<number>((resolve, reject) => {
      worker.on('message', resolve);

      worker.on('error', reject);
    });
  });

  const lowestSeedResults = await Promise.allSettled(promises);

  const lowestSeedsPerRange = lowestSeedResults
    .filter((result): result is PromiseFulfilledResult<number> => result.status === 'fulfilled')
    .map((result) => result.value)
    .sort((a, b) => a - b);

  console.log(lowestSeedsPerRange);

  return lowestSeedsPerRange.at(0);
};

function buildListOfMaps(input: readonly string[]): Map<string, readonly ConversionMap[]> {
  return new Map<string, ConversionMap[]>(
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
}
