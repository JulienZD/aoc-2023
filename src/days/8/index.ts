import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  const [instructions] = input;
  const nodes = input.slice(2);

  const tree = buildTree(nodes);

  const START = 'AAA';
  const END = 'ZZZ';

  const isEnd = (node?: Node) => node?.name === END;

  return walk(instructions?.split('') as Direction[], tree[START]!, tree, isEnd);
};

export const part2: Solver = async (input) => {
  const [instructions] = input;
  const nodes = input.slice(2);

  const tree = buildTree(nodes);

  const startingNodes = nodes
    .map((node) => {
      const [name] = node.split(' =');
      return name?.endsWith('A') ? name : undefined;
    })
    .filter(Boolean);

  const isEnd = (node?: Node) => !!node?.name?.endsWith('Z');

  const directions = instructions?.split('') as Direction[];

  const steps = startingNodes.map((name) => walk(directions, tree[name]!, tree, isEnd));

  return leastCommonMultiple(steps);
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

function walk(instructions: Direction[], root: Node, tree: Tree, isEnd: (node?: Node) => boolean): number {
  let node: Node | undefined = root;
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

    if (isEnd(node)) {
      return steps;
    }

    index++;
    steps++;
  }

  return steps;
}

// This will solve... after about ~760 hours for my input :')
function simultaneousWalk(
  instructions: Direction[],
  roots: Node[],
  tree: Tree,
  isEnd: (node?: Node) => boolean
): number {
  let nodes: (Node | undefined)[] = roots;
  let index = 0;

  let steps = 1;

  while (nodes.length) {
    let nextDirection = instructions[index];

    if (!nextDirection) {
      index = 0;
      nextDirection = instructions.at(index);
    }

    const nextNames = nodes.map((node) => node![DIRECTIONS[nextDirection!]]!);
    nodes = nextNames.map((name) => tree[name]);

    if (nodes.every(isEnd)) {
      return steps;
    }

    index++;
    steps++;
  }

  return steps;
}

// Source: https://www.geeksforgeeks.org/javascript-program-to-find-lcm/
function leastCommonMultiple(arr: number[]) {
  function gcd(a: number, b: number) {
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  let res = arr[0]!;

  for (let i = 1; i < arr.length; i++) {
    res = (res * arr[i]!) / gcd(res, arr[i]!);
  }

  return res;
}
