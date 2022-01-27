class Scheduler {
  constructor() {
    throw new ERR_ILLEGAL_CONSTRUCTOR();
  }

  /**
   * @returns {Promise<void>}
   */
  yield() {
    if (!this[kScheduler])
      throw new ERR_INVALID_THIS('Scheduler');
    return setImmediate();
  }

  /**
   * @typedef {import('../internal/abort_controller').AbortSignal} AbortSignal
   * @param {number} delay
   * @param {{ signal?: AbortSignal }} [options]
   * @returns {Promise<void>}
   */
  wait(delay, options) {
    if (!this[kScheduler])
      throw new ERR_INVALID_THIS('Scheduler');
    return setTimeout(delay, undefined, { signal: options?.signal });
  }
}
