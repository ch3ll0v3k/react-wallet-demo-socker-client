import jwt, { Algorithm } from 'jsonwebtoken';
import type { StringValue } from "ms";

export interface IJWTOptions {
  verify: jwt.VerifyOptions;
  decode: jwt.DecodeOptions;
  sign: jwt.SignOptions;
}

// NOTE: library has bug: no matter what algorithm is used, it always uses HS256
export const ALGORITHMS: Algorithm = 'RS256';

export const options: IJWTOptions = {
  verify: {
    // algorithms: [ALGORITHMS], // bug: will throw error anyway
    complete: false, // dont return full info, only payload
  },
  decode: {
    complete: false,
    json: true,
  },
  sign: {
    // algorithm: ALGORITHMS,
    expiresIn: '24h',
  },
};


export interface ICreateSessionTokens {
  access: {
    expiresIn: StringValue | number;
  },
  refresh: {
    expiresIn: StringValue | number;
  },
}

export interface ICreateSession {
  tokens: ICreateSessionTokens;
  hash: string;
  session: {
    expiresAt: StringValue | number;
  },
}


export interface ICreateToken {
  access: string;
  refresh: string;
}
