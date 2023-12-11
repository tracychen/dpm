import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateString(input: string, length = 16) {
  if (input.length > length) {
    return `${input.substring(0, length)}...`;
  }
  return input;
}
