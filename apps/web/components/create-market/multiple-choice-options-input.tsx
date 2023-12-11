"use client";

import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./schema";

const MultipleChoiceOptionsInput = ({
  className,
  label,
  options,
  form,
  ...props
}: {
  className?: string;
  label?: string;
  options: string[];
  form: UseFormReturn<FormData>;
}) => {
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    if (focusIndex !== null) {
      console.log("Setting focus: " + focusIndex);
      form.setFocus(`options.${focusIndex}`, {
        shouldSelect: true,
      });
      setFocusIndex(null);
    }
  }, [focusIndex]);

  const deleteOptionByIndex = (indexToDelete: number) => {
    const options = form.getValues("options") ?? [];
    form.setValue(
      "options",
      options.filter((_, i) => i !== indexToDelete),
    );
    setFocusIndex(indexToDelete - 1);
  };

  const addOptionAtIndex = (index?: number) => {
    const options = form.getValues("options") ?? [];
    const placement = index ?? options.length;
    options.splice(placement, 0, "");
    form.setValue("options", [...options]);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {label && <Label>{label}</Label>}
      <div className="flex flex-col gap-y-4">
        <div className="space-y-4">
          {(form.getValues("options") ?? []).map((option, index) => (
            <div className="flex w-full items-center gap-2" key={index}>
              <span className="w-6 text-sm font-semibold text-muted-foreground">
                {index + 1}.
              </span>
              <Input
                name={`options.${index}`}
                placeholder="Type your answer..."
                {...form.register(`options.${index}`)}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addOptionAtIndex(index + 1);
                    setFocusIndex(index + 1);
                  } else if (
                    e.key === "Backspace" &&
                    form.watch(`options.${index}`) === ""
                  ) {
                    e.preventDefault();
                    deleteOptionByIndex(index);
                    setFocusIndex(index - 1);
                  }
                }}
              />
              <Icons.close
                className="h-4 w-4 hover:cursor-pointer hover:text-red-700"
                onClick={() => deleteOptionByIndex(index)}
              />
            </div>
          ))}
        </div>

        <div className="flex items-start">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              addOptionAtIndex();
              const newFocusIndex =
                (form.getValues("options")?.length ?? 0) - 1;
              setFocusIndex(newFocusIndex);
            }}
          >
            Add option
          </Button>
        </div>
      </div>
    </div>
  );
};

export { MultipleChoiceOptionsInput };
