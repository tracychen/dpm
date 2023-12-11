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
      "Creating reaction for post and user",
      params.id,
      session.user.id,
    );

    const body = await req.json();

    // Check if reaction already exists for this user and post
    let reaction = await prisma.reaction.findFirst({
      where: {
        postId: params.id,
        userId: session.user.id,
      },
    });

    if (reaction) {
      // check if reaction is the same
      if (reaction.reaction !== body.reaction) {
        // update reaction
        await prisma.reaction.update({
          where: {
            id: reaction.id,
          },
          data: {
            reaction: body.reaction,
          },
        });
      } else {
        // delete reaction
        await prisma.reaction.delete({
          where: {
            id: reaction.id,
          },
        });
        reaction = null;
      }
    } else {
      // create reaction
      reaction = await prisma.reaction.create({
        data: {
          reaction: body.reaction,
          postId: params.id,
          userId: session.user.id,
        },
      });
    }

    return new Response(JSON.stringify(reaction));
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
