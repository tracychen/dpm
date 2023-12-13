import { BettingMarket__factory } from "@dpm/protocol";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Wallet, ethers, providers } from "ethers";

export const provider = new providers.JsonRpcProvider(process.env.FUJI_RPC_URL);

export const fundingWallet = new Wallet(
  process.env.FUNDING_PRIVATE_KEY!,
  provider,
);

export const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.FUNDING_PRIVATE_KEY!,
  "avalanche-fuji",
  {
    clientId: process.env.THIRDWEB_CLIENT_ID!,
    secretKey: process.env.THIRDWEB_SECRET_KEY!,
  },
);

export const airdrop = async (
  address: string,
): Promise<{
  nativeTokenTransactionHash: string;
  erc20TokenTransactionHash: string;
}> => {
  // Airdrop native gas tokens to the user
  const tx = await fundingWallet.sendTransaction({
    to: address,
    value: "500000000000000000", // 0.1
  });
  console.log("Airdrop tx: ", tx);

  // Airdrop erc20 tokens to the user (contract addr 0x1157c6cc6e3679D885D0F31d84A66Ec27A88420d)
  const erc20Contract = await sdk.getContract(
    process.env.ERC20_CONTRACT_ADDRESS!,
  );
  const transferTx = await erc20Contract.erc20.transfer(address, "100");
  console.log("ERC20 transfer tx: ", transferTx);

  return {
    nativeTokenTransactionHash: tx.hash,
    erc20TokenTransactionHash: transferTx.receipt.transactionHash,
  };
};

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

export const approveSpending = async (
  privateKey: string,
  amount: number,
  marketContractAddress: string,
) => {
  const userSdk = ThirdwebSDK.fromPrivateKey(privateKey, "avalanche-fuji", {
    clientId: process.env.THIRDWEB_CLIENT_ID!,
    secretKey: process.env.THIRDWEB_SECRET_KEY!,
  });
  const erc20Contract = await userSdk.getContract(
    process.env.ERC20_CONTRACT_ADDRESS!,
  );
  const tx = await erc20Contract.erc20.setAllowance(
    marketContractAddress,
    amount,
  );
  return tx;
};

export const sellShares = async (
  marketContractAddress: string,
  privateKey: string,
  outcome: number,
  optionId: number,
  shares: number,
) => {
  // Sell shares
  const marketContract = BettingMarket__factory.connect(
    marketContractAddress,
    new Wallet(privateKey, provider),
  );

  const sellTx = await marketContract.sellShares(
    optionId,
    ethers.utils.parseEther(shares.toString()),
    outcome,
  );
  console.log("Sell shares tx: ", sellTx);
  await sellTx.wait();
  return sellTx;
};

export const buyShares = async (
  marketContractAddress: string,
  privateKey: string,
  outcome: number,
  optionId: number,
  shares: number,
) => {
  // Approve spending
  const tx = await approveSpending(privateKey, shares, marketContractAddress);
  console.log("Approve spending tx: ", tx);

  // Buy shares
  const marketContract = BettingMarket__factory.connect(
    marketContractAddress,
    new Wallet(privateKey, provider),
  );
  const buyTx = await marketContract.purchaseShares(
    optionId,
    ethers.utils.parseEther(shares.toString()),
    outcome,
  );
  console.log("Buy shares tx: ", buyTx);
  await buyTx.wait();
  return buyTx;
};
