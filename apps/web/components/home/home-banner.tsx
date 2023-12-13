import { Icons } from "../icons";
import { calculatePercentChance, cn, formatDate } from "@/lib/utils";
import { MarketWithOptionsAndShares } from "@/models/Market.model";
import Link from "next/link";
import { useMemo } from "react";

export default function HomeBanner({
  market,
}: {
  market: MarketWithOptionsAndShares;
}) {
  const { probability, optionTitle } = useMemo(() => {
    return calculatePercentChance(market.options, market.userShares);
  }, [market.userShares]);

  return (
    <Link
      className="flex flex-col hover:cursor-pointer"
      href={`/markets/${market.id}`}
    >
      <div className="pb-2 text-2xl font-semibold tracking-tight text-accent sm:pb-8">
        {market.topic}
      </div>
      <img
        src={market.bannerUrl || "https://picsum.photos/200/300"}
        className="h-[100px] w-full rounded-2xl object-cover sm:h-[334px]"
      />
      <div className="flex items-center justify-between pb-1 pt-6 text-2xl font-semibold">
        <span>{market.title}</span>
        <div
          className={cn(
            "flex items-center",
            probability > 50 && "text-green-700",
            probability < 50 && "text-red-700",
            probability === 50 && "text-muted-foreground",
          )}
        >
          <span>{probability}%</span>
          <span className="ml-1 text-lg font-normal">chance</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-y-2">
          <div className="flex gap-x-4">
            <div className="flex items-center text-muted-foreground">
              <Icons.timer className="mr-1 h-6 w-6" />
              <span className="text-lg">
                {formatDate(new Date(market.closeAt), false)}
              </span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Icons.user className="mr-1 h-6 w-6" />
              <span className="text-lg">
                {market.userShares.length.toLocaleString("en-US")} bet
              </span>
            </div>
          </div>
        </div>
        <div className="text-lg text-muted-foreground">{optionTitle}</div>
      </div>
    </Link>
  );
}
