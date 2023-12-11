"use client";

import { User } from "next-auth";
import { useEffect, useState } from "react";
import { Loader } from "../ui/loader";

interface AccountBalanceProps {
  user: Partial<User>;
}

export function AccountBalance({ user }: AccountBalanceProps) {
  const [portfolioBalance, setPortfolioBalance] = useState<number>();
  const [cashBalance, setCashBalance] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  const balanceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    const getPortfolioBalance = (id: string) => {
      setIsLoading(true);
      // const portfolioBalance = await fetchPortfolioBalance({
      //   address: user.address as Address,
      //   chainId: 1,
      // });
      setPortfolioBalance(100);
      setCashBalance(10);
      setIsLoading(false);
    };
    getPortfolioBalance(user.id);
  }, [user]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex items-center gap-x-6 px-4">
          <div className="flex flex-col items-center">
            <div className="font-semibold">
              {portfolioBalance ? (
                <p className="text-green-700">
                  {balanceFormatter.format(portfolioBalance)}
                </p>
              ) : (
                "N/A"
              )}
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Portfolio
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-semibold">
              {cashBalance ? (
                <p className="text-green-700">
                  {balanceFormatter.format(cashBalance)}
                </p>
              ) : (
                "N/A"
              )}
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Cash
            </span>
          </div>
        </div>
      )}
    </>
  );
}
