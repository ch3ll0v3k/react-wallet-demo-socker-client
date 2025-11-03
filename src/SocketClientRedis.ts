import { io, Socket } from 'socket.io-client';
// "socket.io-client": "^4.8.1"
// "@types/socket.io-client": "^3.0.0",

import { IObject } from './lib/tval';
import { ESocketEvents, IOnAssetPriceUpdateRes, IOnNewTransactionsUpdatedRes } from './interfaces/socket';
import {
  IOnAuthenticationRes,
  IOnBalancesUpdateRes,
  IOnTransactionsUpdatedRes,
} from './interfaces/socket';
import { CustomEventEmitter } from './CustomEventEmitter';

export default class SocketClientRedis extends CustomEventEmitter {

  #name: string = 'Socket-Client-Redis';
  #client: Socket = null;
  #isConnected: boolean = false;
  #isAuthenticated: boolean = false;
  #protohost: string = `http://127.0.0.1:80`;
  #token: string;

  constructor(token: string) {
    super();
    this.#token = token;
    console.json({ 'this.#token': this.#token });
    this.#init();
  }

  get name(): string { return this.#name; }
  get isConnected(): boolean { return this.#isConnected; }
  get isAuthenticated(): boolean { return this.#isAuthenticated; }

  async socketEmit(event: string, data: IObject = {}): Promise<void> {
    try {
      this.#client.emit(event, data);
    } catch (e: any) {
      console.error(`socketEmit: ${e.message}`);
    }
  }

  async #init() {

    this.#client = io(this.#protohost, {
      autoConnect: false,
      extraHeaders: {
        token: this.#token || 'n/a',
      }
    });

    this.#client.on('connect', async () => {

      this.#isConnected = true;
      console.log(`#${this.name}: on:connect: (success)`);

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
          console.log(`#${this.name}: on:disconnect: (reason:${reason})`);
        } catch (e: any) {
          console.error(`#${this.name}: on:disconnect: (${e.message})`);
        }
      });

      this.#client.on('error', (e: any) => {
        try {
          console.log(`#${this.name}: on:error: (${e?.message})`);
        } catch (e: any) {
          console.error(`#${this.name}: on:error: (${e.message})`);
        }
      });

    });

  }

  public async connect(): Promise<boolean> {
    this.#client.connect();
    return true;
  }

}


