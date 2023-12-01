import path from 'path';
import { readFile, stat, writeFile } from 'fs/promises';

export async function getDayInput(dayNumber: number, dayDirectory: string) {
  const inputFile = path.join(dayDirectory, 'input.txt');

  const hasInput = await stat(inputFile).catch(() => false);

  if (!hasInput) {
    const input = await getInputFromAOC(dayNumber);

    await writeFile(inputFile, input.trim());
  }

  return readFile(inputFile, 'utf8');
}

async function getInputFromAOC(dayNumber: number) {
  const inputUrl = `https://adventofcode.com/2023/day/${dayNumber}/input`;

  const response = await fetch(inputUrl, {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_COOKIE}`,
      'User-Agent': `${process.env.REPOSITORY_URL} by ${process.env.EMAIL}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Could not get input from ${inputUrl}. Response status: ${response.status}`);
  }

  return response.text();
}
