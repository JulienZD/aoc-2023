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
  return input
    .map((line) => {
      const [_game, bagRetrievals] = line.replaceAll(' ', '').split(':') as [string, string];

      const sets = bagRetrievals.split(';') as CubeSet[];

      return getCubedTotalForGame(sets);
    })
    .reduce((accum, curr) => accum + curr, 0);
};

function getCubedTotalForGame(sets: readonly CubeSet[]): number {
  const countsPerColor = sets.map((set) => {
    return Object.fromEntries(
      COLORS.map((color) => {
        const count = Number(set.match(new RegExp(`(\\d+)${color}`))?.at(1) || 0);

        return [color, count] as const;
      })
    ) as Record<Color, number>;
  });

  const maxCountsRequired = countsPerColor.reduce(
    (totals, setResults) => {
      COLORS.forEach((color) => {
        if (setResults[color] > totals[color]) {
          totals[color] = setResults[color];
        }
      });

      return totals;
    },
    Object.fromEntries(COLORS.map((color) => [color, Number.MIN_SAFE_INTEGER])) as Record<Color, number>
  );

  return Object.values(maxCountsRequired).reduce((total, count) => {
    return count === 0 ? total : total * count;
  }, 1);
}
