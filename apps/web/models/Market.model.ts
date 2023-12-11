enum MarketType {
  BINARY = "binary",
  MULTIPLE_CHOICE = "mulipleChoice",
}

interface Market {
  id: string;
  prompt: string;
  percentChance: number;
  description?: string;
  change: string;
  direction: "up" | "down" | "none";
  date: string;
  bettedCount: number;
  tag: string;
  imageUrl?: string;
  options?: {
    label: string;
    amountBet: number;
    price: number;
  }[];
  type: MarketType;
}

export { type Market, MarketType };
