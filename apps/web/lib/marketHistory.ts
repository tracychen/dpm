import { Market, Option, UserShare, prisma } from "@dpm/database";

export const updateMarketOptionHistory = async (
  market: Market & {
    options: Option[];
    userShares: UserShare[];
  },
) => {
  for (const option of market.options) {
    // Generate probability of yes and no outcomes
    const yesShares = market.userShares
      .filter((us) => us.optionId === option.id && us.outcome === "YES")
      .reduce((acc, us) => acc + us.shares, 0);

    const noShares = market.userShares
      .filter((us) => us.optionId === option.id && us.outcome === "NO")
      .reduce((acc, us) => acc + us.shares, 0);

    const totalShares = yesShares + noShares;

    const yesProbability = totalShares === 0 ? 0.5 : yesShares / totalShares;

    const moh = await prisma.marketOptionHistory.create({
      data: {
        marketId: market.id,
        optionId: option.id,
        value: yesProbability,
      },
    });

    console.log("Created market option history", moh);
  }
};
