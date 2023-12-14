import { Solver } from '../../solution.js';

const Tile = {
  CUBE_ROCK: '#',
  ROUNDED_ROCK: 'O',
  EMPTY: '.',
} as const;

type Tile = (typeof Tile)[keyof typeof Tile];

export const part1: Solver = (input) => {
  const tiltedGrid = tiltGrid(input.map((row) => row.split('')) as Grid);

  return calculateLoad(tiltedGrid);
};

export const part2: Solver = (input) => {
  const tiltedGrid = tiltGrid2(input.map((row) => row.split('')) as Grid, 1_000_000_000);

  return calculateLoad(tiltedGrid);
};

function tiltGrid(_grid: Grid): Grid {
  let grid = _grid;

  let hasMoved = true;
  while (hasMoved) {
    let didMove = false;

    const withMovables = markMovableTiles(grid);

    const { tiltedGrid, movements } = applyMovements(withMovables);

    grid = tiltedGrid;

    if (!didMove) {
      didMove = movements > 0;
    }

    hasMoved = didMove;
  }

  return grid;
}

function calculateLoad(grid: Grid): number {
  return grid.reduce((total, row, rowIndex) => {
    const load = grid.length - rowIndex;

    return total + row.reduce((rowTotal, tile) => rowTotal + (tile === Tile.ROUNDED_ROCK ? load : 0), 0);
  }, 0);
}

const DIRECTIONS = ['N', 'W', 'S', 'E'] as const;
type Direction = (typeof DIRECTIONS)[number];

function tiltGrid2(_grid: Grid, maxCycles = 1) {
  let grid = _grid;
  const cache = new Map<string, number>();


  for (let i = 1; i < maxCycles; i++) {
    grid = doCycle(grid);
    const map = JSON.stringify(grid);

    if (cache.has(map)) {
      if (cache.get(map) === 2) {
        break;
      }
      cache.set(map, 2);
    } else {
      cache.set(map, 1);
    }
  }

  const cycleMaps = [];

  for (const [map, count] of cache) {
    if (count === 2) {
      cycleMaps.push(map);
    }
  }

  const offset = cache.size - cycleMaps.length;

  const index = (maxCycles - offset) % cycleMaps.length;

  return JSON.parse(cycleMaps[index - 1]!);
}

function doCycle(grid: Grid, index = 0): Grid {
  if (index) {
    grid = rotateGrid(grid);
  }

  if (index === 4) {
    return grid;
  }

  return doCycle(slide(grid), index + 1);
}

function slide(grid: Grid): Grid {
  let hasMoved = true;
  while (hasMoved) {
    let didMove = false;

    const withMovables = markMovableTiles(grid);

    const { tiltedGrid, movements } = applyMovements(withMovables);

    grid = tiltedGrid;

    if (!didMove) {
      didMove = movements > 0;
    }

    hasMoved = didMove;
  }

  return grid;
}

function rotateGrid(grid: Grid): Grid {
  return grid[0].map((val, index) => grid.map((row) => row[index]).reverse());
}

function logGrid(grid: Grid) {
  console.log('---  ---');
  console.log(grid.map((row) => row.join('')).join('\n'));
  console.log('\n');
}

type GridWithMovables = ReadonlyArray<ReadonlyArray<{ tile: Tile; movable: boolean }>>;

function markMovableTiles(grid: Grid): GridWithMovables {
  const gridCopy = grid.map((row) => row.slice());

  const movables: Array<[number, number]> = [];

  for (let rowIndex = 0; rowIndex < gridCopy.length - 1; rowIndex++) {
    const row = gridCopy[rowIndex]!;
    const nextRow = gridCopy[rowIndex + 1]!;

    for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {
      const tile = nextRow[tileIndex]!;

      if (tile !== Tile.ROUNDED_ROCK) {
        continue;
      }

      const nextTile = row[tileIndex];

      if (nextTile === Tile.CUBE_ROCK) {
        continue;
      }

      // A move is definitely possible
      if (nextTile === Tile.EMPTY) {
        movables.push([rowIndex, tileIndex]);
        continue;
      }

      const canTileAboveAlsoMove = !!movables.find(([y, x]) => y === rowIndex + 1 && x === tileIndex);

      if (rowIndex === 0 || !canTileAboveAlsoMove) {
        continue;
      }

      movables.push([rowIndex + 1, tileIndex]);
    }
  }

  return gridCopy.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      const isMovable = !!movables.find(([y, x]) => y === rowIndex && x === colIndex);
      return {
        tile: cell,
        movable: isMovable,
      };
    });
  });
}

function applyMovements(grid: GridWithMovables): { movements: number; tiltedGrid: Grid } {
  let movements = 0;

  // Copy pasta
  const tiltedGrid = grid.map((row) => row.map(({ tile }) => tile));

  for (let rowIndex = 0; rowIndex < grid.length - 1; rowIndex++) {
    const row = tiltedGrid[rowIndex]!.slice();

    for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {
      const tile = grid[rowIndex]![tileIndex]!;
      if (!tile.movable) {
        continue;
      }

      tiltedGrid[rowIndex]![tileIndex] = Tile.ROUNDED_ROCK;
      tiltedGrid[rowIndex + 1]![tileIndex] = Tile.EMPTY;
      movements++;
    }
  }

  return { movements, tiltedGrid };
}

type Grid = ReadonlyArray<ReadonlyArray<Tile>>;

const example = [
  'O....#....',
  'O.OO#....#',
  '.....##...',
  'OO.#O....O',
  '.O.....O#.',
  'O.#..O.#.#',
  '..O..#O..O',
  '.......O..',
  '#....###..',
  '#OO..#....',
];

console.log(part2(example));
