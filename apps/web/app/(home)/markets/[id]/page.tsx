"use server";

import { ViewMarket } from "@/components/markets/view-market";
import { markets } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@dpm/database";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id;
  const market = markets.find((market) => market.id === id);
  return {
    title: `${market.id} | PEEK`,
  };
}

async function getMarket(id: string) {
  // TODO replace with correct endpoint
  // const res = await fetch(`http://localhost:3000/api/markets/${id}`);
  // const market = await res.json();
  const market = markets.find((market) => market.id === id);
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

export default async function MarketPage({ params }) {
  const market = await getMarket(params.id);
  const posts = await getMarketPosts(params.id);
  const currentUser = await getCurrentUser();
  return <ViewMarket market={market} posts={posts} currentUser={currentUser} />;
}
