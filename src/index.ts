import 'dotenv/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDayInput } from './util/get-input.js';

const args = process.argv.slice(2);
const dayNumber = String(args[0] || new Date().getDate());

const dayDirectory = path.join(fileURLToPath(import.meta.url), '../', 'days', dayNumber);

const input = (await getDayInput(+dayNumber, dayDirectory)).split('\n');

const { part1, part2 } = await import(path.join(dayDirectory, 'index.ts'));

if (part1) {
  console.log(`Day ${dayNumber} - Part 1:`, part1(input));
}

if (part2) {
  console.log(`Day ${dayNumber} - Part 2:`, part2(input));
}
