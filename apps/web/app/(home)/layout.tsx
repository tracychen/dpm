import Link from "next/link";

import { UserMenu } from "@/components/nav/user-menu";
import { getCurrentUser } from "@/lib/session";
import Logo from "@/components/nav/logo";
import { CreateMarketDialog } from "@/components/create-market/create-market-dialog";
import WalletConnectButton from "@/components/nav/wallet-connect-button";
import { AccountBalance } from "@/components/nav/account-balance";

interface HomeLayoutProps {
  children?: React.ReactNode;
}

export default async function HomeLayout({ children }: HomeLayoutProps) {
  const user = await getCurrentUser();

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between bg-background px-2 py-6 shadow-[0_40px_40px_0px_rgb(0,0,0,0.1)] sm:px-10">
        <div className="flex items-center gap-x-2">
          <Link href="/" className="flex items-center gap-x-2">
            <div className="w-32 sm:w-[112px]">
              <Logo />
            </div>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {!user ? (
            <WalletConnectButton />
          ) : (
            <>
              <AccountBalance user={user} />
              <CreateMarketDialog user={user} />
              <UserMenu imageUrl={user.imageUrl} evmAddress={user.evmAddress} />
            </>
          )}
        </div>
      </div>
      <main className="flex w-full flex-1 flex-col overflow-hidden px-2 py-8 sm:px-10">
        {children}
      </main>
    </>
  );
}
