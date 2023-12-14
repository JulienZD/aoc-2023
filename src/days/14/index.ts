import { Solver } from '../../solution.js';

const Tile = {
  CUBE_ROCK: '#',
  ROUNDED_ROCK: 'O',
  EMPTY: '.',
} as const;

type Tile = (typeof Tile)[keyof typeof Tile];

export const part1: Solver = (input) => {
  const tiltedGrid = tiltGrid(input.map((row) => row.split('')) as Grid);

  return tiltedGrid.reduce((total, row, rowIndex) => {
    const load = tiltedGrid.length - rowIndex;

    return total + row.reduce((rowTotal, tile) => rowTotal + (tile === Tile.ROUNDED_ROCK ? load : 0), 0);
  }, 0);
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

function logGrid(grid: Grid) {
  console.log('---  ---');
  console.log(grid.map((row) => row.join('')).join('\n'));
  console.log('\n');
}

type GridWithMovables = ReadonlyArray<ReadonlyArray<{ tile: Tile; movable: boolean }>>;

function markMovableTiles(grid: Grid): GridWithMovables {
  const tiltedGrid = grid.map((row) => row.slice());

  const movables: Array<[number, number]> = [];

  for (let rowIndex = 0; rowIndex < tiltedGrid.length - 1; rowIndex++) {
    const row = tiltedGrid[rowIndex]!;
    const nextRow = tiltedGrid[rowIndex + 1]!;

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

  return tiltedGrid.map((row, rowIndex) => {
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

console.log(part1(example));
