"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function WalletConnectButton() {
  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          if (connected) {
            redirect("/");
          }

          return (
            <>
              {!connected ? (
                <button
                  onClick={openConnectModal}
                  type="button"
                  className={cn(buttonVariants())}
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex justify-center">
                  <ConnectButton chainStatus={"none"} showBalance={false} />
                </div>
              )}
            </>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
