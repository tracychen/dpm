import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";
import { authenticate } from "@/lib/middleware";

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

    console.log("Creating market for user", userId);

    const body = await req.json();
    console.log("Creating market", body);

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
