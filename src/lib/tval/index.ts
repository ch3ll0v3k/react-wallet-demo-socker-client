import { isUtf8 } from "node:buffer";
type UUID = string;
import dt from "../dt";

const _module = 'tval';

export interface IObject {
  [key: string | number | symbol]: any
}

// export interface IRes {
//   success: boolean;
//   message: string;
//   data?: any;
// }

export interface IGetPosNumber extends IObject {
  floor?: boolean;
  min?: number | boolean;
  max?: number | boolean;
  abs?: boolean;
  toFixed?: number | boolean;
}

const mPhoneRegExp = new RegExp(/^([+]?)([\d]{8,15})$/);
const mEmailRegExp = new RegExp(/^([a-zA-Z0-9.\-_+=$|]){1,58}([@]{1})([a-zA-Z0-9.\-_]){1,58}([.]){1}(.)?([a-zA-Z0-9.\-_]){1,24}$/);
const mUUIDRegExp = /^([a-f0-9]{8})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{12})$/i;

class LTVal {
  constructor() { }

  isString(value: any): value is string {
    return typeof value === "string";
  }

  isArray(value: any): value is any[] {
    return Array.isArray(value);
  }

  isBuffer(value: any): value is Buffer {
    return Buffer.isBuffer(value);
  }

  isObject(value: any): value is {} /*| IObject*/ {
    return (
      typeof value === "object" &&
      !this.isNull(value) &&
      !this.isArray(value) &&
      !this.isArrayBuffer(value)
    );
  }

  isNull(value: any): value is null {
    return typeof value === "object" && value === null;
  }

  isNaN(value: any): value is typeof NaN {
    return typeof value === "number" && isNaN(value);
  }

  isUndefined(value: any): value is undefined {
    return typeof value === "undefined";
  }

  isUndefinedOrNull(value: any): value is (undefined | null) {
    return this.isUndefined(value) || this.isNull(value);
  }

  isBool(value: any): value is boolean {
    return typeof value === "boolean";
  }

  isBoolean(value: any): value is boolean {
    return this.isBool(value);
  }

  isInfinity(value: any): value is typeof Infinity {
    return typeof value === "number" && Math.abs(value) === Infinity;
  }

  isNumber(value: any): value is number {
    return (
      !this.isNaN(value) &&
      typeof value === "number" &&
      Math.abs(value) !== Infinity
    );
  }

  isPosNumber(value: any): value is number {
    return this.isNumber(value) && value > 0;
  }

  isNegNumber(value: any): value is number {
    return this.isNumber(value) && value < 0;
  }

  isFunction(value: any): value is Function {
    return typeof value === "function";
  }

  isArrayBuffer(value: any): value is ArrayBuffer {
    return value instanceof ArrayBuffer && this.isNumber(value?.byteLength);
  }

  getString(value: any, defaultValue = ""): string {
    return this.isString(value) && value.length
      ? value
      : this.isString(defaultValue)
        ? defaultValue
        : "";
  }

  getJsonStringFromAny(value: any): string {
    try {
      const result = JSON.stringify(value);
      return result;
    } catch (e: any) {
      try {
        const result = ((value || '') as string).toString()
        return result;
      } catch (e: any) {
        return `${value}`;
      }
    }
  }

  getArray(value: any, defaultValue = []): any[] {
    return this.isArray(value)
      ? value
      : this.isArray(defaultValue)
        ? defaultValue
        : [];
  }

  getObject(value: any, defaultValue = {}): IObject {
    return this.isObject(value) && this.isFunction(value.hasOwnProperty)
      ? value
      : this.isObject(defaultValue)
        ? defaultValue
        : {};
  }

  getObjectAs<T>(value: T, defaultValue: T = {} as T): Partial<T> {
    return this.isObject(value) && this.isFunction(value.hasOwnProperty)
      ? value as T
      : this.isObject(defaultValue)
        ? defaultValue
        : {} as T;
  }

  getFunction(value: any, defaultValue = Function): Function {
    return this.isFunction(value)
      ? value
      : this.isFunction(defaultValue)
        ? defaultValue
        : () => { };
  }

  isDateString(value: any): value is Date {
    try {
      const not = (
        !this.isArray(value)
        &&
        !this.isNumber(value)
        &&
        !this.isNull(value)
        &&
        !this.isArray(value)
        &&
        !this.isBuffer(value)
        &&
        !this.isObject(value)
        &&
        !this.isNaN(value)
        &&
        !this.isFunction(value)
        &&
        !this.isBoolean(value)
        &&
        !this.isArrayBuffer(value)
        &&
        !this.isInfinity(value)
        &&
        !this.isUndefined(value)
        &&
        !this.isNull(value)
      );
      return not && dt!!.isValidDatetime(value);
    } catch (e: any) {
      return false;
    }
  }

  getBoolFromValue(value: any): boolean {
    if (this.isString(value)) {
      if (value.trim().toLowerCase() === "true")
        return true;
      if (value.trim().toLowerCase() === "false")
        return false;

      return false;
    };

    if (this.isPosNumber(+value)) return !!+value;
    return !!value;
  }

  getBooleanFromValue(value: any): boolean {
    return this.getBoolFromValue(value);
  }

  getNumber(value: any, { floor = false, abs = false, toFixed = false } = {}): number {
    if (!this.isNumber(+value)) return 0;
    let res = value;
    res = abs ? Math.abs(res) : res;
    res = floor ? Math.floor(+res) : +res;
    return this.isPosNumber(toFixed) ? +res.toFixed(+toFixed) : res;
  }

  getPosNumber(
    value: any,
    P: IGetPosNumber
  ): number {

    const floor = this.isUndefinedOrNull(P.floor) ? false : P.floor;
    const min = this.isUndefinedOrNull(P.min) ? false : P.min;
    const max = this.isUndefinedOrNull(P.max) ? false : P.max;
    const abs = this.isUndefinedOrNull(P.abs) ? false : P.abs;
    const toFixed = this.isUndefinedOrNull(P.toFixed) ? false : P.toFixed;

    if (!this.isNumber(+value)) return 0;
    let ret = value;
    ret = abs ? Math.abs(ret) : ret;
    ret = floor ? Math.floor(+ret) : +ret;

    ret =
      this.isNumber(min) && ret < min
        ? min
        : this.isNumber(max) && ret > max
          ? max
          : ret;

    return this.isPosNumber(toFixed) ? +(+ret).toFixed(+toFixed) : ret;
  }

  constrainNumber(amount: number, min: number, max: number): number {
    return amount < min ? min : amount >= max ? max : amount;
  }

  isValidPhone(phone: string): boolean {
    if (!this.isString(phone)) return false;
    return mPhoneRegExp.test(phone);
  }

  isValidEmail(email: string): boolean {
    if (!this.isString(email)) return false;
    return mEmailRegExp.test(email);
  }

  getValidAnyProtocolUrl(urlString: string): URL | null {
    try {
      const url = new URL(urlString);
      return url;
    } catch (e: any) {
      console.error(`#${_module}:isValidAnyProtocolUrl: ${e.message}`);
      console.error(`#${_module}:isValidAnyProtocolUrl: (urlString: ${urlString})`);
      return null;
    }
  }

  isValidAnyUrl(urlString: string): boolean {
    const url = this.getValidAnyProtocolUrl(urlString);
    return !!url;
  }

  isValidHttpUrl(urlString: string): boolean {
    const url = this.getValidAnyProtocolUrl(urlString);
    if (!url) return false;
    return !!url.protocol.match('http'); // http(s) including...
  }

  isValidWSUrl(urlString: string): boolean {
    const url = this.getValidAnyProtocolUrl(urlString);
    if (!url) return false;
    return !!url.protocol.match('ws'); // ws(s) including...
  }

  isValidUDPUrl(urlString: string): boolean {
    const url = this.getValidAnyProtocolUrl(urlString);
    if (!url) return false;
    return !!url.protocol.match('upd');
  }

  isValidTPCUrl(urlString: string): boolean {
    const url = this.getValidAnyProtocolUrl(urlString);
    if (!url) return false;
    return !!url.protocol.match('tcp');
  }

  // TODO: replace by isNodeEnv + toLowerCase()?
  isEnv(env: string): boolean {
    return this.isString(env) && env === this.getEnv("NODE_ENV");
  }

  getEnv(key: string, toObject = false): string {
    try {
      if (!this.isString(process.env[key])) return '';
      return toObject ? JSON.parse(process.env[key] || "{}") : process.env[key];
    } catch (e: any) {
      console.error(
        `#ltval:getEnv: ${e.message}  key: [${key}], toObject: [${toObject}]`
      );
      return '';
    }
  }

  getEnvAsObject(key: string): IObject {
    try {
      return JSON.parse(process.env[key] || "{}");
    } catch (e: any) {
      console.error(
        `#ltval:getEnvAsObject: ${e.message} key: [${key}]`
      );
      return {};
    }
  }

  getEnvOnceAsObject(key: string): IObject {
    try {
      const v = process.env[key];
      process.env[key] = '';
      return JSON.parse(v || "{}");
    } catch (e: any) {
      console.error(`#ltval:getEnvOnceAsObject: ${e.message} key: [${key}]`);
      return {};
    }
  }

  getEnvOnce(key: string): string {
    try {
      const v = process.env[key];
      if (!this.isString(v)) return '';
      process.env[key] = '';
      return v || "";
    } catch (e: any) {
      console.error(`#ltval:getEnvOnce: ${e.message} key: [${key}]`);
      return "";
    }
  }

  getEnvAsBool(key: string): boolean {
    try {
      if (!this.isString(process.env[key])) return false;
      return this.getBoolFromValue(process.env[key]);
    } catch (e: any) {
      console.error(`#ltval:getEnvAsBool: ${e.message}  key: [${key}]`);
      return false;
    }
  }

  getEnvAsInt(key: string): number {
    try {
      if (!this.isString(process.env[key])) return 0;
      return this.getNumber(process.env[key], { floor: true, abs: false });
    } catch (e: any) {
      console.error(`#ltval:getEnvAsInt: ${e.message}  key: [${key}]`);
      return 0;
    }
  }

  getEnvAsString(key: string): string {
    try {
      return this.getEnv(key) || "";
    } catch (e: any) {
      console.error(`#ltval:getEnvAsString: ${e.message}  key: [${key}]`);
      return "";
    }
  }

  getEnvAsFloat(key: string): number {
    try {
      if (!this.isString(process.env[key])) return 0;
      return this.getNumber(process.env[key], { floor: false, abs: false });
    } catch (e: any) {
      console.error(`#ltval:getEnvAsFloat: ${e.message}  key: [${key}]`);
      return 0;
    }
  }

  getEnvAs(key: string, as: string): string | number | boolean {
    try {
      switch (as) {
        case 'string':
          return this.getEnv(key);
        case 'number':
        case 'int':
        case 'integer':
          return this.getEnvAsInt(key);
        case 'float':
        case 'double':
          return this.getEnvAsFloat(key);
        case 'boolean':
        case 'bool':
          return this.getEnvAsBool(key);
      }

      return "";

    } catch (e: any) {
      console.error(`#ltval:getEnvAs:(${as}): ${e.message}  key: [${key}]`);
      return false;
    }
  }

  isHexBytes(value: string): boolean {
    const l = value.length;
    return this.isString(value) && /^(0x)?([a-f0-9])*$/i.test(value);
  }

  isSha256(value: string): boolean {
    const l = value.length;
    return this.isString(value) && (l === 64 || l == 66) && /^(0x)?[a-f0-9]{64}$/i.test(value);
  }

  isValidUUID(uuid: UUID | string): boolean {
    if (!this.isString(uuid)) return false;
    if (uuid.length !== 36) return false;
    return !!uuid.match(mUUIDRegExp);
  }

  // res(success: boolean, message: string, data?: any): IRes {
  //   return { success, message, data: data || {} };
  // }

  isValidUtf8(value: string): boolean {
    return isUtf8(Uint8Array.from((value).split('').map((i) => i.charCodeAt(0))))
  }

  async sleep(msec: number): Promise<boolean> {
    return new Promise((res) => {
      setTimeout(() => { res(true) }, msec);
    })
  }

}

const tval = new LTVal();
export default tval;


