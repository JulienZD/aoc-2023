import { Solver } from '../../solution.js';

const COLORS = ['blue', 'green', 'red'] as const;

type Color = (typeof COLORS)[number];

type CubeSet = `${number}${Color}`;

export const part1: Solver = (input) => {
  return input
    .map((line) => {
      const [game, bagRetrievals] = line.replaceAll(' ', '').split(':') as [string, string];
      const gameNumber = game.match(/Game(\d+)/)?.at(1);

      const sets = bagRetrievals.split(';') as CubeSet[];

      if (!isValidGame(sets)) {
        return;
      }

      return Number(gameNumber);
    })
    .filter(Boolean)
    .reduce((accum, curr) => accum + curr, 0);
};

const BAG_CONTENTS = {
  red: 12,
  green: 13,
  blue: 14,
} satisfies Record<Color, number>;

function isValidGame(sets: readonly CubeSet[]): boolean {
  return sets.every((set) => {
    const retrieval = Object.fromEntries(
      COLORS.map((color) => {
        const count = Number(set.match(new RegExp(`(\\d+)${color}`))?.at(1) || 0);

        return [color, count] as const;
      })
    ) as Record<Color, number>;

    return COLORS.every((color) => retrieval[color] <= BAG_CONTENTS[color]);
  });
}

export const part2: Solver = (input) => {
  return input.length;
};

const example = [
  'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green',
  'Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue',
  'Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red',
  'Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red',
  'Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green',
];

console.log(part1(example));
