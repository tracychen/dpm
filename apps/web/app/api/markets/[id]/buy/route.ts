import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTokenBalance, sendTokens } from "@/lib/thirdweb";
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

    console.log("Buying option for market and user", params.id, userId);

    const body = await req.json();
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Check if user has enough tokens
    const balance = await getTokenBalance(user.custodialAddress);

    // Check if user already has shares for this market
    let userShare = await prisma.userShare.findFirst({
      where: {
        marketId: params.id,
        userId: userId,
        outcome: body.outcome,
        optionId: body.optionId,
      },
    });
    if (userShare) {
      // update shares
      userShare = await prisma.userShare.update({
        where: {
          id: userShare.id,
        },
        data: {
          shares: userShare.shares + Number(body.shares),
        },
      });
    } else {
      // create shares
      userShare = await prisma.userShare.create({
        data: {
          shares: body.shares,
          marketId: params.id,
          userId: userId,
          outcome: body.outcome,
          optionId: body.optionId,
        },
      });
    }
    // Send tokens from user custodial wallet and to funding address
    // remove 0x from private key
    // const privateKey = user.privateKey.slice(2);
    await sendTokens(
      user.privateKey,
      process.env.FUNDING_ADDRESS!,
      Number(body.shares),
    );

    return new Response(JSON.stringify(userShare));
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
