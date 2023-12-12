import { truncateStringMiddle } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { MarketWithOptionsAndShares } from "@/models/Market.model";
import { useMemo } from "react";
import { Outcome } from "@/models/Outcome.model";
import { OptionGraph } from "./option-graph";

const BinaryOption = ({ market }: { market: MarketWithOptionsAndShares }) => {
  const yesHolders = useMemo(() => {
    return market.userShares.filter(
      (userShare) =>
        userShare.outcome === Outcome.YES &&
        userShare.optionId === market.options[0].id,
    );
  }, [market.userShares, market.options[0].id]);

  const noHolders = useMemo(() => {
    return market.userShares.filter(
      (userShare) =>
        userShare.outcome === Outcome.NO &&
        userShare.optionId === market.options[0].id,
    );
  }, [market.userShares, market.options[0].id]);

  return (
    <>
      <OptionGraph marketId={market.id} optionId={market.options[0].title} />
      <div className="grid grid-cols-2 space-x-10">
        <div className="flex flex-col">
          <div className="flex justify-between pt-4 text-xl font-semibold">
            <span>Yes holders</span>
            <span className="text-muted-foreground">Shares</span>
          </div>
          <Separator className="my-4" />
          {yesHolders.map((userShare) => (
            <div key={userShare.user.id} className="flex justify-between">
              <span className="font-semibold text-accent">
                {truncateStringMiddle(userShare.user.evmAddress, 10)}
              </span>
              <span>{userShare.shares}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between pt-4 text-xl font-semibold">
            <span>No holders</span>
            <span className="text-muted-foreground">Shares</span>
          </div>
          <Separator className="my-4" />
          {noHolders.map((userShare) => (
            <div key={userShare.user.id} className="flex justify-between">
              <span className="font-semibold text-accent">
                {truncateStringMiddle(userShare.user.evmAddress, 10)}
              </span>
              <span>{userShare.shares}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export { BinaryOption };
