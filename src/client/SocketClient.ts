import { io, Socket } from 'socket.io-client';
// "socket.io-client": "^4.8.1"
// "@types/socket.io-client": "^3.0.0",

import { CustomEventEmitter } from './CustomEventEmitter';
import {
  ESocketEvents,
  IOnAssetPriceUpdateRes,
  IOnNewTransactionsUpdatedRes,
  IOnAuthenticationRes,
  IOnBalancesUpdateRes,
  IOnTransactionsUpdatedRes,
} from './interfaces.socket';


export default class SocketClientRedis extends CustomEventEmitter {

  #name: string = 'Socket';
  #client: Socket = null;
  #isConnected: boolean = false;
  #isAuthenticated: boolean = false;
  #protohost: string = `http://0.0.0.0:34501`;
  #token: string;

  constructor(token: string) {
    super();
    this.#token = token;
    this.#init();
  }

  get name(): string { return this.#name; }
  get isConnected(): boolean { return this.#isConnected; }
  get isAuthenticated(): boolean { return this.#isAuthenticated; }

  async #init() {

    this.#client = io(this.#protohost, {
      autoConnect: false,
      extraHeaders: {
        token: this.#token || 'n/a',
      }
    });

    this.#client.on('connect', async () => {

      this.#isConnected = true;
      this.log(`#${this.name}: on:connect: (success)`);

      this.#client.on(ESocketEvents.onAuthenticationRes, (res: IOnAuthenticationRes) => {
        this.#isAuthenticated = res.success;
        this.emit(ESocketEvents.onAuthenticationRes, res);
      });

      this.#client.on(ESocketEvents.onBalancesUpdateRes, (res: IOnBalancesUpdateRes) => {
        this.emit(ESocketEvents.onBalancesUpdateRes, res);
      });

      this.#client.on(ESocketEvents.onAssetPriceUpdateRes, (res: IOnAssetPriceUpdateRes) => {
        this.emit(ESocketEvents.onAssetPriceUpdateRes, res);
      });

      this.#client.on(ESocketEvents.onTransactionsUpdatedRes, (res: IOnTransactionsUpdatedRes) => {
        this.emit(ESocketEvents.onTransactionsUpdatedRes, res);
      });

      this.#client.on(ESocketEvents.onNewTransactionsUpdatedRes, (res: IOnNewTransactionsUpdatedRes) => {
        this.emit(ESocketEvents.onNewTransactionsUpdatedRes, res);
      });

      this.#client.on('disconnect', (reason: Socket.DisconnectReason/*, description?: any*/) => {
        try {
          this.#isConnected = false;
          this.#isAuthenticated = false;
          this.log(`on:disconnect: (reason:${reason})`);
        } catch (e: any) {
          this.error(`on:disconnect: (catch): (${e.message})`);
        }
      });

      this.#client.on('error', (e: any) => {
        try {
          this.log(`on:error: (${e?.message})`);
        } catch (e: any) {
          this.error(`on:error: (catch): (${e.message})`);
        }
      });

    });

  }

  public async connect(): Promise<boolean> {
    this.#client.connect();
    return true;
  }



  #getDT(): string {
    const iso = new Date().toISOString();
    const date = iso.split('.')[0].replace('T', ' ').trim();
    return date;
  }

  #logPrefix(): string {
    return `[${this.#getDT()}]`;
  }

  log(...args: any[]): void {
    console.log(`${this.#logPrefix()}: ${this.name}:[${'log'}]`, ...args);
  }

  info(...args: any[]): void {
    console.info(`${this.#logPrefix()}: ${this.name}:[${'info'}]`, ...args);
  }

  warn(...args: any[]): void {
    console.warn(`${this.#logPrefix()}: ${this.name}:[${'warn'}]`, ...args);
  }

  debug(...args: any[]): void {
    console.debug(`${this.#logPrefix()}: ${this.name}:[${'debug'}]`, ...args);
  }

  error(...args: any[]): void {
    console.error(`${this.#logPrefix()}: ${this.name}:[${'error'}]`, ...args);
  }

  json(data: any = '', format: number = 2): void {
    try {
      const lines = JSON.stringify(data, null, format).split('\n');
      lines.forEach((line: string) => {
        console.log(`${this.#logPrefix()}: ${this.name}:[${'json'}]`, line);
      });
    } catch (e: any) {
      console.log({ error: e.message });
    }
  }


}


