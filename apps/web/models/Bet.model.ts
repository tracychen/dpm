type BetAction = "Yes" | "No";

interface Bet {
  id: number;
  amountBet: number;
  price: number;
  marketId: number;
  action: BetAction;
  // TODO adjust this
}

export { type Bet, type BetAction };
