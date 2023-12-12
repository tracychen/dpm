"use client";

import Image from "next/image";
import { calculatePercentChance, cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { SelectedMarket } from "./selected-market";
import { User } from "next-auth";
import { MarketWithOptionsAndShares } from "@/models/Market.model";

function MarketCard({
  market,
  isSelectedMarket,
  setSelectedMarketId,
}: {
  market: MarketWithOptionsAndShares;
  isSelectedMarket: boolean;
  setSelectedMarketId: (id: string | null) => void;
}) {
  const percentChance = useMemo(() => {
    return calculatePercentChance(market.userShares);
  }, [market.userShares]);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-y-4 rounded-2xl border p-6 hover:cursor-pointer hover:bg-secondary",
        isSelectedMarket
          ? "border-[3px] border-accent"
          : "border-1 shadow-[0_4px_20px_0px_rgb(0,0,0,0.05)]",
      )}
      onClick={() =>
        isSelectedMarket
          ? setSelectedMarketId(null)
          : setSelectedMarketId(market.id)
      }
      style={{ scrollbarGutter: "stable" }}
    >
      <div className="flex items-center gap-x-6">
        <div className="aspect-square h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-2xl">
          <Image
            src={market.imageUrl || "https://picsum.photos/seed/picsum/200"}
            alt={market.title}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <div>
            <span className="text-sm font-semibold text-accent">
              {market.topic}
            </span>
          </div>
          {/* TODO truncate properly  */}
          <div className="space-y-1">
            <div className="line-clamp-1 flex items-center justify-between text-xl font-semibold">
              <span>{market.title}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}

const Topic = ({
  topic,
  selected,
  onClick,
}: {
  topic: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "whitespace-nowrap rounded-full px-4 py-[10px] font-semibold ",
      selected ? "bg-primary text-white" : "bg-secondary text-muted-foreground",
    )}
  >
    {topic}
  </button>
);

export default function FilteredMarkets({
  markets,
  currentUser,
}: {
  markets: MarketWithOptionsAndShares[];
  currentUser: User;
}) {
  const [currentTopic, setCurrentTopic] = useState("All");
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(
    markets[0].id,
  );

  const topics = useMemo(
    () =>
      Array.from(
        new Set<string>(["All", ...markets.map((market) => market.topic)]),
      ),
    [markets],
  );

  return (
    <div className="flex flex-col">
      {/* TODO overflow scroll */}
      <div className="flex gap-x-4 overflow-hidden py-8">
        {topics.map((topic) => (
          <Topic
            key={topic}
            topic={topic}
            selected={topic === currentTopic}
            onClick={() => setCurrentTopic(topic)}
          />
        ))}
      </div>
      <div className="flex gap-x-8">
        <div className="flex w-1/3 min-w-[350px] flex-col gap-4">
          {markets
            .filter(
              (market) =>
                market.topic === currentTopic || currentTopic === "All",
            )
            .map((market) => (
              <MarketCard
                key={market.id}
                market={market}
                isSelectedMarket={selectedMarketId === market.id}
                setSelectedMarketId={setSelectedMarketId}
              />
            ))}
        </div>
        <div className="w-2/3">
          {selectedMarketId && (
            <SelectedMarket
              market={markets.find((market) => market.id === selectedMarketId)}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    </div>
  );
}
