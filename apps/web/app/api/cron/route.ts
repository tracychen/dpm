import { updateMarketOptionHistory } from "@/lib/marketHistory";
import { prisma } from "@dpm/database";

export async function GET() {
  const markets = await prisma.market.findMany({
    include: {
      options: true,
      userShares: true,
    },
  });

  for (const market of markets) {
    await updateMarketOptionHistory(market);
  }

  return new Response(
    JSON.stringify({
      success: true,
    }),
  );
}
