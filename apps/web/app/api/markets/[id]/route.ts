import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const market = await prisma.market.findUnique({
      where: {
        id: params.id,
      },
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

    return new Response(JSON.stringify(market));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
