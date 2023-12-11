import { BetAction } from "@/models/Bet.model";
import { Icons } from "../icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MarketType } from "@/models/Market.model";

const BuySellCard = ({
  selectedMarketOption,
  selectedAction,
  marketType,
    setSelectedAction,
}: {
  selectedMarketOption: {
    label: string;
    amountBet: number;
    price: number;
  };
  selectedAction: BetAction;
  marketType: MarketType
  setSelectedAction: (action: BetAction) => void;
}) => {
  const [amount, setAmount] = useState<number>(0);

  return (
    <>
      <div className="flex flex-col rounded-2xl border p-8 shadow-[0_4px_20px_0px_rgb(0,0,0,0.05)]">
        {marketType === MarketType.MULTIPLE_CHOICE && <span className="pb-4 text-2xl font-semibold">
          {selectedMarketOption.label}
        </span>}
        <Tabs defaultValue="Buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Buy">Buy</TabsTrigger>
            <TabsTrigger value="Sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="Buy">
            <div className="flex items-center pb-4 pt-4">
              <span className="font-semibold">Outcome</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icons.help className="ml-2 h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Outcome help copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-x-4">
              <div
                className={cn(
                  "flex w-44 items-center justify-center rounded-full px-4 py-2 hover:cursor-pointer",
                  selectedAction === BetAction.YES
                    ? "bg-green-700 text-primary-foreground"
                    : "border bg-background text-muted-foreground hover:bg-muted-foreground/20",
                )}
                onClick={() => setSelectedAction(BetAction.YES)}
              >
                <span className="text-sm font-semibold">
                  Yes, ${selectedMarketOption.price}
                </span>
              </div>
              <div
                className={cn(
                  "flex w-44 items-center justify-center rounded-full px-4 py-2 hover:cursor-pointer",
                  selectedAction === BetAction.NO
                    ? "bg-red-700 text-primary-foreground"
                    : "border bg-background text-muted-foreground hover:bg-muted-foreground/20",
                )}
                onClick={() => setSelectedAction(BetAction.NO)}
              >
                <span className="text-sm font-semibold">
                  No, ${selectedMarketOption.price}
                </span>
              </div>
            </div>
            <div className="pb-4 pt-6">
              <span className="font-semibold">Amount</span>
            </div>
            <div className="flex items-center">
              <Icons.currency className="mr-2 h-4 w-4" />
              <Input
                type="number"
                placeholder="0"
                step=".01"
                className="w-full"
                value={amount.toString()}
                onChange={(e) => {
                  // Hack for now to limit to 2 decimal places
                  setAmount(+parseFloat(e.target.value).toFixed(2));
                }}
              />
            </div>
            <div className="flex items-center py-6">
              <Button
                variant="default"
                className="w-full"
                size="full"
                onClick={() => {}}
              >
                <Icons.coins className="mr-2 h-4 w-4" />
                Buy
              </Button>
            </div>
            <div className="space-y-2 font-semibold">
              <div className="flex justify-between text-muted-foreground">
                <span>Average price</span>
                <span>${selectedMarketOption.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shares</span>
                <span>TBD CALCUALTE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Potential return</span>
                <span className="text-green-700">TBD CALCULATE?</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Sell"></TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export { BuySellCard };
