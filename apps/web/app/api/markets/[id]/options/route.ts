import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const optionId = searchParams.get("optionId");

  const marketId = params.id;

  try {
    const histories = await prisma.marketOptionHistory.findMany({
      where: {
        marketId: marketId,
        optionId: optionId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(histories));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
