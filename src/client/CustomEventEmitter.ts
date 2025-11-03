const _module = 'event-emitter';

export interface ISubscribers {
  [event: string]: Function[];
}

export class CustomEventEmitter {

  #subscribers: ISubscribers = {};

  constructor() {
    this.#subscribers = {};
  }

  get subscribers() {
    return this.#subscribers;
  }

  on(event: string, cb: Function): boolean {
    if (!Array.isArray(this.#subscribers[event]))
      this.#subscribers[event] = [];

    this.#subscribers[event].push(cb);
    return true;
  }

  async emit(event: string, data: any = {}): Promise<boolean> {

    if (typeof event !== 'string')
      return false;

    if (!Array.isArray(this.#subscribers[event]) || !this.#subscribers[event].length)
      return false;

    data = Array.isArray(data) ? data : data || {};

    for (const subscriber of this.#subscribers[event]) {
      try {
        await subscriber(data, event);
      } catch (e: any) {
        console.log(`${_module}: (event:${event}: emit: ${e.message}`);
      }
    }

    return true;
  }

}
