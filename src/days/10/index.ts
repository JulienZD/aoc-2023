import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  const totalSteps = loopAroundGrid(input.map((row) => row.split('') as Tile[]));

  return totalSteps / 2;
};

function loopAroundGrid(grid: Grid) {
  const startingPosition = findStartingPosition(grid);

  const nextPipe = findFirstPipeFromStartingPosition(grid, startingPosition);

  return traverse(grid, nextPipe);
}

function traverse(grid: Grid, startPos: Position) {
  let currentPos = startPos;
  let currentTile = tileAt(grid, currentPos);

  const traversedPositions: Position[] = [];

  let steps = 1;

  while (currentTile !== 'S') {
    currentTile = tileAt(grid, currentPos);

    const seen = wasHereBefore(currentPos, traversedPositions);

    if (seen || currentTile === '.' || currentTile === 'S') {
      continue;
    }

    traversedPositions.push(currentPos);

    const nextStep = TILE_MAP[currentTile].find((step) => {
      const nextPos = takeStep(currentPos, step);
      const nextTile = tileAt(grid, takeStep(currentPos, step));

      return nextTile !== '.' && !wasHereBefore(nextPos, traversedPositions);
    })!;

    currentPos = takeStep(currentPos, nextStep);
    steps++;
  }

  return steps;
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

function takeStep([row, col]: Position, step: Position): Position {
  return [row + step[0], col + step[1]];
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

function findFirstPipeFromStartingPosition(grid: Grid, startPos: Position): Position {
  const [row, col] = startPos;
  const tileToTheRight = tileAt(grid, [row, col + 1]);
  const tileAbove = tileAt(grid, [row - 1, col]);

  if (tileAbove === '|' || tileAbove === '7' || tileAbove === 'F') {
    return takeStep(startPos, Step.UP);
  }

  if (tileToTheRight === '-' || tileToTheRight === 'J' || tileToTheRight === '7') {
    return takeStep(startPos, Step.RIGHT);
  }

  throw new Error("shouldn't happen");
}

type Tile = keyof typeof TILE_MAP;

type Grid = Tile[][];

const Step = {
  UP: [-1, 0] as Position,
  DOWN: [1, 0] as Position,
  LEFT: [0, -1] as Position,
  RIGHT: [0, 1] as Position,
} as const;

const TILE_MAP = {
  '|': [Step.UP, Step.DOWN],
  '-': [Step.RIGHT, Step.LEFT],
  L: [Step.UP, Step.RIGHT],
  J: [Step.UP, Step.LEFT],
  '7': [Step.DOWN, Step.LEFT],
  F: [Step.DOWN, Step.RIGHT],
  S: undefined,
  '.': undefined,
} as const satisfies Record<string, [Position, Position] | undefined>;
