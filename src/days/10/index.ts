import { Solver } from '../../solution.js';
import { type Step, STEPS } from './step.js';

export const part1: Solver = (input) => {
  return idk(input.map((row) => row.split('') as Tile[]));
};

export const part2: Solver = (input) => {
  return 'todo';
};

function idk(grid: Grid) {
  const startingPosition = findStartingPosition(grid);

  const [nextPipe, step] = findFirstPipeFromStartingPosition(grid, startingPosition);

  console.log({ startingPosition, nextPipe, step: step.name });

  return traverse(grid, nextPipe, step);
}

function traverse(
  grid: Grid,
  currentPos: Position,
  lastStep: Step,
  traversedPositions: {
    steps: number;
    pos: Position;
  }[] = []
) {
  const tile = tileAt(grid, currentPos);
  console.log(`at ${tile}, prevStep: ${lastStep.name}`);
  if (tile === 'S') {
    return traversedPositions;
  }

  const nextSteps = Object.entries(STEPS)
    .map(([stepName, step]) => {
      if (step.row === lastStep.row && step.col === lastStep.col) {
        return;
      }

      return [stepName as keyof typeof STEPS, takeStep(currentPos, step)] as const;
    })
    .filter(Boolean);

  for (const [stepName, nextPos] of nextSteps) {
    const tile = tileAt(grid, nextPos);
    const isValidStep =
      tile !== '.' &&
      !wasHereBefore(
        nextPos,
        traversedPositions.map(({ pos }) => pos)
      );
    if (!isValidStep) {
      continue;
    }

    traversedPositions.push({ pos: nextPos, steps: stepName.length + 1 });
    return traverse(grid, nextPos, STEPS[stepName], traversedPositions);
  }
}

function wasHereBefore(position: Position, allPositions: Position[]): boolean {
  const [row, col] = position;
  const previousPosition = allPositions.find(([prevRow, prevCol]) => {
    return prevRow === row && prevCol === col;
  });

  return !!previousPosition;
}

function tileAt(grid: Grid, [row, col]: Position): Tile {
  return grid[row]![col]!;
}

function takeStep([row, col]: Position, step: Step): Position {
  return [row + step.row, col + step.col];
}

// function traverse2(grid: Grid, [row, col]: Position) {
//   const tile = grid[row]![col]!;
//
//   if (tile === '.') {
//     const nextTraversable = grid[row]![col + 1] || grid[row + 1]![col];
//
//     if (!nextTraversable) {
//       console.log(`wtf cant continue at [${row}, ${col}] - ${tile}`);
//       return -1;
//     }
//     return traverse(grid, nextTraversable);
//   }
//
//   if (tile === 'S') {
//   }
//
//   if (tile === 'L') {
//   }
// }

type Position = readonly [number, number];

function findStartingPosition(grid: Grid): Position {
  const [startingPosition] = grid
    .map((row, rowIndex) => {
      console.log(row);
      const colIndex = row.findIndex((sq) => sq === 'S');

      if (colIndex !== -1) {
        return [rowIndex, colIndex] as const;
      }
    })
    .filter(Boolean);

  return startingPosition!;
}

function findFirstPipeFromStartingPosition(grid: Grid, startPos: Position): [Position, Step] {
  const [row, col] = startPos;
  const tileToTheRight = tileAt(grid, [row, col + 1]);
  const tileAbove = tileAt(grid, [row + 1, col]);
  // const tileBelow = tileAt(grid, [row, col - 1]);
  // const tileToTheLeft = tileAt(grid, [row, col - 1]);

  if (tileAbove === '|' || tileAbove === '7' || tileAbove === 'F') {
    return [takeStep(startPos, STEPS.UP), STEPS.UP];
  }

  if (tileToTheRight === '-' || tileToTheRight === 'J' || tileToTheRight === '7') {
    return [takeStep(startPos, STEPS.RIGHT), STEPS.RIGHT];
  }

  throw new Error("shouldn't happen");
}

type Tile = keyof typeof map;

type Grid = Tile[][];

// type TraversingGrid = {
//   tile: Tile;
//   position: Position;
//   value: number;
// }[];

const map = {
  '|': 'NS',
  '-': 'EW',
  L: 'NE',
  J: 'NW',
  '7': 'SW',
  F: 'SE',
  '.': undefined,
  S: 'START',
} as const;

const example = [
  '.....', //
  '.S-7.',
  '.|.|.',
  '.L-J.',
  '.....',
];

const example2 = [
  '..F7.', //
  '.FJ|.', //
  'SJ.L7', //
  '|F--J', //
  'LJ...', //
];

console.log('example 1: ', part1(example));

console.log('example 2: ', part1(example2));
