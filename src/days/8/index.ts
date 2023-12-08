import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  const [instructions] = input;
  const nodes = input.slice(2);

  const tree = buildTree(nodes);

  return walk(instructions?.split('') as Direction[], tree);
};

type Node = {
  name: string;
  left?: string;
  right?: string;
};

type Tree = {
  [name: string]: Node;
};

function buildTree(nodes: string[]): Tree {
  const tree: Tree = {};

  for (const _node of nodes) {
    const nodeDef = _node.split('=').map((s) => s.replaceAll(/[() ]/g, '')) as [string, string];

    const [name] = nodeDef;

    const [left, right] = nodeDef.at(1)!.split(',') as [string, string];

    tree[name] = {
      name,
      left,
      right,
    };
  }

  return tree;
}

const DIRECTIONS = {
  L: 'left',
  R: 'right',
} satisfies Record<string, keyof Node>;

type Direction = keyof typeof DIRECTIONS;

const START = 'AAA';
const END = 'ZZZ';

function walk(instructions: Direction[], tree: Tree): number {
  let node: Node | undefined = tree[START];
  let index = 0;

  let steps = 1;

  while (node) {
    let nextDirection = instructions[index];

    if (!nextDirection) {
      index = 0;
      nextDirection = instructions.at(index);
    }

    const nextName = node[DIRECTIONS[nextDirection!]]!;
    node = tree[nextName];

    if (node?.name === END) {
      return steps;
    }

    index++;
    steps++;
  }

  return steps;
}

export const part2: Solver = (input) => {
  // Todo
};
