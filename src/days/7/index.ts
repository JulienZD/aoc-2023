import { Solver } from '../../solution.js';

export const part1: Solver = (input) => {
  const hands = input.map((line) => line.split(' '));

  return calculateTotalWinnings(hands, false);
};

export const part2: Solver = (input) => {
  const hands = input.map((line) => line.split(' '));

  return calculateTotalWinnings(hands, true);
};

function calculateTotalWinnings(hands: string[][], useJokerRule: boolean): number {
  const scoreHandFn = useJokerRule ? scoreHandPartTwo : scoreHand;
  const cards = useJokerRule ? { ...CARDS, [JOKER]: 1 } : CARDS;

  return hands
    .sort(([handOne], [handTwo]) => {
      const a = handOne?.split('').sort().join('');
      const b = handTwo?.split('').sort().join('');

      const scoreA = scoreHandFn(a);
      const scoreB = scoreHandFn(b);

      if (scoreA === scoreB) {
        return determineWinner(handOne, handTwo, cards);
      }

      return scoreA > scoreB ? Sort.ASC : Sort.DESC;
    })
    .map(([_, bid], index) => {
      const rank = index + 1;

      return Number(bid) * rank;
    })
    .reduce((a, b) => a + b);
}

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

const JOKER = 'J';

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

// This thing is just lovely
function scoreHandPartTwo(hand: [string, string, string, string, string]): number {
  const [a, b, c, d, e] = hand;

  const amountOfJokers = [...hand].filter((card) => card === JOKER).length;

  // Five of a kind
  if (a === b && a === c && a === d && a === e) {
    return Score.FIVE_OF_A_KIND;
  }

  // Four of a kind
  if ((a === b && a === c && a === d) || (b === c && b === d && b === e)) {
    if (amountOfJokers === 1 || amountOfJokers === 4) {
      return Score.FIVE_OF_A_KIND;
    }
    return Score.FOUR_OF_A_KIND;
  }

  // Full house
  if ((a === b && a === c && d === e) || (a === b && c === d && c === e)) {
    if (amountOfJokers === 1) {
      return Score.FOUR_OF_A_KIND;
    }

    if (amountOfJokers === 2 || amountOfJokers === 3) {
      return Score.FIVE_OF_A_KIND;
    }

    return Score.FULL_HOUSE;
  }

  // Three of a kind
  if ((a === b && a === c) || (b === c && b === d) || (c === d && c === e)) {
    if (amountOfJokers === 1 || amountOfJokers === 3) {
      return Score.FOUR_OF_A_KIND;
    }

    if (amountOfJokers === 2) {
      return Score.FIVE_OF_A_KIND;
    }

    return Score.THREE_OF_A_KIND;
  }

  // Two pair
  if ((a === b && c === d) || (b === c && d === e) || (a === b && d === e)) {
    if (amountOfJokers === 1) {
      return Score.FULL_HOUSE;
    }

    if (amountOfJokers === 2) {
      return Score.FOUR_OF_A_KIND;
    }

    return Score.TWO_PAIR;
  }

  // High card
  if (new Set(hand).size === hand.length) {
    if (amountOfJokers === 1) {
      return Score.ONE_PAIR;
    }

    return Score.HIGH_CARD;
  }

  if (amountOfJokers === 1 || amountOfJokers === 2) {
    return Score.THREE_OF_A_KIND;
  }

  // One pair
  return Score.ONE_PAIR;
}

function determineWinner(handOne: string, handTwo: string, cards: Record<string, number>): Sort {
  for (let i = 0; i < handOne.length; i++) {
    const scoreA = cards[handOne[i]];
    const scoreB = cards[handTwo[i]];

    if (scoreA === scoreB) {
      continue;
    }

    if (scoreA > scoreB) {
      return Sort.ASC;
    }

    return Sort.DESC;
  }

  return Sort.DESC;
}
