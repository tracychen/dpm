"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { useState } from "react";
import Link from "next/link";
import { Market } from "@/models/Market.model";
import { markets, tags } from "@/lib/data";
import { SelectedMarket } from "./selected-market";

function MarketCard({
  market,
  isSelectedMarket,
  setSelectedMarketId,
}: {
  market: Market;
  isSelectedMarket: boolean;
  setSelectedMarketId: (id: string | null) => void;
}) {
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
            alt={market.prompt}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <div>
            <span className="text-sm font-semibold text-accent">
              {market.tag}
            </span>
          </div>
          {/* TODO truncate properly  */}
          <div className="space-y-1">
            <div className="line-clamp-1 flex items-center justify-between text-xl font-semibold">
              <span>{market.prompt}</span>
            </div>
            <div className="flex gap-x-2">
              <div
                className={cn(
                  "flex items-center",
                  market.percentChance > 50 && "text-green-700",
                  market.percentChance < 50 && "text-red-700",
                  market.percentChance === 50 && "text-muted-foreground",
                )}
              >
                <span className="text-xl font-semibold">
                  {market.percentChance}%
                </span>
                <span className="ml-1 font-normal">chance</span>
              </div>
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
                <span>{market.change}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Tag = ({
  tag,
  selected,
  onClick,
}: {
  tag: string;
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
    {tag}
  </button>
);

export default function FilteredMarkets() {
  const [currentTag, setCurrentTag] = useState("All");
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>();

  return (
    <div className="flex flex-col">
      {/* TODO overflow scroll */}
      <div className="flex gap-x-4 overflow-hidden py-8">
        {tags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            selected={tag === currentTag}
            onClick={() => setCurrentTag(tag)}
          />
        ))}
      </div>
      <div className="flex gap-x-8">
        <div className="flex w-1/3 flex-col gap-4">
          {markets
            .filter(
              (market) => market.tag === currentTag || currentTag === "All",
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
