import { uint64 } from "@app/interfaces/app";
import { IObject } from "@app/lib/tval";
import { RedisClientType } from "redis";
import { Socket } from "socket.io";

export enum ERedisEvent {
  onSend = 'onSend',
  onClientJoined = 'onClientJoined',
  onClientLeft = 'onClientLeft',
}

export interface IRedisPackedSocketEvent {
  meta: {
    userId: uint64;
  },
  event: string;
  data: IObject;
}

export interface IPubSubClients {
  pub: RedisClientType;
  sub: RedisClientType;
}

export interface IClientSession {
  id: uint64;
  puid: string; // "1f0b5982-c075-65a0-2dc4-98e6d52c34d0",
  token: string; // "548ce21b630ab05732b1ac59b564a0f2828ec1f0421db423",
  lang: string; // "en",
  type: string; // "access",
  iat: uint64; // 1761832562,
  exp: uint64; // 1764424562
}

export interface IServerClient {
  socket: Socket;
  session: IClientSession
}
export interface IServerClients {
  [key: string | uint64]: IServerClient;
}
