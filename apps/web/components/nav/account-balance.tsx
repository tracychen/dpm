"use client";

import { User } from "next-auth";
import { useEffect, useState } from "react";
import { Loader } from "../ui/loader";
import { toast } from "../ui/use-toast";

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
    const getPortfolioBalance = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/users/${user.id}/balances`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsLoading(false);

      if (!response.ok) {
        return toast({
          title: "Error",
          description: "Error fetching balance",
          variant: "destructive",
        });
      }

      const { balance, portfolio } = await response.json();

      setPortfolioBalance(portfolio);
      setCashBalance(balance.displayValue);
      setIsLoading(false);
    };
    getPortfolioBalance();
  }, []);

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
