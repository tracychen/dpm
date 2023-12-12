"use client";

import { Icons } from "../icons";
import { calculatePercentChance, cn, formatDate } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { MarketOptionItem } from "./market-option";
import { BuySellCard } from "./buy-sell-card";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Outcome } from "@/models/Outcome.model";
import { OrderAction } from "@/models/Order.model";
import { Post, Reaction, User } from "@dpm/database";
import { MarketPosts } from "./market-posts";
import { NewPostDialog } from "./new-post-dialog";
import { User as NextAuthUser } from "next-auth";
import { OptionGraph } from "./option-graph";
import { MarketWithOptionsAndShares } from "@/models/Market.model";

const ViewMarket = ({
  market,
  posts,
  currentUser,
}: {
  market: MarketWithOptionsAndShares;
  posts: (Post & {
    reactions: Reaction[];
    user: User;
  })[];
  currentUser: NextAuthUser;
}) => {
  const [selectedMarketOption, setSelectedMarketOption] = useState(
    market.options[0],
  );
  const [selectedBetAction, setSelectedBetAction] = useState(Outcome.YES);
  const [selectedOrderAction, setSelectedOrderAction] = useState(
    OrderAction.BUY,
  );

  const percentChance = useMemo(() => {
    return calculatePercentChance(market.userShares);
  }, [market.userShares]);

  return (
    <>
      <div className="flex gap-8">
        <div className="flex w-2/3 flex-col">
          <img
            src="https://picsum.photos/seed/picsum/200/300"
            className="h-[100px] w-full rounded-2xl object-cover sm:h-[334px]"
          />
          <div className="space-y-4 pt-6">
            <div className="flex">
              <div className="whitespace-nowrap rounded-full bg-secondary px-4 py-[10px] font-semibold text-muted-foreground">
                {market.topic}
              </div>
            </div>
            <div className="flex items-center justify-between text-2xl font-semibold">
              <span>{market.title}</span>
              <div
                className={cn(
                  "flex items-center",
                  percentChance > 50 && "text-green-700",
                  percentChance < 50 && "text-red-700",
                  percentChance === 50 && "text-muted-foreground",
                )}
              >
                <span>{percentChance}%</span>
                <span className="ml-1 text-lg font-normal">chance</span>
              </div>
            </div>
            <div className="flex items-center">
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
                      {market.userShares.length.toLocaleString("en-US")} betted
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {market.marketType == "BINARY" ? (
            <>
              <OptionGraph
                marketId={market.id}
                optionId={market.options[0].title}
              />
            </>
          ) : (
            market.options.map((option, index) => (
              <div key={index}>
                <Separator className="my-4" />
                <MarketOptionItem
                  userShares={market.userShares}
                  marketId={market.id}
                  marketOption={option}
                  setSelectedMarketOption={setSelectedMarketOption}
                  setSelectedBetAction={setSelectedBetAction}
                  isSelected={selectedMarketOption.id === option.id}
                  selectedBetAction={selectedBetAction}
                  selectedOrderAction={selectedOrderAction}
                />
              </div>
            ))
          )}
          <Separator className="my-6" />
          <div className="space-y-6">
            <span className="text-2xl font-semibold">About</span>
            <div className="text-muted-foreground">{market.description}</div>
            <div className="flex gap-x-6">
              <div className="flex w-44 rounded-lg border">
                <div className="flex gap-x-4 p-4">
                  <div className="rounded-sm bg-muted-foreground/10 p-2">
                    <Icons.wallet className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Contract
                    </span>
                    <Link className="text-sm text-accent" href="/">
                      0x..TODO
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex w-44 rounded-lg border">
                <div className="flex gap-x-4 p-4">
                  <div className="rounded-sm bg-muted-foreground/10 p-2">
                    <Icons.wallet className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Resolver
                    </span>
                    <Link className="text-sm text-accent" href="/">
                      0x..TODO
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">
                What people are saying
              </span>
              <NewPostDialog marketId={market.id} />
            </div>
            <MarketPosts posts={posts} currentUser={currentUser} />
          </div>
        </div>

        <div className="flex w-1/3 flex-col">
          <BuySellCard
            userShares={market.userShares}
            selectedAction={selectedBetAction}
            selectedMarketOption={selectedMarketOption}
            marketType={market.marketType}
            setSelectedAction={setSelectedBetAction}
            setSelectedOrderAction={setSelectedOrderAction}
            selectedOrderAction={selectedOrderAction}
          />
        </div>
      </div>
    </>
  );
};

export { ViewMarket };
