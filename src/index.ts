import 'dotenv/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDayInput } from './util/get-input.js';
import { timeFnExecution } from './util/time-fn.js';
import { Solver } from './solution.js';

const args = process.argv.slice(2);
const dayNumber = String(args[0] || new Date().getDate());

const dayDirectory = path.join(fileURLToPath(import.meta.url), '../', 'days', dayNumber);

const input = (await getDayInput(+dayNumber, dayDirectory)).split('\n');

const { part1, part2 } = (await import(path.join(dayDirectory, 'index.ts'))) as {
  part1?: Solver;
  part2?: Solver;
};

if (part1) {
  const part1Result = await timeFnExecution(() => part1(input), `Day ${dayNumber} part 1`);
  console.log(`Day ${dayNumber} - Part 1:`, part1Result);
}

if (part2) {
  const part2Result = await timeFnExecution(() => part2(input), `Day ${dayNumber} part 2`);
  console.log(`Day ${dayNumber} - Part 2:`, part2Result);
}
