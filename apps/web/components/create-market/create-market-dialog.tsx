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
    <Tabs
      defaultValue="BINARY"
      onValueChange={(value) => {
        form.setValue("type", value);
      }}
    >
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="BINARY">Binary</TabsTrigger>
        <TabsTrigger value="MULTIPLE_CHOICE">Multiple choice</TabsTrigger>
      </TabsList>
      <TabsContent value="BINARY">
        <Separator className="my-4" />
        <div className="flex flex-col gap-1">
          <Label htmlFor="title">Question</Label>
          <Input
            id="title"
            placeholder="Question"
            className="w-full"
            {...form.register("title")}
          />
          {form.formState.errors?.title && (
            <p className="px-1 text-xs text-red-600">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
      </TabsContent>
      <TabsContent value="MULTIPLE_CHOICE" className="space-y-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="title">Question</Label>
          <Input
            id="title"
            placeholder="Question"
            className="w-full"
            {...form.register("title")}
          />
          {form.formState.errors?.title && (
            <p className="px-1 text-xs text-red-600">
              {form.formState.errors.title.message}
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
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createMarketSchema),
    defaultValues: {
      type: "BINARY",
      options: ["Option 1"],
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    console.log(data);

    // TODO replace with correct endpoint
    const response = await fetch("/api/markets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        resolution: data.resolution,
        topic: data.topic,
        marketType: data.type,
        closeAt: data.closingDate,
        options: data.options,
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
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset();
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="default">
          Create Market
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>Create market</DialogTitle>
        </DialogHeader>
        <form
          className={cn(className, "flex flex-col gap-4")}
          onSubmit={form.handleSubmit(onSubmit)}
          {...props}
        >
          <div className="flex flex-col gap-1">
            <MarketTypeQuestions form={form} />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="topic">Add topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Science, Politics"
              className="w-full"
              {...form.register("topic")}
            />
            {form.formState.errors?.topic && (
              <p className="px-1 text-xs text-red-600">
                {form.formState.errors.topic.message}
              </p>
            )}
          </div>
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
