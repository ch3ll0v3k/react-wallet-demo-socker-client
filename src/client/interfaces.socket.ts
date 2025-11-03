import { float64, DateOrDateString, bnString, hexBytesString, ufloat64, uint64 } from "../app";
import { ETxDirection, ETxStatus, ETxType } from "../app";

interface IRes<T> {
  success: boolean;
  message: string;
  data: T
}

export enum ESocketEvents {
  onAuthenticationRes = 'onAuthenticationRes',
  onBalancesUpdateRes = 'onBalancesUpdateRes',
  onAssetPriceUpdateRes = 'onAssetPriceUpdateRes',
  onNewTransactionsUpdatedRes = 'onNewTransactionsUpdatedRes',
  onTransactionsUpdatedRes = 'onTransactionsUpdatedRes',
}

export interface IOnAuthenticationRes extends IRes<{
  session: string;
}> { };

export interface IOnBalancesUpdateRes extends IRes<{
  defiAddressId: uint64;
  symbol: string;
  balanceUsd: ufloat64;
  balanceFloat: ufloat64;
  balanceNative: bnString;
}> { };

export interface IOnTransactionsUpdatedRes extends IRes<{
  id: uint64;
  hash: hexBytesString;
  src: string; // TAnyAddress;
  dest: string; // TAnyAddress;
  isNftTx: boolean;
  isTokenTx: boolean;
  txStatus: ETxStatus;
  direction: ETxDirection;
  txType: ETxType;
  amountUsd: ufloat64;
  amountFloat: ufloat64;
  amountNative: bnString;
  isRejected: boolean;
  rejectedAt: DateOrDateString;
  createdAt: DateOrDateString;
}> { };

export interface IOnNewTransactionsUpdatedRes extends IRes<{
  id: uint64;
  hash: hexBytesString;
  src: string; // TAnyAddress;
  dest: string; // TAnyAddress;
  isNftTx: boolean;
  isTokenTx: boolean;
  txStatus: ETxStatus;
  direction: ETxDirection;
  txType: ETxType;
  amountUsd: ufloat64;
  amountFloat: ufloat64;
  amountNative: bnString;
  isRejected: boolean;
  rejectedAt: DateOrDateString;
  createdAt: DateOrDateString;
}> { };

export interface IOnAssetPriceUpdateRes extends IRes<{
  symbol: string;
  currentPriceInUSD: ufloat64;
  priceChangeIn24H: float64;
}> { };
