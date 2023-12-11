import { ViewMarket } from "@/components/markets/view-market";
import { markets } from "@/lib/data";

export const metadata = {
  title: "View Market | DPM",
};

async function getMarket(id: string) {
  // TODO replace with correct endpoint
  // const res = await fetch(`http://localhost:3000/api/markets/${id}`);
  // const market = await res.json();
  const market = markets.find((market) => market.id === id);
  return market;
}

export default async function MarketPage({ params }) {
  const market = await getMarket(params.id);
  return <ViewMarket market={market} />;
}
