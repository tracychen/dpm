"use client";

import { Market, MarketType } from "@/models/Market.model";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { MarketOptionItem } from "./market-option";
import { BuySellCard } from "./buy-sell-card";
import { useState } from "react";
import Link from "next/link";
import { BetAction } from "@/models/Bet.model";

const ViewMarket = ({ market }: { market: Market }) => {
  const [selectedMarketOption, setSelectedMarketOption] = useState(
    market.options[0],
  );
  const [selectedBetAction, setSelectedBetAction] = useState(BetAction.YES);

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
                {market.tag}
              </div>
            </div>
            <div className="flex items-center justify-between text-2xl font-semibold">
              <span>{market.prompt}</span>
              <div
                className={cn(
                  "flex items-center",
                  market.percentChance > 50 && "text-green-700",
                  market.percentChance < 50 && "text-red-700",
                  market.percentChance === 50 && "text-muted-foreground",
                )}
              >
                <span>{market.percentChance}%</span>
                <span className="ml-1 text-lg font-normal">chance</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-y-2">
                <div className="flex gap-x-4">
                  <div className="flex items-center text-muted-foreground">
                    <Icons.timer className="mr-1 h-6 w-6" />
                    <span className="text-lg">{market.date}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Icons.user className="mr-1 h-6 w-6" />
                    <span className="text-lg">
                      {market.bettedCount.toLocaleString("en-US")} betted
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={cn(
                    "flex items-center",
                    market.direction === "up" && "text-green-700",
                    market.direction === "down" && "text-red-700",
                    market.direction === "none" && "text-muted-foreground",
                  )}
                >
                  {market.direction === "up" && (
                    <Icons.arrowup className="mr-1 h-4 w-4" />
                  )}
                  {market.direction === "down" && (
                    <Icons.arrowdown className="mr-1 h-4 w-4" />
                  )}
                  <span className="text-lg">{market.change}</span>
                </div>
              </div>
            </div>
          </div>
          {market.type == MarketType.BINARY ? (
            <></>
          ) : (
            market.options.map((option, index) => (
              <div key={index}>
                <Separator className="my-4" />
                <MarketOptionItem marketOption={option}
                  setSelectedMarketOption={setSelectedMarketOption}
                  setSelectedBetAction={setSelectedBetAction}
                  // TODO should use id instead of label
                  isSelected={selectedMarketOption.label === option.label}
                  selectedBetAction={selectedBetAction}
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
          <div className="grid grid-cols-2">
            <div className="flex flex-col">
              <span className="text-xl font-semibold">Yes holders</span>
              <Separator className="my-4" />
              {/* TODO */}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold">No holders</span>
            </div>
          </div>
        </div>

        <div className="flex w-1/3 flex-col">
          <BuySellCard
            selectedAction={selectedBetAction}
            selectedMarketOption={selectedMarketOption}
            marketType={market.type}
            setSelectedAction={setSelectedBetAction}
          />
        </div>
      </div>
    </>
  );
};

export { ViewMarket };
