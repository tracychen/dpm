import { UserShareWithAddress } from "@/models/Market.model";
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

export function truncateStringMiddle(input: string, length = 16) {
  if (input.length <= length) {
    return input;
  }

  const halfLength = Math.floor(length / 2);
  const firstHalf = input.substring(0, halfLength);
  const secondHalf = input.substring(input.length - halfLength);

  return `${firstHalf}...${secondHalf}`;
}

export function formatDate(date: Date, includeTime = true) {
  if (!includeTime) {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
    return formattedDate;
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  return formattedDate;
}

export function calculatePercentChance(
  userShares: Partial<UserShareWithAddress>[],
) {
  const yesShares = userShares.filter(
    (userShares) => userShares.outcome === "YES",
  );
  const noShares = userShares.filter(
    (userShares) => userShares.outcome === "NO",
  );

  const yesSharesCount = yesShares.reduce(
    (acc, userShares) => acc + userShares.shares,
    0,
  );
  const noSharesCount = noShares.reduce(
    (acc, userShares) => acc + userShares.shares,
    0,
  );

  const totalSharesCount = yesSharesCount + noSharesCount;

  if (totalSharesCount === 0) {
    return 50;
  }

  return Math.round((yesSharesCount / totalSharesCount) * 100);
}
