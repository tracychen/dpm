import { Outcome } from "@/models/Outcome.model";
import { Icons } from "../icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { OrderAction } from "@/models/Order.model";
import { Option } from "@dpm/database";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { UserShareWithAddress } from "@/models/Market.model";
import { User } from "next-auth";

const OutcomeSelect = ({
  selectedAction,
  setSelectedAction,
}: {
  selectedAction: Outcome;
  setSelectedAction: (action: Outcome) => void;
}) => {
  return (
    <>
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
            selectedAction === Outcome.YES
              ? "bg-green-700 text-primary-foreground"
              : "border bg-background text-muted-foreground hover:bg-muted-foreground/20",
          )}
          onClick={() => setSelectedAction(Outcome.YES)}
        >
          <span className="text-sm font-semibold">Yes, $1</span>
        </div>
        <div
          className={cn(
            "flex w-44 items-center justify-center rounded-full px-4 py-2 hover:cursor-pointer",
            selectedAction === Outcome.NO
              ? "bg-red-700 text-primary-foreground"
              : "border bg-background text-muted-foreground hover:bg-muted-foreground/20",
          )}
          onClick={() => setSelectedAction(Outcome.NO)}
        >
          <span className="text-sm font-semibold">No, $1</span>
        </div>
      </div>
    </>
  );
};

const BuySellCard = ({
  currentUser,
  userShares,
  selectedMarketOption,
  selectedAction,
  marketType,
  setSelectedAction,
  setSelectedOrderAction,
  selectedOrderAction,
}: {
  currentUser: User;
  userShares: UserShareWithAddress[];
  selectedMarketOption: Option;
  selectedAction: Outcome;
  marketType: "BINARY" | "MULTIPLE_CHOICE";
  setSelectedAction: (action: Outcome) => void;
  setSelectedOrderAction: (action: OrderAction) => void;
  selectedOrderAction: OrderAction;
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const balance = useMemo(() => {
    return userShares
      .filter((share) => share.optionId === selectedMarketOption.id)
      .filter((share) => share.outcome === selectedAction)
      .filter((share) => share.user.id === currentUser?.id)
      .reduce((acc, share) => acc + share.shares, 0);
  }, [userShares, selectedMarketOption, selectedAction]);

  function checkLoggedIn() {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to buy or sell shares",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }

  async function buyShares() {
    setIsLoading(true);
    const response = await fetch(
      `/api/markets/${selectedMarketOption.marketId}/buy`,
      {
        method: "POST",
        body: JSON.stringify({
          shares: amount,
          optionId: selectedMarketOption.id,
          outcome: selectedAction,
        }),
      },
    );
    setIsLoading(false);

    if (!response.ok) {
      console.error(response);
      return toast({
        title: "Error",
        description: "Failed to buy shares",
        variant: "destructive",
      });
    }

    toast({
      description: `Bought ${amount} shares`,
    });

    setAmount(0);

    router.refresh();
  }

  async function sellShares() {
    setIsLoading(true);
    const response = await fetch(
      `/api/markets/${selectedMarketOption.marketId}/sell`,
      {
        method: "POST",
        body: JSON.stringify({
          shares: amount,
          optionId: selectedMarketOption.id,
          outcome: selectedAction,
        }),
      },
    );
    setIsLoading(false);

    if (!response.ok) {
      console.error(response);
      return toast({
        title: "Error",
        description: "Failed to sell shares",
        variant: "destructive",
      });
    }

    toast({
      description: `Sold ${amount} shares`,
    });

    setAmount(0);

    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col rounded-2xl border p-8 shadow-[0_4px_20px_0px_rgb(0,0,0,0.05)]">
        {marketType === "MULTIPLE_CHOICE" && selectedMarketOption.title && (
          <span className="pb-4 text-2xl font-semibold">
            {selectedMarketOption.title}
          </span>
        )}
        <Tabs defaultValue={OrderAction.BUY} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value={OrderAction.BUY}
              onClick={() => setSelectedOrderAction(OrderAction.BUY)}
            >
              {OrderAction.BUY}
            </TabsTrigger>
            <TabsTrigger
              value={OrderAction.SELL}
              onClick={() => setSelectedOrderAction(OrderAction.SELL)}
            >
              {OrderAction.SELL}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={OrderAction.BUY}>
            <OutcomeSelect
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
            />
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
                onClick={async () => {
                  if (!checkLoggedIn()) return;
                  await buyShares();
                }}
                disabled={amount < 1}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.coins className="mr-2 h-4 w-4" />
                )}
                {OrderAction.BUY}
              </Button>
            </div>
            <div className="space-y-2 font-semibold">
              <div className="flex justify-between text-muted-foreground">
                <span>Average price</span>
                <span>$1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shares</span>
                <span>{amount}</span>
              </div>
              {currentUser && (
                <div className="flex w-full space-x-1 rounded-md bg-secondary p-4">
                  <span className="text-muted-foreground">📈 You own</span>
                  <span>{balance}</span>
                  <span className="text-muted-foreground">shares</span>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value={OrderAction.SELL}>
            <OutcomeSelect
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
            />
            <div className="pb-4 pt-6">
              <span className="font-semibold">Shares</span>
            </div>
            <Input
              type="number"
              placeholder="0"
              step=".01"
              className="w-full"
              value={amount.toString()}
              onChange={(e) => {
                setAmount(parseInt(e.target.value));
              }}
            />
            <div className="flex items-center py-6">
              <Button
                variant="default"
                className="w-full"
                size="full"
                onClick={async () => {
                  if (!checkLoggedIn()) return;
                  await sellShares();
                }}
                disabled={amount < 1 && amount > balance}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.coins className="mr-2 h-4 w-4" />
                )}
                {OrderAction.SELL}
              </Button>
            </div>
            <div className="space-y-2 font-semibold">
              <div className="flex justify-between text-muted-foreground">
                <span>Average price</span>
                <span>$1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Potential profit</span>
                <span>${amount}</span>
              </div>
              {currentUser && (
                <div className="flex w-full space-x-1 rounded-md bg-secondary p-4">
                  <span className="text-muted-foreground">📈 You own</span>
                  <span>{balance}</span>
                  <span className="text-muted-foreground">shares</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export { BuySellCard };
