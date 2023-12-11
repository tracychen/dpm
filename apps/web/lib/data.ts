import { Market, MarketType } from "@/models/Market.model";

export const tags: string[] = [
  "All",
  "Crypto",
  "News",
  "US election",
  "Joe Biden",
  "Education",
  "Middle East",
];

export const markets: Market[] = [
  {
    id: "1",
    prompt: "Harvard application numbers",
    percentChance: 41,
    change: "0.6",
    direction: "down",
    date: "Dec 29, 2023",
    bettedCount: 45000,
    tag: "Education",
    imageUrl: "https://picsum.photos/200?random=1",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    type: MarketType.BINARY,
    options: [
        {
          label: "[TODO] binary layout",
          amountBet: 45000,
          price: 0.5,
        },
    ]
  },
  {
    id: "2",
    prompt: "University presidents ousted",
    percentChance: 35,
    change: "0.6",
    direction: "down",
    date: "Dec 29, 2023",
    bettedCount: 45000,
    tag: "Education",
    imageUrl: "https://picsum.photos/200?random=1",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    options: [
      {
        label: "Donald Trump",
        amountBet: 45000,
        price: 0.5,
      },
      {
        label: "Joe Biden",
        amountBet: 45000,
        price: 0.5,
      },
      {
        label: "Kanye West",
        amountBet: 145000,
        price: 0.5,
      },
    ],
    type: MarketType.MULTIPLE_CHOICE,
  },
  {
    id: "3",
    prompt: "Time's person of the year",
    percentChance: 92,
    change: "3.5",
    direction: "down",
    date: "Dec 29, 2023",
    bettedCount: 45000,
    tag: "News",
    imageUrl: "https://picsum.photos/200?random=1",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    options: [
      {
        label: "Donald Trump",
        amountBet: 45000,
        price: 0.5,
      },
      {
        label: "Joe Biden",
        amountBet: 45000,
        price: 0.5,
      },
      {
        label: "Kanye West",
        amountBet: 145000,
        price: 0.5,
      },
    ],
    type: MarketType.MULTIPLE_CHOICE,
  },
  {
    id: "4",
    prompt: "Trump and Biden both win a nomination?",
    percentChance: 92,
    change: "3.5",
    direction: "down",
    date: "Dec 29, 2023",
    bettedCount: 45000,
    tag: "US election",
    imageUrl: "https://picsum.photos/200?random=1",
    type: MarketType.BINARY,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    options: [
        {
          label: "[TODO] binary layout",
          amountBet: 45000,
          price: 0.5,
        },
    ]
  },
  {
    id: "5",
    prompt: "Time's person of the year",
    percentChance: 92,
    change: "3.5",
    direction: "down",
    date: "Dec 29, 2023",
    bettedCount: 45000,
    tag: "News",
    imageUrl: "https://picsum.photos/200?random=1",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    options: [
      {
        label: "Donald Trump",
        amountBet: 45000,
        price: 0.5,
      },
      {
        label: "Joe Biden",
        amountBet: 45000,
        price: 0.5,
      },
      {
        label: "Kanye West",
        amountBet: 145000,
        price: 0.5,
      },
    ],
    type: MarketType.MULTIPLE_CHOICE,
  },
];
