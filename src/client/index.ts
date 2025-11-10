import "@app/init";

import SocketClient from "@app/client/SocketClient";
import {
  ESocketEvents, IOnAssetPriceUpdateRes, IOnAuthenticationRes,
  IOnBalancesUpdateRes,
  IOnNewTransactionRes,
  IOnTransactionUpdatedRes,
} from "./interfaces.socket";

(async () => {

  const correctToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVpZCI6IjFmMGI1OTgyLWMwNzUtNjVhMC0yZGM0LTk4ZTZkNTJjMzRkMCIsInRva2VuIjoiNTQ4Y2UyMWI2MzBhYjA1NzMyYjFhYzU5YjU2NGEwZjI4MjhlYzFmMDQyMWRiNDIzIiwibGFuZyI6ImVuIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2MTgzMjU2MiwiZXhwIjoxNzY0NDI0NTYyfQ.GhUu0Ux4h4vzQ0h3-5qsIM37ut1fFh4VkLJ5EcVQei8';

  const mSocket = new SocketClient(correctToken);

  mSocket.on(ESocketEvents.onAuthentication, (res: IOnAuthenticationRes) => {
    if (!res.success) {
      return mSocket.error(`#auth: error: ${res.message}`);
    }

    mSocket.log(`#auth: success: (session: ${res.data.session})`);

  });

  mSocket.on(ESocketEvents.onBalancesUpdate, (res: IOnBalancesUpdateRes) => {
    mSocket.json({ [ESocketEvents.onBalancesUpdate]: res });
  });

  mSocket.on(ESocketEvents.onAssetPriceUpdate, (res: IOnAssetPriceUpdateRes) => {
    mSocket.json({ [ESocketEvents.onAssetPriceUpdate]: res });
  });

  mSocket.on(ESocketEvents.onTransactionUpdated, (res: IOnTransactionUpdatedRes) => {
    mSocket.json({ [ESocketEvents.onTransactionUpdated]: res });
  });

  mSocket.on(ESocketEvents.onNewTransaction, (res: IOnNewTransactionRes) => {
    mSocket.json({ [ESocketEvents.onNewTransaction]: res });
  });

  mSocket.connect();

})();


