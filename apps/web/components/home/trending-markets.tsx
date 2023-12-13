import { calculatePercentChance, cn, formatDate } from "@/lib/utils";
import { Icons } from "../icons";
import Link from "next/link";
import { MarketWithOptionsAndShares } from "@/models/Market.model";

function TrendingMarket({
  id,
  title,
  percentChance,
  closeAt,
  imageUrl,
  userCount,
}: {
  id: string;
  title: string;
  percentChance: number;
  closeAt: Date;
  imageUrl: string;
  userCount: number;
}) {
  return (
    <>
      <Link className="flex items-center gap-x-6" href={`/markets/${id}`}>
        <img
          src={imageUrl || "https://picsum.photos/seed/picsum/200/300"}
          className="h-[90px] w-[90px] flex-shrink-0 rounded-2xl object-cover"
        />
        <div className="flex flex-col gap-y-1">
          {/* TODO truncate properly  */}
          <div className="flex items-center justify-between text-xl font-semibold">
            <span>{title}</span>
          </div>
          <div
            className={cn(
              "flex items-center",
              percentChance > 50 && "text-green-700",
              percentChance < 50 && "text-red-700",
              percentChance === 50 && "text-muted-foreground",
            )}
          >
            <span className="text-xl font-semibold">{percentChance}%</span>
            <span className="ml-1 font-normal">chance</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-y-2">
              <div className="flex gap-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icons.timer className="mr-1 h-4 w-4" />
                  <span>{formatDate(new Date(closeAt), false)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icons.user className="mr-1 h-4 w-4" />
                  <span>{userCount.toLocaleString("en-US")} bet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default function TrendingMarkets({
  markets,
}: {
  markets: MarketWithOptionsAndShares[];
}) {
  return (
    <div className="flex flex-col">
      <div className="pb-2 text-2xl font-semibold tracking-tight text-accent sm:pb-8">
        Trending now
      </div>
      <div className="flex flex-col gap-y-8">
        {markets
          .sort((a, b) => b.userShares.length - a.userShares.length)
          .slice(0, 3)
          .map((market, index) => {
            const { probability } = calculatePercentChance(
              market.options,
              market.userShares,
            );
            return (
              <TrendingMarket
                key={index}
                {...market}
                userCount={market.userShares.length}
                percentChance={probability}
              />
            );
          })}
      </div>
    </div>
  );
}
