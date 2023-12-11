enum MarketType {
  BINARY = "binary",
  MULTIPLE_CHOICE = "mulipleChoice",
}

interface MarketOption {
    label: string;
    amountBet: number;
    price: number;
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
  options?: MarketOption[];
  type: MarketType;
}

export { type Market, type MarketOption, MarketType };
