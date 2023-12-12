import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";
import { sellShares } from "@/lib/web3";
import { authenticate } from "@/lib/middleware";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Authentication failed",
        }),
        { status: 403 },
      );
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

    // Validate body.shares is int
    if (!Number.isInteger(body.shares)) {
      return new Response(
        JSON.stringify({
          error: "Shares must be an integer",
        }),
        { status: 400 },
      );
    }

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
      return new Response(
        JSON.stringify({
          error: "User does not have shares for this market",
        }),
        { status: 400 },
      );
    }

    // Check if user has enough shares to sell
    if (userShare.shares < Number(body.shares)) {
      return new Response(
        JSON.stringify({
          error: "User does not have enough shares to sell",
        }),
        { status: 400 },
      );
    }

    // Sell shares
    const market = await prisma.market.findUnique({
      where: {
        id: params.id,
      },
      include: {
        options: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });
    const optionIndex = market.options.findIndex(
      (option) => option.id === body.optionId,
    );
    await sellShares(
      market.contractAddress,
      user.privateKey,
      body.outcome === "YES" ? 1 : 0,
      optionIndex,
      body.shares,
    );

    // Update shares
    userShare = await prisma.userShare.update({
      where: {
        id: userShare.id,
      },
      data: {
        shares: userShare.shares - Number(body.shares),
      },
    });

    return new Response(JSON.stringify(userShare));
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
