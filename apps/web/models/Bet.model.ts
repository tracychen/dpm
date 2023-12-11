enum BetAction {
    YES = 'Yes',
    NO = 'No',
}

interface Bet {
  id: number;
  amountBet: number;
  price: number;
  marketId: number;
  action: BetAction;
  // TODO adjust this
}

export { type Bet, BetAction };
