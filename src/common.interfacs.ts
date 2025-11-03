export interface IConnectionConfig {
  redisUrl: string;
  socketServerUrl: {
    port: number;
    host: string;
  }
}


export const connectionParams: IConnectionConfig = {
  redisUrl: `redis://localhost:10500`,
  socketServerUrl: {
    port: 20333,
    host: 'localhost'
  }
};
