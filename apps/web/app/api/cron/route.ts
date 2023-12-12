import { markets } from "@/lib/data";
import { prisma } from "@dpm/database";

function generateRandomValueBetween(x: number, y: number): number {
  if (x >= y) {
    throw new Error("Invalid range: x must be less than y");
  }

  const randomValue = Math.random(); // Generate a random value between 0 and 1
  const range = y - x; // Calculate the range between x and y
  const scaledValue = randomValue * range; // Scale the random value to the desired range
  const roundedValue = x + Math.round(scaledValue * 100) / 100; // Round to two decimal places

  return roundedValue;
}

export async function GET() {
  for (const market of markets) {
    for (const option of market.options) {
      // get previous value
      const previousValue = await prisma.marketOptionHistory.findFirst({
        where: {
          marketId: market.id,
          optionId: option.label,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      let value = 0.5;
      if (previousValue) {
        value = previousValue.value;
      }
      const newDummyValue = generateRandomValueBetween(
        value - 0.2,
        value + 0.2,
      );

      const moh = await prisma.marketOptionHistory.create({
        data: {
          marketId: market.id,
          optionId: option.label,
          value: newDummyValue,
        },
      });

      console.log("Created market option history", moh);
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
    }),
  );
}
