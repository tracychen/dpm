"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Textarea } from "../ui/textarea";
import { Icons } from "../icons";
import { DatePicker } from "../ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { MultipleChoiceOptionsInput } from "./multiple-choice-options-input";
import { createMarketSchema, FormData } from "./schema";

interface CreateMarketDialogProps
  extends React.HTMLAttributes<HTMLFormElement> {
  user: Partial<User>;
}

const MarketTypeQuestions = ({ form }: { form: UseFormReturn<FormData> }) => {
  return (
    <Tabs defaultValue="binary">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="binary">Binary</TabsTrigger>
        <TabsTrigger value="multipleChoice">Multiple choice</TabsTrigger>
      </TabsList>
      <TabsContent value="binary">
        <Separator className="my-4" />
        <div className="flex flex-col gap-1">
          <Label htmlFor="prompt">Question</Label>
          <Input
            id="prompt"
            placeholder="Question"
            className="w-full"
            {...form.register("prompt")}
          />
          {form.formState.errors?.prompt && (
            <p className="px-1 text-xs text-red-600">
              {form.formState.errors.prompt.message}
            </p>
          )}
        </div>
      </TabsContent>
      <TabsContent value="multipleChoice" className="space-y-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="prompt">Question</Label>
          <Input
            id="prompt"
            placeholder="Question"
            className="w-full"
            {...form.register("prompt")}
          />
          {form.formState.errors?.prompt && (
            <p className="px-1 text-xs text-red-600">
              {form.formState.errors.prompt.message}
            </p>
          )}
        </div>
        <MultipleChoiceOptionsInput
          form={form}
          options={form.getValues("options") ?? []}
        />
      </TabsContent>
    </Tabs>
  );
};

export function CreateMarketDialog({
  user,
  className,
  ...props
}: CreateMarketDialogProps) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(createMarketSchema),
    defaultValues: {
      // TODO add default values
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    const response = await fetch(`/api/markets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: data.type,
        prompt: data.prompt,
        description: data.description,
        // TODO add more fields
      }),
    });

    setIsSaving(false);

    if (!response?.ok) {
      return toast({
        title: "Error",
        description: "Error creating market. Please try again.",
        variant: "destructive",
      });
    }

    toast({
      description: "Created market.",
    });

    router.refresh();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="default">
          Create Market
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>Create market</DialogTitle>
          {/* <DialogDescription>Create a new market copy</DialogDescription> */}
        </DialogHeader>
        <form
          className={cn(className, "flex flex-col gap-4")}
          onSubmit={form.handleSubmit(onSubmit)}
          {...props}
        >
          <div className="flex flex-col gap-1">
            {/* <Label>Market Type</Label> */}
            <MarketTypeQuestions form={form} />
          </div>
          {/* TODO multiple choice market options */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Description</Label>
            <Textarea
              id="description"
              placeholder="Description"
              className="h-[107px] w-full"
              {...form.register("description")}
            />
            {form.formState.errors?.description && (
              <p className="px-1 text-xs text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Resolution</Label>
            <Textarea
              id="resolution"
              placeholder="Resolution"
              className="h-[107px] w-full"
              {...form.register("resolution")}
            />
            {form.formState.errors?.description && (
              <p className="px-1 text-xs text-red-600">
                {form.formState.errors.resolution.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Question Closes On</Label>
            <div className="z-10">
              <DatePicker
                selectedDate={form.watch("closingDate")}
                onSelect={(date: Date) => form.setValue("closingDate", date)}
              />
            </div>
          </div>
          {/* TODO P2 thumbnail upload */}
          {/* TODO P2 tags */}
          {/* TODO P2 seed initial liquidity */}

          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isSaving}
            >
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>Create market</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
