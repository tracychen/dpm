import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";
import { getTokenBalance, sendTokens } from "@/lib/thirdweb";
import { authenticate } from "@/lib/middleware";
import { Wallet } from "ethers";

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
    const privateKey = user?.privateKey;

    if (body.spoofNewUser) {
      // create new user
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
          userId: user.id,
          outcome: body.outcome,
          optionId: body.optionId,
        },
      });
    }
    // Send tokens from user custodial wallet and to funding address
    // remove 0x from private key
    // const privateKey = user.privateKey.slice(2);
    await sendTokens(
      privateKey,
      process.env.FUNDING_ADDRESS!,
      Number(body.shares),
    );

    return new Response(JSON.stringify(userShare));
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
