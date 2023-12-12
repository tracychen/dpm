import FilteredMarkets from "@/components/home/filtered-markets";
import HomeBanner from "@/components/home/home-banner";
import TrendingMarkets from "@/components/home/trending-markets";

export const metadata = {
  title: "Home | PEEK",
};

export default async function HomePage() {
  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex gap-x-8">
        <div className="w-full md:w-2/3">
          <HomeBanner />
        </div>
        <div className="hidden w-1/3 md:flex">
          <TrendingMarkets />
        </div>
      </div>
      <div>
        <FilteredMarkets />
      </div>
    </div>
  );
}
