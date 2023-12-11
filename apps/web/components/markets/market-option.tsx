import { useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MarketOption } from "@/models/Market.model";
import { BetAction } from "@/models/Bet.model";
import { cn } from "@/lib/utils";

const MarketOptionItem = ({
  marketOption,
  setSelectedMarketOption,
  setSelectedBetAction,
  isSelected,
  selectedBetAction,
}: {
  marketOption: MarketOption,
  isSelected: boolean,
  selectedBetAction: BetAction,
  setSelectedMarketOption: (marketOption: MarketOption) => void;
  setSelectedBetAction: (betAction: BetAction) => void;
}) => {
  const [showAdditionalData, setShowAdditionalData] = useState(false);
  
  return (
    <>
      <div
        className="flex items-center justify-between hover:cursor-pointer"
        onClick={() => [setShowAdditionalData(!showAdditionalData)]}
      >
        <div className="flex flex-col gap-y-1">
          <div className="text-xl font-semibold">{marketOption.label}</div>
          <div className="flex items-center text-muted-foreground">
            <Icons.coin className="mr-1 h-6 w-6" />
            <span>${marketOption.amountBet.toLocaleString("en-US")} bet</span>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          {/* TODO on click and dont expand */}
          <Button
            variant="positive"
            className={cn("z-5 w-44", isSelected && selectedBetAction === BetAction.YES && "text-primary-foreground bg-green-700")}
            size="full"
            onClick={(e) => {
              setSelectedMarketOption(marketOption);
              setSelectedBetAction(BetAction.YES);
              e.stopPropagation();
            }}
          >
            <span>Buy Yes, ${marketOption.price}</span>
          </Button>
          <Button
            variant="negative"
            className={cn("z-5 w-44", isSelected && selectedBetAction === BetAction.NO && "text-primary-foreground bg-red-700")}
            size="full"
            onClick={(e) => {
              setSelectedMarketOption(marketOption);
              setSelectedBetAction(BetAction.NO);
              e.stopPropagation();
            }}
          >
            <span>Buy No, ${marketOption.price}</span>
          </Button>
        </div>
      </div>
      {showAdditionalData && (
        <div>
          <Tabs defaultValue="graph" className="w-full pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="graph">Graph</TabsTrigger>
              <TabsTrigger value="resolution">Resolution</TabsTrigger>
            </TabsList>
            <TabsContent value="graph"></TabsContent>
            <TabsContent value="resolution">
              {/* TODO figure out what goes here per option */}
              <div className="py-6">{marketOption.label}</div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export { MarketOptionItem };
