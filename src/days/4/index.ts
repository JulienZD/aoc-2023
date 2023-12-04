import { Solver } from '../../solution.js';

// Expected: 18653
export const part1: Solver = (input) => {
  return input.map(scorePartOneCard).reduce((a, b) => a + b, 0);
};

// Expected: 5921508
export const part2: Solver = (input) => {
  return input.map(scorePartTwoCard(input)).reduce((a, b) => a + b, 0);
};

function scorePartOneCard(line: string) {
  const [_game, numbers] = line.split(':') as [string, string];

  const amountOfMatches = getAmountOfWinners(numbers);

  if (!amountOfMatches) {
    return 0;
  }

  return 2 ** (amountOfMatches - 1);
}

function scorePartTwoCard(allCards: readonly string[]) {
  const cache = new Map<string, number>();

  function scoreCard(card: string): number {
    if (cache.has(card)) {
      return cache.get(card)!;
    }
    const [game, numbers] = card.split(':') as [string, string];

    const gameNumber = +game.match(/\d+/)!.at(0)!;

    const amountOfMatches = getAmountOfWinners(numbers);

    if (!amountOfMatches) {
      const result = 1;
      cache.set(card, result);
      return result;
    }

    const nextGames = allCards.slice(gameNumber, gameNumber + amountOfMatches);

    const result = 1 + nextGames.map(scoreCard).reduce((a, b) => a + b, 0);

    cache.set(card, result);
    return result;
  }

  return scoreCard;
}

function getAmountOfWinners(numbers: string): number {
  const [winners, cardNumbers] = (numbers.split('|') as [string, string]).map((numberString) =>
    [...numberString.matchAll(/\d+/g)].map((match) => +match[0])
  ) as [number[], number[]];

  return cardNumbers.reduce((total, num) => (winners.includes(num) ? total + 1 : total), 0);
}
