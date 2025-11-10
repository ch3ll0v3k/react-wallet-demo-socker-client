import { float64, DateOrDateString, bnString, hexBytesString, ufloat64, uint64 } from "../interfaces/app";
import { ETxDirection, ETxStatus, ETxType } from "../interfaces/app";

interface IRes<T> {
  success: boolean;
  message: string;
  data: T
}

export enum ESocketEvents {
  onAuthentication = 'onAuthentication',

  onBalancesUpdate = 'onBalancesUpdate',
  onAssetPriceUpdate = 'onAssetPriceUpdate',
  onNewTransaction = 'onNewTransaction',
  onTransactionUpdated = 'onTransactionUpdated',
}

export interface IOnAuthenticationRes extends IRes<{
  session: string;
}> { };


export interface IOnBalancesUpdateRes extends IRes<{
  defiAccountId: uint64;
  defiAddressId: uint64;
  symbol: string;
  balanceUsd: ufloat64;
  balanceFloat: ufloat64;
  balanceNative: bnString;
}> { };

export interface IOnTransactionUpdatedRes extends IRes<{
  id: uint64;
  hash: hexBytesString;
  src: string; // TAnyAddress;
  dest: string; // TAnyAddress;
  symbol: string;
  isNftTx: boolean;
  isTokenTx: boolean;
  txStatus: ETxStatus;
  direction: ETxDirection;
  txType: ETxType;
  amountUsd: ufloat64;
  amountFloat: ufloat64;
  amountNative: bnString;
  createdAt: DateOrDateString;
}> { };

export interface IOnNewTransactionRes extends IRes<{
  id: uint64;
  hash: hexBytesString;
  src: string; // TAnyAddress;
  dest: string; // TAnyAddress;
  symbol: string;
  isNftTx: boolean;
  isTokenTx: boolean;
  txStatus: ETxStatus;
  direction: ETxDirection;
  txType: ETxType;
  amountUsd: ufloat64;
  amountFloat: ufloat64;
  amountNative: bnString;
  createdAt: DateOrDateString;
}> { };

export interface IOnAssetPriceUpdateRes extends IRes<{
  symbol: string;
  currentPriceInUSD: ufloat64;
  priceChangeIn24H: float64;
}> { };
