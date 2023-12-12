import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(null, { status: 403 });
    }

    console.log(
      "Selling option for market and user",
      params.id,
      session.user.id,
    );

    const body = await req.json();

    // Check if user already has shares for this market
    let userShare = await prisma.userShare.findFirst({
      where: {
        marketId: params.id,
        userId: session.user.id,
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

    // TODO take tokens from funding address and send to user custodial wallet

    return new Response(JSON.stringify(userShare));
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
