"use server";

import { ViewMarket } from "@/components/markets/view-market";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@dpm/database";

export async function generateMetadata({ params }: { params: { id: string } }) {
  // const market = await getMarket(params.id);
  return {
    title: `View market | PEEK`,
  };
}

async function getMarket(id: string) {
  const market = await prisma.market.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          id: true,
          evmAddress: true,
        },
      },
      options: true,
      userShares: {
        select: {
          user: {
            select: {
              id: true,
              evmAddress: true,
            },
          },
          shares: true,
          outcome: true,
          optionId: true,
        },
      },
    },
  });
  return market;
}

async function getMarketPosts(id: string) {
  const posts = await prisma.post.findMany({
    where: {
      marketId: id,
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
  return posts;
}

export default async function MarketPage({
  params,
}: {
  params: { id: string };
}) {
  const market = await getMarket(params.id);
  const posts = await getMarketPosts(params.id);
  const currentUser = await getCurrentUser();
  return <ViewMarket market={market} posts={posts} currentUser={currentUser} />;
}
