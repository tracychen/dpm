import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";
import { authenticate } from "@/lib/middleware";
import { ContractFactory } from "ethers";
import artifact from "@/lib/BettingMarket.json";
import { fundingWallet } from "@/lib/web3";

export async function POST(req: NextRequest) {
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
    console.log("Creating market", body);

    // Deploy market contract
    console.log("Deploying market contract");
    const marketContract = new ContractFactory(
      artifact.abi,
      artifact.bytecode,
      fundingWallet,
    );
    const marketContractInstance = await marketContract.deploy(
      body.title,
      body.options.length,
      process.env.ERC20_CONTRACT_ADDRESS!,
    );

    console.log("Creating market for user", userId);
    const market = await prisma.market.create({
      data: {
        title: body.title,
        description: body.description,
        resolution: body.resolution,
        imageUrl: body.imageUrl,
        topic: body.topic,
        marketType: body.marketType,
        options: {
          create: body.options.map((option: string) => ({
            title: option,
          })),
        },
        contractAddress: marketContractInstance.address,
        closeAt: body.closeAt,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return new Response(JSON.stringify(market));
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

export async function GET(_: NextRequest) {
  try {
    const markets = await prisma.market.findMany({
      include: {
        user: {
          select: {
            id: true,
            evmAddress: true,
          },
        },
        options: true,
        userShares: true,
      },
    });
    return new Response(JSON.stringify(markets));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
