import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  const hands = input.map((line) => line.split(' '));

  return hands
    .sort(([handOne], [handTwo]) => {
      const a = handOne?.split('').sort().join('');
      const b = handTwo?.split('').sort().join('');

      const scoreA = scoreHand(a);
      const scoreB = scoreHand(b);

      if (scoreA === scoreB) {
        return determineWinner(handOne, handTwo);
      }

      return scoreA > scoreB ? Sort.ASC : Sort.DESC;
    })
    .map(([_, bid], index) => {
      const rank = index + 1;

      return Number(bid) * rank;
    })
    .reduce((a, b) => a + b);
};

enum Sort {
  ASC = 1,
  DESC = -1,
}

enum Score {
  FIVE_OF_A_KIND = 7,
  FOUR_OF_A_KIND = 6,
  FULL_HOUSE = 5,
  THREE_OF_A_KIND = 4,
  TWO_PAIR = 3,
  ONE_PAIR = 2,
  HIGH_CARD = 1,
}

const CARDS = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
} as const;

function scoreHand(hand: [string, string, string, string, string]): number {
  const [a, b, c, d, e] = hand;

  // Five of a kind
  if (a === b && a === c && a === d && a === e) {
    return Score.FIVE_OF_A_KIND;
  }

  // Four of a kind
  if ((a === b && a === c && a === d) || (b === c && b === d && b === e)) {
    return Score.FOUR_OF_A_KIND;
  }

  // Full house
  if ((a === b && a === c && d === e) || (a === b && c === d && c === e)) {
    return Score.FULL_HOUSE;
  }

  // Three of a kind
  if ((a === b && a === c) || (b === c && b === d) || (c === d && c === e)) {
    return Score.THREE_OF_A_KIND;
  }

  // Two pair
  if ((a === b && c === d) || (b === c && d === e) || (a === b && d === e)) {
    return Score.TWO_PAIR;
  }

  // High card
  if (new Set(hand).size === hand.length) {
    return Score.HIGH_CARD;
  }

  // One pair
  return Score.ONE_PAIR;
}

function determineWinner(handOne: string, handTwo: string): Sort {
  for (let i = 0; i < handOne.length; i++) {
    const cardA = CARDS[handOne[i]];
    const cardB = CARDS[handTwo[i]];

    if (cardA === cardB) {
      continue;
    }

    if (cardA > cardB) {
      return Sort.ASC;
    }

    return Sort.DESC;
  }

  return Sort.DESC;
}
