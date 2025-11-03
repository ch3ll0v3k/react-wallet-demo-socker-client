// const moment = require('moment-timezone');
import moment, { Moment, unitOfTime } from 'moment-timezone';
import tval from '../tval';

declare global {
  namespace moment {
    interface moment {
      tzFormat: string;
      humanDateFormat: string;
      humanDatetimeFormat: string;
      humanTimeFormat: string;
      inFormat_0: string;
      inFormat_1: string;
      inFormat_2: string;
    }
  }
}

moment.suppressDeprecationWarnings = true;
moment.defaultFormat = 'YYYY-MM-DDTHH:mm:ss'; // "YYYY-MM-DDTHH:mm:ssZ"

const dt = {
  tzFormat: 'YYYY-MM-DDTHH:mm:ssZ',
  humanDateFormat: 'YYYY-MMM-DD',
  humanDatetimeFormat: 'YYYY-MMM-DD HH:mm',
  humanTimeFormat: 'h:mm a',
  inFormat_0: 'YYYY-MMM-DD HH:mm',
  inFormat_1: 'YYYY/MMM/DD HH:mm',
  inFormat_2: 'YYYY MMM DD HH:mm',
}

export const UTC_ZERO_TIMEZONE = 'Atlantic/Reykjavik';

export enum ETimeFrameName {
  'years' = 'years',
  'months' = 'months',
  'weeks' = 'weeks',
  'days' = 'days',
  'hours' = 'hours',
  'minutes' = 'minutes',
  'seconds' = 'seconds',
}

const _module = 'DT';

const getMicroTime = (): number => {
  const hrTime = process.hrtime()
  const micro = Math.floor((hrTime[0] * 1000000) + (hrTime[1] / 1000));
  return micro;
}

const isValidDatetime = (datetime_t: string): boolean => {
  try {
    // RFC2822/ISO
    return moment(datetime_t).isValid(/*{_isValid: null}*/);
  } catch (e: any) {
    console.error(`#${_module}:isValidDatetime: ${e.message}`);
    return false;
  }
}

const getISODate = (format: string = moment.defaultFormat): string => {
  try {
    return moment().format(format);
  } catch (e: any) {
    console.error(`#${_module}:getISODate: ${e.message}`);
    return '';
  }
}

const getISODateTZ = (format: string = dt.tzFormat): string => {
  try {
    return moment().format(format);
  } catch (e: any) {
    console.error(`#${_module}:getISODateTZ: ${e.message}`);
    return '';
  }
}

const getISODateTZOr = (datetime: any, format: string = moment.defaultFormat): string => {
  try {
    return isValidDatetime(datetime)
      ? moment(datetime).format(format)
      : "";
  } catch (e: any) {
    console.error(`#${_module}:getISODateTZOr: ${e.message}`);
    return '';
  }
}

const getISODateTZOrNull = (datetime: any, format: string = dt.tzFormat): string | null => {
  try {
    return isValidDatetime(datetime)
      ? moment(datetime).format(format)
      : null;
  } catch (e: any) {
    console.error(`#${_module}:getISODateTZOrNull: ${e.message}`);
    return null;
  }
}

const applyTimezone = (
  datetime_t: any, timezone_t = 'America/Los_Angeles', format = moment.defaultFormat
): string => {
  try {
    if (!isValidDatetime(datetime_t)) return 'n/a';
    datetime_t = moment(datetime_t).tz(timezone_t);
    return (format ? datetime_t.format(format) : datetime_t);
  } catch (e: any) {
    console.error(`#${_module}:applyTimezone: ${e.message}`);
    return '';
  }
}

const requireMinAge = (datetime_t: any, minAge = 13): boolean => {
  try {
    const mDate = new Date(datetime_t);
    return (((new Date()).getFullYear() - mDate.getFullYear()) > minAge);
  } catch (e: any) {
    console.error(`#${_module}:requireMinAge: ${e.message}`);
    return false;
  }
}

const getTimePast = (datetime_t: any): string => {
  try {
    if (!isValidDatetime(datetime_t))
      throw Error(`supplied [datetime] is not valid`);
    return moment(datetime_t).fromNow();
  } catch (e: any) {
    console.error(`#${_module}:getTimePast: ${e.message}`);
    return '';
  }
}

export interface IAddOrSubFromCurrentDate {
  amount: number;
  of: ETimeFrameName;
  format?: string;
}

const subFromCurrentDate = ({
  amount, of, format = moment.defaultFormat
}: IAddOrSubFromCurrentDate): string | Moment => {
  try {
    // @ts-ignore
    const moment_t = moment().subtract(amount, of);
    return tval.isString(format) && format.length > 0
      ? moment_t.format(format) // App.getDateFormat() 
      : moment_t;
  } catch (e: any) {
    console.error(`#${_module}:subFromCurrentDate: ${e.message}`);
    return '';
  }
}

const addToCurrentDate = ({
  amount, of, format = moment.defaultFormat
}: IAddOrSubFromCurrentDate): string | Moment => {
  try {
    // @ts-ignore
    const moment_t = moment().add(amount, of);
    return tval.isString(format) && format.length > 0
      ? moment_t.format(format) // App.getDateFormat() 
      : moment_t;
  } catch (e: any) {
    console.error(`#${_module}:addToCurrentDate: ${e.message}`);
    return '';
  }
}

const getStartOf = (datetime_t: any, ofThis: string, format = moment.defaultFormat): string | Moment => {
  try {
    // @ts-ignore
    const date_t = moment(datetime_t).startOf(ofThis);
    format = (!!format) ? moment.defaultFormat : format;
    return format ? date_t.format(format) : date_t;
  } catch (e: any) {
    console.error(`#${_module}:getStartOf: ${e.message}`);
    return '';
  }
}

const getEndOf = (datetime_t: any, ofThis: string, format = moment.defaultFormat): string | Moment => {
  try {
    // @ts-ignore
    const date_t = moment(datetime_t).endOf(ofThis);
    format = (!!format) ? moment.defaultFormat : format;
    return format ? date_t.format(format) : date_t;
  } catch (e: any) {
    console.error(`#${_module}:getEndOf: ${e.message}`);
    return '';
  }
}

const unixTimestampToISO = (timestamp: number, format = ''): string => {
  try {
    // RFC2822/ISO
    return moment((+timestamp) * 1000).format(format ? format : moment.defaultFormat);
  } catch (e: any) {
    console.error(`#${_module}:unixTimestampToISO: ${e.message}`);
    return '';
  }
}

const getTzAtUTCZero = () => {
  return UTC_ZERO_TIMEZONE;
}

export default {
  getMicroTime,
  isValidDatetime,
  getISODate,
  getISODateTZ,
  getISODateTZOr,
  getISODateTZOrNull,
  applyTimezone,
  requireMinAge,
  getTimePast,
  subFromCurrentDate,
  addToCurrentDate,
  getStartOf,
  getEndOf,
  unixTimestampToISO,
  getTzAtUTCZero,
  moment,
}

