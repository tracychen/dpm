# DPM - TBW Decentralized Prediction Market

Monorepo for a Decentralized Prediction Market web app with the following features:

- Create a prediction market
- Buy and sell shares of a prediction market

You can try out the app at [here](https://dpm-web.vercel.app).

## What's inside?

This monorepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo
- `database`: stores additional metadata and user information
- `contracts`: contains the smart contract for a betting market

Each package/app is in [TypeScript](https://www.typescriptlang.org/). Contracts are written in [Solidity](https://docs.soliditylang.org/en/v0.8.18/).

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [shadcn/ui](https://ui.shadcn.com/) and [Radix](https://www.radix-ui.com/) for customizable UI components
- [NextAuth](https://next-auth.js.org/) for user authentication
- [RainbowKit](https://www.rainbowkit.com/docs/introduction) for wallet connection

## Development

### Web App Setup

To run the web app, you will need to copy the `packages/web/.env.template` file to `packages/web/.env` in order for the app to have the necessary environment variables to run.

```bash
cp packages/web/.env.template packages/web/.env
```

Update the following environment variables in your new `.env` file:

- Update the `NEXTAUTH_URL` in your `.env` to match the URL of your web app. If you are running locally, you can use `http://localhost:3000`.

- Update `NEXT_PUBLIC_WALLET_CONNECT_ID` with your own Wallet Connect ID. You can get one for free [here](https://www.walletconnect.com/).

### Build

To build all apps and packages, run the following command:

```bash
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```bash
yarn run dev
```
