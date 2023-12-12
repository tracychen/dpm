/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface BettingMarketInterface extends utils.Interface {
  functions: {
    "getOptionDetails(uint256)": FunctionFragment;
    "marketTitle()": FunctionFragment;
    "options(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "paymentToken()": FunctionFragment;
    "purchaseShares(uint256,uint256,uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "sellShares(uint256,uint256,uint256)": FunctionFragment;
    "setPaymentToken(address)": FunctionFragment;
    "totalOptions()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "userOptions(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getOptionDetails"
      | "marketTitle"
      | "options"
      | "owner"
      | "paymentToken"
      | "purchaseShares"
      | "renounceOwnership"
      | "sellShares"
      | "setPaymentToken"
      | "totalOptions"
      | "transferOwnership"
      | "userOptions"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getOptionDetails",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "marketTitle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "options",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "paymentToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "purchaseShares",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sellShares",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPaymentToken",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalOptions",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "userOptions",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getOptionDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "marketTitle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "options", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "paymentToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "purchaseShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sellShares", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setPaymentToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalOptions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userOptions",
    data: BytesLike
  ): Result;

  events: {
    "MarketCreated(string,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "SharesPurchased(uint256,address,uint256)": EventFragment;
    "SharesSold(uint256,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MarketCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SharesPurchased"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SharesSold"): EventFragment;
}

export interface MarketCreatedEventObject {
  _marketTitle: string;
  _totalOptions: BigNumber;
}
export type MarketCreatedEvent = TypedEvent<
  [string, BigNumber],
  MarketCreatedEventObject
>;

export type MarketCreatedEventFilter = TypedEventFilter<MarketCreatedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface SharesPurchasedEventObject {
  _optionId: BigNumber;
  _buyer: string;
  _amount: BigNumber;
}
export type SharesPurchasedEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  SharesPurchasedEventObject
>;

export type SharesPurchasedEventFilter = TypedEventFilter<SharesPurchasedEvent>;

export interface SharesSoldEventObject {
  _optionId: BigNumber;
  _seller: string;
  _amount: BigNumber;
}
export type SharesSoldEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  SharesSoldEventObject
>;

export type SharesSoldEventFilter = TypedEventFilter<SharesSoldEvent>;

export interface BettingMarket extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BettingMarketInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getOptionDetails(
      _optionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    marketTitle(overrides?: CallOverrides): Promise<[string]>;

    options(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        totalShares: BigNumber;
        yesShares: BigNumber;
        noShares: BigNumber;
      }
    >;

    owner(overrides?: CallOverrides): Promise<[string]>;

    paymentToken(overrides?: CallOverrides): Promise<[string]>;

    purchaseShares(
      _optionId: BigNumberish,
      _amount: BigNumberish,
      _outcome: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    sellShares(
      _optionId: BigNumberish,
      _amount: BigNumberish,
      _outcome: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setPaymentToken(
      _paymentTokenAddress: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    totalOptions(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    userOptions(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        totalShares: BigNumber;
        yesShares: BigNumber;
        noShares: BigNumber;
      }
    >;
  };

  getOptionDetails(
    _optionId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber, BigNumber]>;

  marketTitle(overrides?: CallOverrides): Promise<string>;

  options(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      totalShares: BigNumber;
      yesShares: BigNumber;
      noShares: BigNumber;
    }
  >;

  owner(overrides?: CallOverrides): Promise<string>;

  paymentToken(overrides?: CallOverrides): Promise<string>;

  purchaseShares(
    _optionId: BigNumberish,
    _amount: BigNumberish,
    _outcome: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  sellShares(
    _optionId: BigNumberish,
    _amount: BigNumberish,
    _outcome: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setPaymentToken(
    _paymentTokenAddress: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  totalOptions(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  userOptions(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      totalShares: BigNumber;
      yesShares: BigNumber;
      noShares: BigNumber;
    }
  >;

  callStatic: {
    getOptionDetails(
      _optionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    marketTitle(overrides?: CallOverrides): Promise<string>;

    options(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        totalShares: BigNumber;
        yesShares: BigNumber;
        noShares: BigNumber;
      }
    >;

    owner(overrides?: CallOverrides): Promise<string>;

    paymentToken(overrides?: CallOverrides): Promise<string>;

    purchaseShares(
      _optionId: BigNumberish,
      _amount: BigNumberish,
      _outcome: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    sellShares(
      _optionId: BigNumberish,
      _amount: BigNumberish,
      _outcome: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setPaymentToken(
      _paymentTokenAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    totalOptions(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    userOptions(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        totalShares: BigNumber;
        yesShares: BigNumber;
        noShares: BigNumber;
      }
    >;
  };

  filters: {
    "MarketCreated(string,uint256)"(
      _marketTitle?: null,
      _totalOptions?: null
    ): MarketCreatedEventFilter;
    MarketCreated(
      _marketTitle?: null,
      _totalOptions?: null
    ): MarketCreatedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "SharesPurchased(uint256,address,uint256)"(
      _optionId?: BigNumberish | null,
      _buyer?: string | null,
      _amount?: null
    ): SharesPurchasedEventFilter;
    SharesPurchased(
      _optionId?: BigNumberish | null,
      _buyer?: string | null,
      _amount?: null
    ): SharesPurchasedEventFilter;

    "SharesSold(uint256,address,uint256)"(
      _optionId?: BigNumberish | null,
      _seller?: string | null,
      _amount?: null
    ): SharesSoldEventFilter;
    SharesSold(
      _optionId?: BigNumberish | null,
      _seller?: string | null,
      _amount?: null
    ): SharesSoldEventFilter;
  };

  estimateGas: {
    getOptionDetails(
      _optionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    marketTitle(overrides?: CallOverrides): Promise<BigNumber>;

    options(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    paymentToken(overrides?: CallOverrides): Promise<BigNumber>;

    purchaseShares(
      _optionId: BigNumberish,
      _amount: BigNumberish,
      _outcome: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    sellShares(
      _optionId: BigNumberish,
      _amount: BigNumberish,
      _outcome: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setPaymentToken(
      _paymentTokenAddress: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    totalOptions(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    userOptions(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getOptionDetails(
      _optionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    marketTitle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    options(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paymentToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    purchaseShares(
      _optionId: BigNumberish,
      _amount: BigNumberish,
      _outcome: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    sellShares(
      _optionId: BigNumberish,
      _amount: BigNumberish,
      _outcome: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setPaymentToken(
      _paymentTokenAddress: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    totalOptions(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    userOptions(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
