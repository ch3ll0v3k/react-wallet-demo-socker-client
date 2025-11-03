import "@app/init";
import { setTimeout as sleep } from "timers/promises";
import { res } from "@app/interfaces/app";
import { ESocketEvents } from "@app/interfaces/socket";
import { IOnBalancesUpdateRes } from "@app/interfaces/socket";

import Server from "@app/server/SocketServerRedis";

(async () => {
  const mServer = new Server();
  mServer.once('onReady', async (...args: any[]) => {
    mServer.log(`#server: (ID: ${mServer.ID}) is ready...`);

    if (mServer.ID == 1) {

      while (true) {
        await sleep(3000);

        const eventData: IOnBalancesUpdateRes = res(true, 'success', {
          defiAddressId: 1,
          symbol: 'ETH',
          balanceUsd: 3.141592,
          balanceFloat: 3.141592,
          balanceNative: '3141592'
        });

        await mServer.send(1, ESocketEvents.onBalancesUpdateRes, eventData);

      }

    }

  });
})();


