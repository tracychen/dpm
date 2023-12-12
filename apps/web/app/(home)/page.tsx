import FilteredMarkets from "@/components/home/filtered-markets";
import HomeBanner from "@/components/home/home-banner";
import TrendingMarkets from "@/components/home/trending-markets";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@dpm/database";

export const metadata = {
  title: "Home | PEEK",
};

async function getMarkets() {
  const markets = await prisma.market.findMany({
    include: {
      user: {
        select: {
          id: true,
          evmAddress: true,
        },
      },
      options: true,
      userShares: true,
    },
  });
  return markets;
}

export default async function HomePage() {
  const markets = await getMarkets();
  const currentUser = await getCurrentUser();

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex gap-x-8">
        <div className="w-full md:w-2/3">
          <HomeBanner market={markets[0]} />
        </div>
        <div className="hidden w-1/3 md:flex">
          <TrendingMarkets markets={markets} />
        </div>
      </div>
      <div>
        <FilteredMarkets markets={markets} currentUser={currentUser} />
      </div>
    </div>
  );
}
