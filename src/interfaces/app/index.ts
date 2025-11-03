export type TVersion = `${number}.${number}.${number}` & { _type?: 'Version' };
export type UUID = `${string}-${string}-${string}-${string}-${string}` & { _type?: 'UUID' };

export type bn = bigint & { _type?: 'bigint' };
export type bnString = `${number}` & { _type?: 'bigint: <as string>' };

export type float = number & { _type?: 'float<4>' };
export type ufloat = number & { _type?: 'ufloat<4>' };

export type float64 = number & { _type?: 'float<8>' };
export type ufloat64 = number & { _type?: 'ufloat<8>' };

export type float32 = number & { _type?: 'float<4>' };
export type ufloat32 = number & { _type?: 'ufloat<4>' };

export type float8 = number & { _type?: 'float<1>' };
export type ufloat8 = number & { _type?: 'ufloat<1>' };

export type float64String = string & { _type?: 'float<8> string' };
export type floatString = string & { _type?: 'float<4> string' };
export type ufloatString = string & { _type?: 'ufloat<4> string' };
export type ufloat64String = string & { _type?: 'ufloat<8> string' };

export type int = number & { _type?: 'int<4>' };
export type uint = number & { _type?: 'uint<4>' };
export type int64 = number & { _type?: 'int<8>' }; // bit int
export type uint64 = number & { _type?: 'uint<8>' }; // bit int

export type int8 = number & { _type?: 'int<1>' };
export type uint8 = number & { _type?: 'uint<1>' };

export type intString = string & { _type?: 'int<4>string' } | int;
export type int64String = string & { _type?: 'int<8>string' } | int64;
export type uintString = string & { _type?: 'uint<4>string' } | uint;
export type uint64String = string & { _type?: 'uint<8>string' } | uint64;
export type uint8String = string & { _type?: 'uint<1>string' } | uint8;
export type int8String = string & { _type?: 'int<1>string' } | int8;

export type numberOrNull = number | null & { _type?: 'number' };
export type text = string & { _type?: 'text' };
export type emptyText = `${string}` & { _type?: 'emptyText' };
export type str = string & { _type?: 'str' };
export type emptyStr = `${string}` & { _type?: 'emptyStr' };

export type bytes = number[] | ArrayBuffer | ArrayLike<int64> | Uint8Array<ArrayBufferLike> | Buffer & { _type?: 'bytes:any' };
export type hexBytesString = string & { _type?: 'hex-bytes:string' };
export type utf8 = `${string}` & { _type?: 'utf8:string' };
export type base58String = `${string}` & { _type?: 'base58:string' };
export type base64String = `${string}` & { _type?: 'base64:string' };
export type base64UrlString = `${string}` & { _type?: 'base64:url:string' };

export type httpUrl = `${('http' | 'https')}://${string}.${string}${`:${number}` | ''}` & { _type?: 'http(s) url' };
export type tcpUrl = `${('tcp')}://${`${string}.${string}.${string}.${string}` | `${string}.${string}`}${`:${number}` | ''}` & { _type?: 'tcp url' };
export type wsUrl = `${('ws' | 'wss')}://${string}${`:${number}` | ''}` & { _type?: 'Websoket url' };

export type DateOrDateString = Date | string;
export type DateOrDateStringOrNull = DateOrDateString | null;

export type ERC10AssetId = `${number}` & { _type?: 'trc10: number => string' };

export enum ETxType {
  default = 'default',
  // ---------------------
  send = 'send',
  receive = 'receive',
  self = 'self',
  swap = 'swap',
  nft = 'nft',
  contractCall = 'contractCall',
}

export enum ETxDirection {
  default = 'default',
  // ---------------------
  in = 'in',
  out = 'out',
  self = 'self',
}

export enum ETxStatus {
  default = 'default',
  // ---------------------
  completed = 'completed',
  pending = 'pending',
  canceled = 'canceled',
  rejected = 'rejected',
}

export enum ELang {
  en = 'en',
  ru = 'ru',
  hi = 'hi',
  id = 'id',
  es = 'es',
  pt = 'pt',
  ge = 'ge',
};

export const langsOrder: ELang[] = [
  ELang.en,
  ELang.ru,
  ELang.hi,
  ELang.es,
  ELang.pt,
  ELang.ge,
];

export enum ESystemFiatCurrency {
  USD = 'USD',
  EUR = 'EUR',
  CAD = 'CAD',
  JPY = 'JPY',
  RUB = 'RUB',
}

export enum ESystemFiatCurrencyPrecision {
  default = 3,
  low = 2,
  medium = 3,
  high = 4,
  matchHighOnProtocol = 8,
}

export enum ESystemCryptoCurrencyPrecision {
  default = 6,
}

export interface IRes<T> {
  success: boolean;
  message: string;
  data: T
}

export const res = <T>(success: boolean, message: string, data: T): IRes<T> => {
  try {
    return { success, message, data };
  } catch (e: any) {
    return { success: false, message: e.message, data: null as T };
  }
}
