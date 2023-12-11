"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { useState } from "react";
import Link from "next/link";
import { Market } from "@/models/Market.model";
import { markets, tags } from "@/lib/data";

function MarketCard({
  id,
  prompt,
  percentChance,
  change,
  direction,
  date,
  bettedCount,
  tag,
  imageUrl,
}: Omit<Market, "type">) {
  return (
    <Link
      className="flex w-full flex-col gap-y-4 rounded-2xl border p-6 hover:bg-secondary"
      href={`/markets/${id}`}
      style={{ scrollbarGutter: "stable" }}
    >
      <div className="flex items-center gap-x-6">
        <div className="aspect-square h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-2xl">
          <Image
            src={imageUrl || "https://picsum.photos/seed/picsum/200"}
            alt={prompt}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <div>
            <span className="text-sm font-semibold text-accent">{tag}</span>
          </div>
          {/* TODO truncate properly  */}
          <div className="space-y-1">
            <div className="line-clamp-1 flex items-center justify-between text-xl font-semibold">
              <span>{prompt}</span>
            </div>
            <div className="flex gap-x-2">
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
              <div
                className={cn(
                  "flex items-center",
                  direction === "up" && "text-green-700",
                  direction === "down" && "text-red-700",
                  direction === "none" && "text-muted-foreground",
                )}
              >
                {direction === "up" && (
                  <Icons.arrowup className="mr-1 h-4 w-4" />
                )}
                {direction === "down" && (
                  <Icons.arrowdown className="mr-1 h-4 w-4" />
                )}
                <span>{change}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-y-2">
          <div className="flex gap-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Icons.timer className="mr-1 h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Icons.user className="mr-1 h-4 w-4" />
              <span>{bettedCount.toLocaleString("en-US")} betted</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
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

  return (
    <div className="flex flex-col">
      {/* TODO overflow scroll */}
      <div className="flex gap-x-4 overflow-hidden">
        {tags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            selected={tag === currentTag}
            onClick={() => setCurrentTag(tag)}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-8 py-10">
        {markets
          .filter((market) => market.tag === currentTag || currentTag === "All")
          .map((market) => (
            <MarketCard
              key={market.id}
              id={market.id}
              prompt={market.prompt}
              percentChance={market.percentChance}
              change={market.change}
              direction={market.direction}
              date={market.date}
              bettedCount={market.bettedCount}
              tag={market.tag}
            />
          ))}
      </div>
    </div>
  );
}
