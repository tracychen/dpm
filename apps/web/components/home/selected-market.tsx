import { Icons } from "../icons";
import { Button } from "../ui/button";
import { MarketPosts } from "../markets/market-posts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Skeleton } from "../ui/skeleton";
import { User } from "next-auth";
import { formatDate } from "@/lib/utils";
import { MarketWithOptionsAndShares } from "@/models/Market.model";

const SelectedMarket = ({
  market,
  currentUser,
}: {
  market: MarketWithOptionsAndShares;
  currentUser: User;
}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      const response = await fetch(`/api/markets/${market.id}/posts`, {
        method: "GET",
      });
      setIsLoading(false);

      if (!response.ok) {
        console.error(response);
        return toast({
          title: "Error",
          description: "Failed to fetch comments",
          variant: "destructive",
        });
      }
      const data = await response.json();
      setPosts(data);
    }
    if (!market) return;
    fetchPosts();
  }, [market]);

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex text-2xl font-semibold">
        <span>{market.title}</span>
      </div>
      <div className="flex gap-x-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Icons.timer className="mr-1 h-4 w-4" />
          <span>{formatDate(new Date(market.closeAt), false)}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Icons.user className="mr-1 h-4 w-4" />
          <span>{market.userShares.length.toLocaleString("en-US")} bet</span>
        </div>
      </div>
      <Button variant="default" size="full" className="w-44">
        <Link href={`/markets/${market.id}`}>View Market</Link>
      </Button>
      <div className="py-6">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : (posts || []).length !== 0 ? (
          <MarketPosts
            posts={posts}
            currentUser={currentUser}
            userShares={market.userShares}
          />
        ) : (
          <span className="text-sm text-muted-foreground">
            No comments yet.
          </span>
        )}
      </div>
    </div>
  );
};

export { SelectedMarket };
