export type Solution = {
  part1: Solver;
  part2?: Solver
}

export type Solver = (input: string[]) => unknown;
