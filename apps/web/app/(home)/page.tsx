import FilteredMarkets from "@/components/home/filtered-markets";
import HomeBanner from "@/components/home/home-banner";
import TrendingMarkets from "@/components/home/trending-markets";
import { markets } from "@/lib/data";

export const metadata = {
  title: "Home | PEEK",
};

async function getMarkets() {
  // TODO replace with correct endpoint
  // const res = await fetch(`http://localhost:3000/api/markets/${id}`);
  // const market = await res.json();
  return markets;
}

export default async function HomePage() {
  const markets = await getMarkets();

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex gap-x-8">
        <div className="w-full md:w-2/3">
          <HomeBanner />
        </div>
        <div className="hidden w-1/3 md:flex">
          <TrendingMarkets markets={markets} />
        </div>
      </div>
      <div>
        <FilteredMarkets markets={markets} />
      </div>
    </div>
  );
}
