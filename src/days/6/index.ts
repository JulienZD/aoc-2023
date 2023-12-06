import { Solver } from '../../solution.js';

type Race = {
  time: number;
  distance: number;
};

export const part1: Solver = (input) => {
  const races = buildRaces(input[0]!, input[1]!);

  return races.map(race).reduce((a, b) => a * b, 1);
};

export const part2: Solver = (input) => {
  const bigRace = buildRace(input[0]!, input[1]!);

  return race(bigRace);
};

function race({ time, distance: recordDistance }: Race) {
  return Array.from({ length: time }, (_, msHeld) => {
    const remainingTime = time - msHeld;
    const distanceTravelled = msHeld * remainingTime;

    return distanceTravelled > recordDistance;
  }).filter(Boolean).length;
}

function buildRaces(times: string, distances: string): readonly Race[] {
  const allTimes = times.match(/\d+/g)!.map(Number);
  const allDistances = distances.match(/\d+/g)!.map(Number);

  return allTimes.map((time, index) => {
    return {
      time,
      distance: allDistances.at(index)!,
    } satisfies Race;
  });
}

function buildRace(times: string, distances: string): Race {
  const time = +times.match(/\d+/g)!.join('');
  const distance = +distances.match(/\d+/g)!.join('');

  return {
    time,
    distance,
  } satisfies Race;
}
