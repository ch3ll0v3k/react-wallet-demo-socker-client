import jwt from 'jsonwebtoken';
import tval from "@app/lib/tval";

import { options } from './interfaces';
import { IRes, res } from '@app/interfaces/app';

const _module = 'JWT';

const decode = <T>(payload: string, complete: boolean = false, key: string = ''): IRes<T> => {
  try {
    if (!tval.isString(key))
      return res(false, 'Empty key', {} as T);
    const output = jwt.decode(payload, options.decode) as T;
    return res(true, 'successs', output);
  } catch (e: any) {
    return res(false, 'Failed to decode data', {} as T);
  }
}

export default {
  decode,
};
