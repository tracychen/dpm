import { NextRequest } from "next/server";
import { Outcome, prisma } from "@dpm/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.id !== params.id) {
    return new Response(null, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const optionId = searchParams.get("optionId");
  const marketId = searchParams.get("marketId");
  const outcome = searchParams.get("outcome");

  try {
    const shares = await prisma.userShare.findMany({
      where: {
        ...[marketId ? { marketId: marketId } : {}],
        ...[optionId ? { optionId: optionId } : {}],
        ...[outcome ? { outcome: outcome as Outcome } : {}],
        userId: session.user.id,
      },
    });

    return new Response(JSON.stringify(shares));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
