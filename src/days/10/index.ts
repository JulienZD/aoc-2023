import { Solver } from '../../solution.js';
import { type Step, STEPS } from './step.js';

export const part1: Solver = (input) => {
  const traversedPositions = idk(input.map((row) => row.split('') as Tile[]));

  return traversedPositions.length / 2;
};

export const part2: Solver = (input) => {
  return 'todo';
};

function idk(grid: Grid) {
  const startingPosition = findStartingPosition(grid);

  const [nextPipe, step] = findFirstPipeFromStartingPosition(grid, startingPosition);

  console.log({ startingPosition, nextPipe, step: step.name });

  return traverse(grid, nextPipe);
}

function traverse(grid: Grid, currentPos: Position, steps = 0, traversedPositions: Position[] = []) {
  const seen = wasHereBefore(currentPos, traversedPositions);

  const currentTile = tileAt(grid, currentPos);
  if (seen) {
    return traversedPositions;
  }

  traversedPositions.push(currentPos);

  if (currentTile === 'S') {
    return traversedPositions;
  }

  if (currentTile === '.') {
    return traversedPositions;
  }

  const nextStep = map[currentTile].find((step) => {
    const nextPos = takeStep(currentPos, step);
    const nextTile = tileAt(grid, takeStep(currentPos, step));

    return nextTile !== '.' && !wasHereBefore(nextPos, traversedPositions);
  })!;

  return traverse(grid, takeStep(currentPos, nextStep), steps + 1, traversedPositions);
}

function wasHereBefore(position: Position, allPositions: Position[]): boolean {
  const [row, col] = position;
  const previousPosition = allPositions.find(([prevRow, prevCol]) => {
    return prevRow === row && prevCol === col;
  });

  return !!previousPosition;
}

function tileAt(grid: Grid, [row, col]: Position): Tile {
  return grid[row]?.[col]!;
}

function takeStep([row, col]: Position, step: Step): Position {
  return [row + step.row, col + step.col];
}

type Position = readonly [number, number];

function findStartingPosition(grid: Grid): Position {
  const [startingPosition] = grid
    .map((row, rowIndex) => {
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
  const tileAbove = tileAt(grid, [row - 1, col]);

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

const map = {
  '|': [STEPS.UP, STEPS.DOWN],
  '-': [STEPS.RIGHT, STEPS.LEFT],
  L: [STEPS.UP, STEPS.RIGHT],
  J: [STEPS.UP, STEPS.LEFT],
  '7': [STEPS.DOWN, STEPS.LEFT],
  F: [STEPS.DOWN, STEPS.RIGHT],
  '.': undefined,
  S: 'START',
} as const;

const example = [
  '.....', //
  '.S-7.', //
  '.|.|.', //
  '.L-J.', //
  '.....', //
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
