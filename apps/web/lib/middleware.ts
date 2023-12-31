import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "./auth";
import { prisma } from "@dpm/database";

export const authenticate = async (req: NextRequest) => {
  // check api key
  let userId = null;
  const apiKey = req.headers.get("x-api-key");
  if (apiKey) {
    const user = await prisma.user.findFirst({
      where: {
        apiKey: apiKey,
      },
    });
    if (!user) {
      return null;
    }
    userId = user.id;
  } else {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return null;
    }
    userId = session.user.id;
  }
  return userId;
};
