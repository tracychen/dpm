import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTokenBalance } from "@/lib/web3";

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

    const { displayValue } = await getTokenBalance(user.custodialAddress);

    return new Response(
      JSON.stringify({
        balance: parseFloat(displayValue),
      }),
    );
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
