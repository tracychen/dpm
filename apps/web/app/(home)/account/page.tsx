import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@dpm/database";
import { User } from "next-auth";

export const metadata = {
  title: "My Account | PEEK",
};

const getUserShares = async (user: User) => {
  const userShares = await prisma.userShare.findMany({
    where: {
      userId: user.id,
    },
    include: {
      option: true,
      market: true,
    },
  });

  return userShares;
};

export default async function AccountPage() {
  const currentUser = await getCurrentUser();
  const userShares = await getUserShares(currentUser);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="text-xl font-semibold tracking-tighter">
        My Account / Portfolio
      </div>
      <Table className="w-full md:w-[640px]">
        <TableCaption>A list of all the shares you hold.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Market</TableHead>
            <TableHead>Option / Outcome</TableHead>
            <TableHead className="text-right"># of Shares</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userShares.map((share) => (
            <TableRow key={share.id}>
              <TableCell className="font-semibold">
                {share.market.title}
              </TableCell>
              <TableCell>
                {share.option.title} - {share.outcome}
              </TableCell>
              <TableCell className="text-right">{share.shares}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              {userShares.reduce((acc, share) => {
                return acc + share.shares;
              }, 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
