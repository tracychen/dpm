import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { prisma } from "@dpm/database";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(null, { status: 403 });
    }

    console.log("Deleting post", params.id);

    // check user is creator of post
    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!post || post.userId !== session.user.id) {
      console.log("User is not creator of post", post?.userId, session.user.id);
      return new Response(null, { status: 403 });
    }

    await prisma.post.delete({
      where: {
        id: params.id,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
