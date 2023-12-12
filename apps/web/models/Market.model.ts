import { Market, Option } from "@dpm/database";

type UserShareWithAddress = {
  user: {
    id: string;
    evmAddress: string;
  };
  optionId: string;
  shares: number;
  outcome: string;
};

type MarketWithOptionsAndShares = Market & {
  options: Option[];
  user: {
    id: string;
    evmAddress: string;
  };
  userShares: UserShareWithAddress[];
};

export { type MarketWithOptionsAndShares, type UserShareWithAddress };
