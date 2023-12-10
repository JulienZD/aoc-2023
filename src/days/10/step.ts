// const Step = {
//   UP: [1, 0],
//   DOWN: [-1, 0],
//   LEFT: [0, -1],
//   RIGHT: [0, 1],
// } as const;

class Step {
  constructor(
    public readonly name: string,
    public readonly step: readonly [number, number]
  ) {}

  get row() {
    return this.step[0];
  }

  get col() {
    return this.step[1];
  }
}

export { type Step };

const _Step = {
  UP: new Step('UP', [1, 0]),
  DOWN: new Step('DOWN', [-1, 0]),
  LEFT: new Step('LEFT', [0, -1]),
  RIGHT: new Step('RIGHT', [0, 1]),
} as const;

export const STEPS = _Step;
