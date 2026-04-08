import {
  initSessionTimeout,
  startSessionTimeout,
  extendSessionTimeout,
  subscribeSessionTimeout,
  clearSessionTimeoutState,
} from "../sessionTimeout";

import { describe, it, expect, vi, beforeEach } from "vitest";

describe("SessionTimeout", () => {

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    clearSessionTimeoutState();
  });

  it("debe disparar warn antes de expirar", () => {
    const warnFn = vi.fn();

    initSessionTimeout({
      config: {
        idleMs: 5000,
        warnBeforeMs: 2000,
      },
    });

    subscribeSessionTimeout("warn", warnFn);

    startSessionTimeout();

    // avanzar tiempo hasta zona warning
    vi.advanceTimersByTime(3000);

    expect(warnFn).toHaveBeenCalledTimes(1);
  });

  it("debe disparar expired al finalizar", () => {
    const expiredFn = vi.fn();

    initSessionTimeout({
      config: {
        idleMs: 5000,
        warnBeforeMs: 2000,
      },
    });

    subscribeSessionTimeout("expired", expiredFn);

    startSessionTimeout();

    vi.advanceTimersByTime(5000);

    expect(expiredFn).toHaveBeenCalledTimes(1);
  });

  it("no debe disparar expired múltiples veces", () => {
    const expiredFn = vi.fn();

    initSessionTimeout({
      config: {
        idleMs: 3000,
        warnBeforeMs: 1000,
      },
    });

    subscribeSessionTimeout("expired", expiredFn);

    startSessionTimeout();

    vi.advanceTimersByTime(6000);

    expect(expiredFn).toHaveBeenCalledTimes(1);
  });

  it("debe extender sesión correctamente", () => {
    const warnFn = vi.fn();

    initSessionTimeout({
      config: {
        idleMs: 5000,
        warnBeforeMs: 2000,
      },
    });

    subscribeSessionTimeout("warn", warnFn);

    startSessionTimeout();

    vi.advanceTimersByTime(3000);

    extendSessionTimeout();

    vi.advanceTimersByTime(1000);

    expect(warnFn).toHaveBeenCalledTimes(1); // no doble warning inmediato
  });

});