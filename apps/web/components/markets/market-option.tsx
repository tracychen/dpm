import { useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const MarketOption = ({
  marketOption,
}: {
  marketOption: {
    label: string;
    amountBet: number;
    price: number;
  };
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
            size="full"
            className="z-5 w-44"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span>Buy Yes, ${marketOption.price}</span>
          </Button>
          <Button
            variant="negative"
            size="full"
            className="z-5 w-44"
            onClick={(e) => {
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

export { MarketOption };
