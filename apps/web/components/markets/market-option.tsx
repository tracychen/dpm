import { useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Outcome } from "@/models/Outcome.model";
import { cn } from "@/lib/utils";
import { OrderAction } from "@/models/Order.model";
import { OptionGraph } from "./option-graph";
import { Option } from "@dpm/database";

const MarketOptionItem = ({
  marketId,
  marketOption,
  setSelectedMarketOption,
  setSelectedBetAction,
  isSelected,
  selectedBetAction,
  selectedOrderAction,
}: {
  marketId: string;
  marketOption: Option;
  isSelected: boolean;
  selectedBetAction: Outcome;
  setSelectedMarketOption: (marketOption: Option) => void;
  setSelectedBetAction: (betAction: Outcome) => void;
  selectedOrderAction: OrderAction;
}) => {
  const [showAdditionalData, setShowAdditionalData] = useState(false);

  return (
    <>
      <div
        className="flex items-center justify-between hover:cursor-pointer"
        onClick={() => [setShowAdditionalData(!showAdditionalData)]}
      >
        <div className="flex flex-col gap-y-1">
          <div className="text-xl font-semibold">{marketOption.title}</div>
          <div className="flex items-center text-muted-foreground">
            <Icons.coin className="mr-1 h-6 w-6" />
            <span>${(20000).toLocaleString("en-US")} bet</span>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <Button
            variant="positive"
            className={cn(
              "z-5 w-44",
              isSelected &&
                selectedBetAction === Outcome.YES &&
                "bg-green-700 text-primary-foreground",
            )}
            size="full"
            onClick={(e) => {
              setSelectedMarketOption(marketOption);
              setSelectedBetAction(Outcome.YES);
              e.stopPropagation();
            }}
          >
            <span>{selectedOrderAction} Yes, $1</span>
          </Button>
          <Button
            variant="negative"
            className={cn(
              "z-5 w-44",
              isSelected &&
                selectedBetAction === Outcome.NO &&
                "bg-red-700 text-primary-foreground",
            )}
            size="full"
            onClick={(e) => {
              setSelectedMarketOption(marketOption);
              setSelectedBetAction(Outcome.NO);
              e.stopPropagation();
            }}
          >
            <span>{selectedOrderAction} No, $1</span>
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
            <TabsContent value="graph">
              <OptionGraph marketId={marketId} optionId={marketOption.title} />
            </TabsContent>
            <TabsContent value="resolution">
              {/* TODO figure out what goes here per option */}
              <div className="py-6">{marketOption.title}</div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export { MarketOptionItem };
