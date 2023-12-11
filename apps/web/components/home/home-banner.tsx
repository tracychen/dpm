import { markets } from "@/lib/data";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";

export default function HomeBanner() {
  const bannerMarket = markets[0];
  return (
    <div className="flex flex-col">
      <div className="pb-2 text-2xl font-semibold tracking-tight text-accent sm:pb-8">
        Elections
      </div>
      <img
        src="https://picsum.photos/seed/picsum/200/300"
        className="h-[100px] w-full rounded-2xl object-cover sm:h-[334px]"
      />
      <div className="flex items-center justify-between pb-1 pt-6 text-2xl font-semibold">
        <span>{bannerMarket.prompt}</span>
        <div
          className={cn(
            "flex items-center",
            bannerMarket.percentChance > 50 && "text-green-700",
            bannerMarket.percentChance < 50 && "text-red-700",
            bannerMarket.percentChance === 50 && "text-muted-foreground",
          )}
        >
          <span>{bannerMarket.percentChance}%</span>
          <span className="ml-1 text-lg font-normal">chance</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-y-2">
          <div className="flex gap-x-4">
            <div className="flex items-center text-muted-foreground">
              <Icons.timer className="mr-1 h-6 w-6" />
              <span className="text-lg">{bannerMarket.date}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Icons.user className="mr-1 h-6 w-6" />
              <span className="text-lg">
                {bannerMarket.bettedCount.toLocaleString("en-US")} betted
              </span>
            </div>
          </div>
        </div>
        <div>
          <div
            className={cn(
              "flex items-center",
              bannerMarket.direction === "up" && "text-green-700",
              bannerMarket.direction === "down" && "text-red-700",
              bannerMarket.direction === "none" && "text-muted-foreground",
            )}
          >
            {bannerMarket.direction === "up" && (
              <Icons.arrowup className="mr-1 h-4 w-4" />
            )}
            {bannerMarket.direction === "down" && (
              <Icons.arrowdown className="mr-1 h-4 w-4" />
            )}
            <span className="text-lg">{bannerMarket.change}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
