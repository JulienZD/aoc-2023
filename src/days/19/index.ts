import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  const [_workflows, inputs] = input
    .join('\n')
    .split('\n\n')
    .map((item) => item.split('\n')) as [Workflow[], string[]];

  const workflows = parseWorkflows(_workflows);

  const startingWorkflow = workflows.in!;

  return inputs.reduce<number>((total, rawInput) => {
    const workflowInput = parseWorkflowInput(rawInput);
    const output = runWorkflow(startingWorkflow, workflowInput, workflows);

    if (output === Output.REJECTED) {
      return total;
    }

    return total + Object.values(workflowInput).reduce((a, b) => a + b);
  }, 0);
};

function parseWorkflows(workflows: Workflow[]): Record<string, Workflow> {
  return Object.fromEntries(workflows.map((workflowStr) => workflowStr.replace('}', '').split('{')));
}

function parseWorkflowInput(input: string): Input {
  // Convert the input to a raw js object string ({x=787,m=2655,a=1222,s=2876} becomes {x:787,m:2655,a:1222,s:2876}), then
  // return it from an IIFE inside an `eval` to get the actual object
  return eval(`(() => (${input.replaceAll('=', ':')}))()`);
}

function runWorkflow(workflow: Workflow, input: Input, workflows: Readonly<Record<string, Workflow>>): Output {
  const workflowRules = workflow.split(',');

  for (let i = 0; i < workflowRules.length; i++) {
    const rule = workflowRules[i]!;

    const [condition, target] = rule.split(':') as [string, string];
    if (!target) {
      if (condition === Output.REJECTED) {
        return Output.REJECTED;
      }

      if (condition === Output.ACCEPTED) {
        return Output.ACCEPTED;
      }
      return runWorkflow(workflows[condition!]!, input, workflows);
    }

    const [variable, operator, value] = condition.split(/([<>=])/) as [keyof Input, '<' | '>' | '=', `${number}`];
    const result = compare(input[variable], Number(value), operator);

    if (!result) {
      const moreRulesToProcess = i < workflowRules.length;
      if (moreRulesToProcess) {
        continue;
      }

      return Output.REJECTED;
    }

    if (target === Output.REJECTED) {
      return Output.REJECTED;
    }

    if (target === Output.ACCEPTED) {
      return Output.ACCEPTED;
    }

    return runWorkflow(workflows[target!]!, input, workflows);
  }

  return Output.REJECTED;
}

function compare(valueA: number, other: number, operator: Operator): boolean {
  switch (operator) {
    case '<':
      return valueA < Number(other);
    case '>':
      return valueA > Number(other);
    case '=':
      return valueA === Number(other);
  }
}

type Operator = '<' | '>' | '=';

type Workflow = string;

type Input = {
  x: number;
  m: number;
  a: number;
  s: number;
};

enum Output {
  ACCEPTED = 'A',
  REJECTED = 'R',
}

