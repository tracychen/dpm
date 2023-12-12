import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTokenBalance } from "@/lib/thirdweb";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.id !== params.id) {
    return new Response(null, { status: 403 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!user) {
      return new Response(null, { status: 404 });
    }

    const balance = await getTokenBalance(user.custodialAddress);

    return new Response(
      JSON.stringify({
        portfolio: 100,
        balance: balance,
      }),
    );
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
