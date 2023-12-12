import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.FUNDING_PRIVATE_KEY!,
  "avalanche-fuji",
  {
    clientId: process.env.THIRDWEB_CLIENT_ID!,
    secretKey: process.env.THIRDWEB_SECRET_KEY!,
  },
);

export const getTokenBalance = async (address: string) => {
  const erc20Contract = await sdk.getContract(
    process.env.ERC20_CONTRACT_ADDRESS!,
  );
  const balance = await erc20Contract.erc20.balanceOf(address);
  return balance;
};

export const sendTokens = async (
  privateKey: string,
  toAddress: string,
  amount: number,
) => {
  const userSdk = ThirdwebSDK.fromPrivateKey(privateKey, "avalanche-fuji", {
    clientId: process.env.THIRDWEB_CLIENT_ID!,
    secretKey: process.env.THIRDWEB_SECRET_KEY!,
  });
  const erc20Contract = await userSdk.getContract(
    process.env.ERC20_CONTRACT_ADDRESS!,
  );
  const tx = await erc20Contract.erc20.transfer(toAddress, amount);
  return tx;
};
