"use client";

import { Icons } from "../icons";
import {
  calculatePercentChance,
  cn,
  formatDate,
  truncateStringMiddle,
} from "@/lib/utils";
import { Separator } from "../ui/separator";
import { MarketOptionItem } from "./market-option";
import { BuySellCard } from "./buy-sell-card";
import { useMemo, useState } from "react";
import { Outcome } from "@/models/Outcome.model";
import { OrderAction } from "@/models/Order.model";
import { Post, Reaction, User } from "@dpm/database";
import { MarketPosts } from "./market-posts";
import { NewPostDialog } from "./new-post-dialog";
import { User as NextAuthUser } from "next-auth";
import { MarketWithOptionsAndShares } from "@/models/Market.model";
import { BinaryOption } from "./binary-option";

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

  const { probability, optionTitle } = useMemo(() => {
    return calculatePercentChance(market.options, market.userShares);
  }, [market.userShares]);

  return (
    <>
      <div className="flex gap-8">
        <div className="flex w-2/3 flex-col">
          <img
            src={market.bannerUrl || "https://picsum.photos/200/300"}
            className="h-[100px] w-full rounded-2xl object-cover sm:h-[334px]"
          />
          <div className="space-y-4 pt-6">
            <div className="flex">
              <div className="whitespace-nowrap rounded-full bg-secondary p-[10px] px-4 font-semibold text-muted-foreground">
                {market.topic}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-2xl font-semibold">
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
                        {market.userShares.length.toLocaleString("en-US")}{" "}
                        betted
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-lg text-muted-foreground">
                  {optionTitle}
                </div>
              </div>
            </div>
          </div>
          {market.marketType == "BINARY" ? (
            <BinaryOption market={market} />
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
                    <span className="text-sm text-accent">0xa2...ba84</span>
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
                    <span className="text-sm text-accent">
                      {truncateStringMiddle(market.user.evmAddress, 8)}
                    </span>
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
            {posts.length !== 0 ? (
              <MarketPosts
                posts={posts}
                currentUser={currentUser}
                userShares={market.userShares}
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                No comments yet.
              </span>
            )}
          </div>
        </div>

        <div className="sticky flex w-1/3 flex-col">
          <BuySellCard
            currentUser={currentUser}
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
