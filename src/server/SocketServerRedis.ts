import Server from 'node:http';
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import Io, { Socket } from 'socket.io';
import EventEmitter from "events";

import crypto from '@app/lib/crypto';
import { res, uint64, uint8 } from '@app/interfaces/app';
import { IObject } from '@app/lib/tval';
import { B, P, R, W, Y } from '@app/interfaces/prototypes/console';
import { connectionParams } from '@app/common.interfacs';
import { ESocketEvents, IOnAuthenticationRes } from '@app/interfaces/socket';
import {
  ERedisEvent, IClientSession, IPubSubClients, IRedisPackedSocketEvent,
  IServerClient, IServerClients,
} from './interfaces';

const params = connectionParams.socketServerUrl;

export default class SocketServerRedis extends EventEmitter {

  #ID: uint64 = (+process.env.ID);

  #name: string = 'Socket-Server-Redis';
  #io: any = null;
  #server: Server.Server = null;
  #protohost: string = `http://${params.host}:${params.port}`;
  #debug: boolean = false;

  #clients: IServerClients = {};
  #clientIds: { [key: string]: uint64 } = {};

  #redis: IPubSubClients = {
    pub: null,
    sub: null,
  };

  constructor() {
    super();
    this.#init();
  }

  get name(): string { return this.#name; }
  get ID(): uint64 { return this.#ID; }

  async #init() {

    await this.#initHttpServer();
    await this.#initRedisPubSub();
    await this.#socketServer();
    await this.#initRedisAdapter();
    await this.#serverSubscrubeToRedis();
    await this.#serverAttachScoketEvents();

    await this.#listen();

  }

  async #initRedisPubSub() {
    this.#redis.pub = createClient({ url: connectionParams.redisUrl });
    this.#redis.sub = this.#redis.pub.duplicate();

    await Promise.all([
      this.#redis.pub.connect(),
      this.#redis.sub.connect()
    ]);
  }

  async #initHttpServer() {
    this.#server = Server.createServer();
  }

  async #socketServer() {
    this.#io = new Io.Server(this.#server, {
      pingTimeout: 20_000,
      connectTimeout: 10_000,
      upgradeTimeout: 10_000,
      destroyUpgradeTimeout: 5_000,
      transports: ['polling', 'websocket', 'webtransport'],
      maxHttpBufferSize: 1_000_000_000,
      // path: '/system/ipc',
      cors: {
        origin: '*',
        // credentials: true,
        methods: ['GET', 'HEAD', 'POST']
      }
    });

  }

  async #initRedisAdapter() {
    this.#io.adapter(createAdapter(this.#redis.pub, this.#redis.sub));
  }

  async #publish(event: string, data: IObject): Promise<boolean> {
    try {
      const json_t = JSON.stringify(data);
      this.#redis.pub.publish(event, json_t);
      return true;
    } catch (e: any) {
      this.error(`#publish: ${e.message}`);
      return false;
    }
  }


  #subscribe<T>(event: string, cb: (res: T) => void) {
    try {

      this.#redis.sub.subscribe(event, (rawString: string) => {
        try {
          cb(JSON.parse(rawString) as T);
        } catch (e: any) {
          this.error(`#subscribe<T>:in:event:(event:${event}): ${e.message}`);
        }
      });

    } catch (e: any) {
      this.error(`#subscribe<T>(event:${event}): ${e.message}`);
    }
  }

  async send<T>(userId: uint64, event: ESocketEvents, data: T) {

    try {

      const socketId = this.#clientIds[userId];

      if (socketId) {
        const mClient: IServerClient = this.#clients[userId];
        mClient.socket.emit(event, data);
        if (this.#debug)
          this.info(`send: found own user: emitting...`)
        return;
      }

      if (this.#debug)
        this.info(`send: own user not found: rerouting via redis...`)

      const packedEvent: IRedisPackedSocketEvent = {
        meta: { userId },
        event,
        data,
      }

      this.#publish(ERedisEvent.onSend, packedEvent);
      return true;

    } catch (e: any) {
      this.error(`send: ${e.message}`);
      return false;
    }

  }

  async #serverSubscrubeToRedis() {
    this.#subscribe<IRedisPackedSocketEvent>(ERedisEvent.onClientJoined, (packedEvent: IRedisPackedSocketEvent) => {
      if (this.#debug)
        console.json({ [ERedisEvent.onClientJoined]: packedEvent });
      // pass
    });

    this.#subscribe<IRedisPackedSocketEvent>(ERedisEvent.onClientLeft, (packedEvent: IRedisPackedSocketEvent) => {
      if (this.#debug)
        console.json({ [ERedisEvent.onClientLeft]: packedEvent });
      // pass
    });

    this.#subscribe<IRedisPackedSocketEvent>(ERedisEvent.onSend, (packedEvent: IRedisPackedSocketEvent) => {

      const userId = (+packedEvent?.meta?.userId);
      if (!userId) {
        if (this.#debug)
          this.info(`#userId: invalid (userId: ${userId})`);
        return;
      }

      const mClient = this.#clients[userId];
      if (!mClient) {
        if (this.#debug)
          this.info(`#userId: ${userId} not found, pass to the next...`)
        return;
      }

      const { event, data } = packedEvent;

      if (this.#debug)
        this.info(`#userId: ${userId} user found, emitting (event: ${event}) `)
      mClient.socket.emit(event, data);

    });

  }

  async #serverAttachScoketEvents() {
    this.#io.on(`connection`, (socket: Socket) => {
      try {

        if (this.#debug)
          this.info(` Client connected:`, socket.id);

        const token = socket?.handshake?.headers?.token as string;
        if (!token) {
          if (this.#debug) {
            this.info({ headers: socket?.handshake?.headers });
            this.info(` token is undefined`);
          }
          socket.emit(ESocketEvents.onAuthenticationRes, res(false, 'token is undefined', {}));
          return;
        }

        const decodeRes = crypto.jwt.decode<IClientSession>(token);
        if (!decodeRes.success || !decodeRes.data) {
          if (this.#debug) {
            this.info(` invalid token`);
            this.json({ decodeRes });
          }

          socket.emit(ESocketEvents.onAuthenticationRes, res(false, 'invalid token', {}));
          return;
        }

        const session: IClientSession = decodeRes.data;

        this.#clientIds[socket.id] = session.id;
        this.#clients[session.id] = { socket, session };

        socket.on('disconnect', (reason: string) => {
          try {
            const userId = this.#clientIds[socket.id];
            const session = this.#clients[userId]?.session;
            if (this.#debug) {
              this.warn(` Received disconnect:`, { reason });
              this.json({ disconnect: { session } });
            }

            this.#publish(ERedisEvent.onClientLeft, { userId: session.id });
            delete this.#clientIds[socket.id];
            delete this.#clients[userId];

          } catch (e: any) {
            this.error(`#on:disconnect: ${e?.message}`);
          }
        });

        const result: IOnAuthenticationRes = res(true, 'success', {
          session: decodeRes.data.token,
        });

        socket.emit(ESocketEvents.onAuthenticationRes, result);
        this.#publish(ERedisEvent.onClientJoined, { userId: session.id });

        if (this.#debug) {
          this.info(` Authenticated: success`);
          this.json({ authenticated: { session } });
        }

        // if (this.ID === 0) {
        //   setInterval(() => {
        //     socket.emit(`customMethod`, { now: Date.now() });
        //   }, 2000);
        // }
      } catch (e: any) {
        this.error(`#on:connection: ${e?.message}`);
      }

    });

  }

  async #listen() {

    this.info(`${R('#')}${B(this.name)}:starting...`);

    this.#server.on('listening', () => {
      this.info(`listening...`);
      this.emit('onReady', { inited: true });
    });

    this.#server.listen(process.env.PORT);

  }

  // [common]

  #getDT(): string {
    const iso = new Date().toISOString();
    const date = iso.split('.')[0].replace('T', ' ').trim();
    return date;
  }

  #logPrefix(): string {
    return `[${this.#getDT()}]`;
  }

  log(...args: any[]): void {
    console.log(`${this.#logPrefix()}: ${R('#')}${B(this.name)}:[${W('log')}]`, ...args);
  }

  info(...args: any[]): void {
    console.info(`${this.#logPrefix()}: ${R('#')}${B(this.name)}:[${B('info')}]`, ...args);
  }

  warn(...args: any[]): void {
    console.warn(`${this.#logPrefix()}: ${R('#')}${B(this.name)}:[${Y('warn')}]`, ...args);
  }

  debug(...args: any[]): void {
    console.debug(`${this.#logPrefix()}: ${R('#')}${B(this.name)}:[${P('debug')}]`, ...args);
  }

  error(...args: any[]): void {
    console.error(`${this.#logPrefix()}: ${R('#')}${B(this.name)}:[${R('error')}]`, ...args);
  }

  json(data: any = '', format: uint8 = 2): void {
    try {
      const lines = console.toJson(data, null, format).split('\n');
      lines.forEach((line: string) => {
        console.log(`${this.#logPrefix()}: ${R('#')}${B(this.name)}:[${W('json')}]`, line);
      });
    } catch (e: any) {
      console.json({ error: e.message });
    }
  }


}


