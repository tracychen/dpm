import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { Icons } from "../icons";
import { useRouter } from "next/navigation";

const NewPostDialog = ({ marketId }: { marketId: string }) => {
  const [postBody, setPostBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function createNewPost() {
    setIsPosting(true);
    // create new post
    const response = await fetch(`/api/markets/${marketId}/posts`, {
      method: "POST",
      body: JSON.stringify({
        body: postBody,
      }),
    });
    setIsPosting(false);

    if (!response.ok) {
      console.error(response);
      return toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
    toast({
      description: "Created a new post",
    });
    setPostBody("");
    setOpen(false);

    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="full">
          Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Post</DialogTitle>
        </DialogHeader>
        <Textarea
          className="w-full"
          placeholder="Share what you think"
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
          rows={5}
        />
        <DialogFooter>
          <Button
            variant="ghost"
            size="full"
            onClick={() => {
              setPostBody("");
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="full"
            type="submit"
            onClick={createNewPost}
          >
            {isPosting && (
              <Icons.spinner className="mr-1 h-4 w-4 animate-spin" />
            )}
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { NewPostDialog };
