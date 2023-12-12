"use client";

import { cn, formatDate, truncateStringMiddle } from "@/lib/utils";
import { Post, Reaction, User } from "@dpm/database";
import { Icons } from "../icons";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "../ui/use-toast";
import { User as NextAuthUser } from "next-auth";
import { useRouter } from "next/navigation";

const MarketPost = ({
  post,
  currentUser,
}: {
  post: Post & {
    reactions: Reaction[];
    user: User;
  };
  currentUser: NextAuthUser;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const [isLikedByUser, setIsLikedByUser] = useState(
    currentUser
      ? post.reactions.filter(
          (reaction: Reaction) =>
            reaction.reaction === "LIKE" && reaction.userId === currentUser.id,
        ).length > 0
      : false,
  );
  const [isDislikedByUser, setIsDislikedByUser] = useState(
    currentUser
      ? post.reactions.filter(
          (reaction: Reaction) =>
            reaction.reaction === "DISLIKE" &&
            reaction.userId === currentUser.id,
        ).length > 0
      : false,
  );

  const [likeCount, setLikeCount] = useState(
    post.reactions.filter((reaction: Reaction) => reaction.reaction === "LIKE")
      .length,
  );

  const [dislikeCount, setDislikeCount] = useState(
    post.reactions.filter(
      (reaction: Reaction) => reaction.reaction === "DISLIKE",
    ).length,
  );

  useEffect(() => {
    if (!currentUser) {
      setIsLikedByUser(false);
      setIsDislikedByUser(false);
      return;
    }

    setIsLikedByUser(
      post.reactions.filter(
        (reaction: Reaction) =>
          reaction.reaction === "LIKE" && reaction.userId === currentUser.id,
      ).length > 0,
    );
    setIsDislikedByUser(
      post.reactions.filter(
        (reaction: Reaction) =>
          reaction.reaction === "DISLIKE" && reaction.userId === currentUser.id,
      ).length > 0,
    );
  }, [currentUser]);

  async function handleLike() {
    if (!currentUser) {
      return toast({
        title: "Error",
        description: "You must be logged in to like a comment",
        variant: "destructive",
      });
    }

    setIsUpdating(true);
    const response = await fetch(`/api/posts/${post.id}/reactions`, {
      method: "POST",
      body: JSON.stringify({
        reaction: "LIKE",
      }),
    });
    setIsUpdating(false);

    if (!response.ok) {
      console.error(response);
      return toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive",
      });
    }

    // hack to update displayed values
    if (isDislikedByUser) {
      setDislikeCount(dislikeCount - 1);
    }
    if (!isLikedByUser) {
      setLikeCount(likeCount + 1);
      setIsLikedByUser(true);
    } else {
      setLikeCount(likeCount - 1);
      setIsLikedByUser(false);
    }
    setIsDislikedByUser(false);
  }

  async function handleDislike() {
    if (!currentUser) {
      return toast({
        title: "Error",
        description: "You must be logged in to dislike a post",
        variant: "destructive",
      });
    }

    setIsUpdating(true);
    const response = await fetch(`/api/posts/${post.id}/reactions`, {
      method: "POST",
      body: JSON.stringify({
        reaction: "DISLIKE",
      }),
    });
    setIsUpdating(false);

    if (!response.ok) {
      console.error(response);
      return toast({
        title: "Error",
        description: "Failed to dislike comment",
        variant: "destructive",
      });
    }

    // hack to update displayed values
    if (isLikedByUser) {
      setLikeCount(likeCount - 1);
    }
    if (!isDislikedByUser) {
      setDislikeCount(dislikeCount + 1);
      setIsDislikedByUser(true);
    } else {
      setDislikeCount(dislikeCount - 1);
      setIsDislikedByUser(false);
    }
    setIsLikedByUser(false);
  }

  async function deletePost() {
    setIsDeleting(true);
    const response = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (!response.ok) {
      console.error(response);
      return toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }

    toast({
      description: "Deleted comment",
    });

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-6">
      <div className="flex items-center gap-1">
        <Avatar className="mr-1 h-10 w-10">
          <AvatarImage src={post.user.imageUrl} alt={post.user.evmAddress} />
          <AvatarFallback>
            <Icons.user className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold text-accent">
          {truncateStringMiddle(post.user.evmAddress)}
        </span>
        <span className="text-muted-foreground">holds</span>
        <span className="font-semibold">TODO shares of Yes option</span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {post.body}
        </p>
      </div>
      <div className="flex items-center gap-x-6">
        <div
          className={cn(
            "flex items-center hover:cursor-pointer",
            isLikedByUser ? "text-accent" : "text-muted-foreground",
          )}
          onClick={handleLike}
        >
          <Icons.thumbsup className="mr-1 h-4 w-4" />
          <span className="text-sm">{likeCount}</span>
        </div>
        <div
          className={cn(
            "flex items-center hover:cursor-pointer",
            isDislikedByUser ? "text-accent" : "text-muted-foreground",
          )}
          onClick={handleDislike}
        >
          <Icons.thumbsdown className="mr-1 h-4 w-4" />
          <span className="text-sm">{dislikeCount}</span>
        </div>
        {isUpdating && <Icons.spinner className="h-4 w-4 animate-spin" />}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {typeof post.createdAt === "string"
            ? formatDate(new Date(post.createdAt))
            : formatDate(post.createdAt)}
        </div>
        {currentUser &&
          currentUser.id === post.user.id &&
          (isDeleting ? (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          ) : (
            <Icons.trash
              className="h-4 w-4 hover:cursor-pointer hover:text-red-700"
              onClick={deletePost}
            />
          ))}
      </div>
    </div>
  );
};

const MarketPosts = ({
  posts,
  currentUser,
}: {
  posts: (Post & {
    reactions: Reaction[];
    user: User;
  })[];
  currentUser: NextAuthUser;
}) => {
  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <MarketPost key={post.id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
};

export { MarketPosts };
