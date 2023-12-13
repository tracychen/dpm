import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";
import { buyShares, getTokenBalance } from "@/lib/web3";
import { authenticate } from "@/lib/middleware";
import { Wallet } from "ethers";
import { updateMarketOptionHistory } from "@/lib/marketHistory";

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

    const body = await req.json();

    // validate body.shares is int
    if (!Number.isInteger(body.shares)) {
      return new Response(
        JSON.stringify({
          error: "Shares must be an integer",
        }),
        { status: 400 },
      );
    }

    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Buy shares on-chain
    const privateKey = user?.privateKey;
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
    await buyShares(
      market!.contractAddress,
      privateKey!,
      body.outcome === "YES" ? 1 : 0,
      optionIndex,
      body.shares,
    );

    if (body.spoofNewUser) {
      // Create new user
      const custodialWallet = Wallet.createRandom();
      user = await prisma.user.create({
        data: {
          evmAddress: custodialWallet.address,
          privateKey: custodialWallet.privateKey,
          custodialAddress: custodialWallet.address,
        },
      });
    } else {
      // Check if user has enough tokens
      const { displayValue } = await getTokenBalance(user.custodialAddress);
      if (Number(displayValue) < Number(body.shares)) {
        return new Response(
          JSON.stringify({
            error: "Insufficient funds",
          }),
          { status: 400 },
        );
      }
    }

    console.log("Buying option for market and user", params.id, user.id);

    // Check if user already has shares for this market
    let userShare = await prisma.userShare.findFirst({
      where: {
        marketId: params.id,
        userId: user.id,
        outcome: body.outcome,
        optionId: body.optionId,
      },
    });
    if (userShare) {
      // Update shares
      userShare = await prisma.userShare.update({
        where: {
          id: userShare.id,
        },
        data: {
          shares: userShare.shares + Number(body.shares),
        },
      });
    } else {
      // Create shares
      userShare = await prisma.userShare.create({
        data: {
          shares: body.shares,
          marketId: params.id,
          userId: user.id,
          outcome: body.outcome,
          optionId: body.optionId,
        },
      });
    }

    // update market option history
    const updatedMarket = await prisma.market.findUnique({
      where: {
        id: params.id,
      },
      include: {
        options: true,
        userShares: true,
      },
    });
    await updateMarketOptionHistory(updatedMarket);
    return new Response(JSON.stringify(userShare));
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
