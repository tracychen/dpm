"use client";

import Image from "next/image";
import { calculatePercentChance, cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { SelectedMarket } from "./selected-market";
import { User } from "next-auth";
import { MarketWithOptionsAndShares } from "@/models/Market.model";
import Link from "next/link";

function MarketCard({
  market,
  isSelectedMarket,
  setSelectedMarketId,
}: {
  market: MarketWithOptionsAndShares;
  isSelectedMarket: boolean;
  setSelectedMarketId: (id: string | null) => void;
}) {
  const { probability, optionTitle } = useMemo(() => {
    return calculatePercentChance(market.options, market.userShares);
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
                "flex items-center space-x-1",
                probability > 50 && "text-green-700",
                probability < 50 && "text-red-700",
                probability === 50 && "text-muted-foreground",
              )}
            >
              <span className="text-xl font-semibold">{probability}%</span>
              <span className="font-normal">chance</span>
              {optionTitle && (
                <span className="text-muted-foreground">• {optionTitle}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMarketCard({ market }: { market: MarketWithOptionsAndShares }) {
  const { probability, optionTitle } = useMemo(() => {
    return calculatePercentChance(market.options, market.userShares);
  }, [market.userShares]);

  return (
    <Link
      className="flex w-full flex-col gap-y-4 rounded-2xl border p-4 hover:cursor-pointer hover:bg-secondary"
      href={`/markets/${market.id}`}
      style={{ scrollbarGutter: "stable" }}
    >
      <div className="flex items-center gap-x-6">
        <div className="aspect-square h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-2xl md:h-[120px] md:w-[120px]">
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
          <div className="space-y-1">
            <div className="line-clamp-1 flex items-center justify-between text-lg font-semibold md:text-xl">
              <span>{market.title}</span>
            </div>
            <div
              className={cn(
                "flex items-center space-x-1",
                probability > 50 && "text-green-700",
                probability < 50 && "text-red-700",
                probability === 50 && "text-muted-foreground",
              )}
            >
              <span className="font-semibold md:text-xl">{probability}%</span>
              <span className="md:text-md text-sm font-normal">chance</span>
              {optionTitle && (
                <span className="md:text-md text-sm text-muted-foreground">
                  • {optionTitle}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
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
      <div
        className="flex gap-x-4 overflow-x-auto py-4 md:py-8"
        style={{ scrollbarGutter: "stable" }}
      >
        {topics.map((topic) => (
          <Topic
            key={topic}
            topic={topic}
            selected={topic === currentTopic}
            onClick={() => {
              setCurrentTopic(topic);
              setSelectedMarketId(
                markets.find((market) => market.topic === topic)?.id || null,
              );
            }}
          />
        ))}
      </div>
      <div className="flex gap-x-8">
        <div className="flex w-full flex-col gap-4 md:w-1/3 md:min-w-[350px]">
          {markets
            .filter(
              (market) =>
                market.topic === currentTopic || currentTopic === "All",
            )
            .map((market) => (
              <>
                <div className="hidden md:block">
                  <MarketCard
                    key={market.id}
                    market={market}
                    isSelectedMarket={selectedMarketId === market.id}
                    setSelectedMarketId={setSelectedMarketId}
                  />
                </div>
                <div className="md:hidden">
                  <MobileMarketCard key={market.id} market={market} />
                </div>
              </>
            ))}
        </div>
        <div className="hidden w-2/3 md:flex">
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
