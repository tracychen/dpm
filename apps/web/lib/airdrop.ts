import { Wallet, providers } from "ethers";
import { sdk } from "./thirdweb";

export const provider = new providers.JsonRpcProvider(process.env.FUJI_RPC_URL);

export const fundingWallet = new Wallet(
  process.env.FUNDING_PRIVATE_KEY!,
  provider,
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

  await tx.wait();

  console.log("tx", tx);

  // Airdrop erc20 tokens to the user (contract addr 0x1157c6cc6e3679D885D0F31d84A66Ec27A88420d)
  const erc20Contract = await sdk.getContract(
    process.env.ERC20_CONTRACT_ADDRESS!,
  );
  const transferTx = await erc20Contract.erc20.transfer(address, "10"); // 10

  console.log("transferTx", transferTx);

  return {
    nativeTokenTransactionHash: tx.hash,
    erc20TokenTransactionHash: transferTx.receipt.transactionHash,
  };
};
