import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sdk } from "@/lib/thirdweb";
import { authenticate } from "@/lib/middleware";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return new Response(null, { status: 403 });
    }

    console.log("Selling option for market and user", params.id, userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return new Response(null, { status: 404 });
    }

    const body = await req.json();

    // Check if user already has shares for this market
    let userShare = await prisma.userShare.findFirst({
      where: {
        marketId: params.id,
        userId: userId,
        outcome: body.outcome,
        optionId: body.optionId,
      },
    });
    if (!userShare) {
      return new Response(null, { status: 400 });
    }

    // Check if user has enough shares to sell
    if (userShare.shares < Number(body.shares)) {
      return new Response(null, { status: 400 });
    }

    // update shares
    userShare = await prisma.userShare.update({
      where: {
        id: userShare.id,
      },
      data: {
        shares: userShare.shares - Number(body.shares),
      },
    });

    // Send tokens from funding address to user custodial wallet
    const erc20Contract = await sdk.getContract(
      process.env.ERC20_CONTRACT_ADDRESS!,
    );
    console.log(
      "Sending tokens from funding address to user custodial wallet",
      process.env.FUNDING_ADDRESS!,
      user.custodialAddress,
      Number(body.shares),
    );
    await erc20Contract.erc20.transfer(
      user.custodialAddress,
      Number(body.shares),
    );
    return new Response(JSON.stringify(userShare));
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
