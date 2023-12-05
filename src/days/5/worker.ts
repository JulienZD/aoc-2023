import { parentPort, workerData } from 'worker_threads';
import { getLocationForSeed } from './shared.js';

const { conversionMaps, seed: seedData } = workerData;

const { min, max } = seedData;

let lowest = Number.MAX_SAFE_INTEGER;

for (let seed = min; seed <= max; seed++) {
  const foundSeed = getLocationForSeed(seed, conversionMaps);

  if (foundSeed < lowest) {
    lowest = foundSeed;
  }
}

parentPort?.postMessage(lowest);
