"use client";

import { User } from "next-auth";

interface AccountBalanceProps {
  user: Partial<User>;
  portfolioBalance: number;
  cashBalance: number;
}

export function AccountBalance({
  portfolioBalance,
  cashBalance,
}: AccountBalanceProps) {
  const balanceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
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
    </>
  );
}
