import { useMemo, useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Outcome } from "@/models/Outcome.model";
import { cn, truncateStringMiddle } from "@/lib/utils";
import { OrderAction } from "@/models/Order.model";
import { OptionGraph } from "./option-graph";
import { Option } from "@dpm/database";
import { Separator } from "../ui/separator";
import { UserShareWithAddress } from "@/models/Market.model";

const MarketOptionItem = ({
  userShares,
  marketId,
  marketOption,
  setSelectedMarketOption,
  setSelectedBetAction,
  isSelected,
  selectedBetAction,
  selectedOrderAction,
}: {
  userShares: UserShareWithAddress[];
  marketId: string;
  marketOption: Option;
  isSelected: boolean;
  selectedBetAction: Outcome;
  setSelectedMarketOption: (marketOption: Option) => void;
  setSelectedBetAction: (betAction: Outcome) => void;
  selectedOrderAction: OrderAction;
}) => {
  const [showAdditionalData, setShowAdditionalData] = useState(false);

  const yesHolders = useMemo(() => {
    return userShares.filter(
      (userShare) =>
        userShare.outcome === Outcome.YES &&
        userShare.optionId === marketOption.id,
    );
  }, [userShares, marketOption]);

  const noHolders = useMemo(() => {
    return userShares.filter(
      (userShare) =>
        userShare.outcome === Outcome.NO &&
        userShare.optionId === marketOption.id,
    );
  }, [userShares, marketOption]);

  const totalBet = useMemo(() => {
    return userShares
      .filter((userShare) => userShare.optionId === marketOption.id)
      .reduce((acc, userShare) => acc + userShare.shares, 0);
  }, [userShares, marketOption]);

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
            <span>${totalBet.toLocaleString("en-US")} bet</span>
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
              <TabsTrigger value="holder">Holder breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="graph">
              <OptionGraph marketId={marketId} optionId={marketOption.title} />
            </TabsContent>
            <TabsContent value="holder">
              {/* TODO figure out what goes here per option */}
              <div className="grid grid-cols-2 space-x-10">
                <div className="flex flex-col">
                  <div className="flex justify-between pt-4 text-xl font-semibold">
                    <span>Yes holders</span>
                    <span className="text-muted-foreground">Shares</span>
                  </div>
                  <Separator className="my-4" />
                  {yesHolders.map((userShare) => (
                    <div
                      key={userShare.user.id}
                      className="flex justify-between"
                    >
                      <span className="font-semibold text-accent">
                        {truncateStringMiddle(userShare.user.evmAddress, 10)}
                      </span>
                      <span>{userShare.shares}</span>
                    </div>
                  ))}
                  {/* TODO */}
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between pt-4 text-xl font-semibold">
                    <span>No holders</span>
                    <span className="text-muted-foreground">Shares</span>
                  </div>
                  <Separator className="my-4" />
                  {noHolders.map((userShare) => (
                    <div
                      key={userShare.user.id}
                      className="flex justify-between"
                    >
                      <span className="font-semibold text-accent">
                        {truncateStringMiddle(userShare.user.evmAddress, 10)}
                      </span>
                      <span>{userShare.shares}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export { MarketOptionItem };
