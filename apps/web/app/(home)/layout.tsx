import Link from "next/link";

import { UserMenu } from "@/components/nav/user-menu";
import { getCurrentUser } from "@/lib/session";
import Logo from "@/components/nav/logo";
import { CreateMarketDialog } from "@/components/create-market/create-market-dialog";
import WalletConnectButton from "@/components/nav/wallet-connect-button";
import { AccountBalance } from "@/components/nav/account-balance";
import { prisma } from "@dpm/database";
import { getTokenBalance } from "@/lib/web3";
import { User } from "next-auth";

interface HomeLayoutProps {
  children?: React.ReactNode;
}

async function getBalance(user: User) {
  const { displayValue } = await getTokenBalance(user.custodialAddress);
  return parseFloat(displayValue);
}

async function getPortfolioTotal(userId: string) {
  const userShares = await prisma.userShare.findMany({
    where: {
      userId: userId,
    },
  });

  const total = userShares.reduce((acc, userShare) => {
    return acc + userShare.shares;
  }, 0);

  return total;
}

export default async function HomeLayout({ children }: HomeLayoutProps) {
  const user = await getCurrentUser();
  const total = user ? await getPortfolioTotal(user.id) : null;
  const cash = user ? await getBalance(user) : null;

  return (
    <>
      <div className="sticky top-0 z-20 flex items-center justify-between bg-background px-4 py-6 shadow-[0_40px_40px_0px_rgb(0,0,0,0.1)] sm:px-10">
        <div className="flex items-center gap-x-2">
          <Link href="/" className="flex items-center gap-x-2">
            <div className="w-24 sm:w-[112px]">
              <Logo />
            </div>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {!user ? (
            <WalletConnectButton />
          ) : (
            <>
              <AccountBalance
                user={user}
                portfolioBalance={total + cash}
                cashBalance={cash}
              />
              <div className="hidden sm:block">
                <CreateMarketDialog user={user} />
              </div>
              <UserMenu user={user} />
            </>
          )}
        </div>
      </div>
      <main className="flex w-full flex-1 flex-col overflow-hidden px-4 py-2 sm:px-10 sm:py-8">
        {children}
      </main>
    </>
  );
}
