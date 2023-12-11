import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(null, { status: 403 });
    }

    console.log(
      "Creating post for market and user",
      params.id,
      session.user.id,
    );

    const body = await req.json();
    console.log("Creating post", body);

    const post = await prisma.post.create({
      data: {
        body: body.body,
        marketId: params.id,
        userId: session.user.id,
      },
      include: {
        user: true,
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                evmAddress: true,
              },
            },
          },
        },
      },
    });

    return new Response(JSON.stringify(post));
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const marketId = params.id;

  try {
    const posts = await prisma.post.findMany({
      where: {
        marketId: marketId,
      },
      include: {
        user: true,
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                evmAddress: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
