import tval from "../../../lib/tval";

const gray = "\u001b[01;30m";
const red = "\u001b[01;31m";
const green = "\u001b[01;32m";
const yellow = "\u001b[01;33m";
const blue = "\u001b[01;34m";
const purple = "\u001b[01;35m";
const blue2 = "\u001b[01;36m";
const white = "\u001b[01;37m";
const endl = "\u001b[0m";

const R = (value: any) => `${red}${value}${endl}`;
const G = (value: any) => `${green}${value}${endl}`;
const B = (value: any) => `${blue}${value}${endl}`;
const P = (value: any) => `${purple}${value}${endl}`;
const Y = (value: any) => `${yellow}${value}${endl}`;
const W = (value: any) => `${white}${value}${endl}`;
const B2 = (value: any) => `${blue2}${value}${endl}`;

export { R, G, B, P, Y, W, B2 };

declare global {
  interface Console {
    json(input: any, fn?: any, format?: string | number | undefined): void;
    toJson(input: any, fn?: any, format?: string | number | undefined): any;
    line(): void;
    deepClone(data: any): Object;
    ok(input: any): void;
  }
}

const BigIntReplaces = (key: string, value: any) => typeof value === "bigint" ? { $bigint: value.toString() } : value;

const circularStructure = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return `[circular structure]`;
      }


      value = BigIntReplaces(key, value);
      seen.add(value);
    }
    if (typeof value === "function") {
      return `[function]`;
    }
    value = BigIntReplaces(key, value);
    return value;
  };
};

// prettier-ignore
console.json = function (input: any, fn: any = undefined, format: string | number | undefined = 2): void {
  try {
    fn = fn || circularStructure();
    const json_t = JSON.stringify(input, fn, format);
    console.log(json_t);
  } catch (e: any) {
    console.error(`console.json(input: any): ${e.message}`);
  }
};

console.toJson = function (input: any, fn: any = undefined, format: string | number | undefined = 2): any {
  try {
    fn = fn || circularStructure();
    const json_t = JSON.stringify(input, fn, format);
    return json_t;
  } catch (e: any) {
    console.error(`console.json(input: any): ${e.message}`);
    return 'error-encoding-json';
  }
};

const reviver = (key, value) => {
  return (
    value !== null &&
    typeof value === "object" &&
    "$bigint" in value &&
    typeof value.$bigint === "string"
  )
    ? BigInt(value.$bigint)
    : value;
}

const JSONparse = JSON.parse;

JSON.parse = (payload: string) => {
  const parsed = JSONparse(payload, reviver);
  return parsed;
};

console.ok = function (input: string): void {
  try {

    console.log(G(input));
  } catch (e: any) {
    console.error(`console.ok(input: string): ${e.message}`);
  }
};

// prettier-ignore
console.line = function (): void {
  const line = ' ----  ----  ----  ----  ----  ----  ----  ----  ---- ';
  console.log(line);
};


console.deepClone = (data: any) => {

  try {

    if (!data) return data;

    let res = tval.isArray(data) ? [] : tval.isObject(data) ? {} : false;
    if (!res) {
      return data;
    }

    // let foundIndexes = false;
    // let foundKeys = false;

    if (tval.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const isObject = typeof data[i] === 'object';
        const isArray = tval.isArray(data[i]);
        if (isArray || isObject) {
          // foundIndexes = true;
          res[i] = console.deepClone(data[i]);
        } else {
          res[i] = data[i];
        }
      }
    }

    if (tval.isObject(data)) {
      for (const key of Object.keys(data)) {
        const isObject = tval.isObject(data[key]);
        const isArray = tval.isArray(data[key]);
        if (isArray || isObject) {
          // foundKeys = true;
          res[key] = console.deepClone(data[key]);
        } else {
          res[key] = data[key];
        }
      }
    }

    return res;
  } catch (e: any) {
    console.error(e);
    console.log({ data });
    JSON.parse(JSON.stringify(data));
  }

}


export { };
