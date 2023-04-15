"use strict";
class TimerManager {
    constructor(ticksPerSecond, tick) {
        this.ticksPerSecond = ticksPerSecond || 1000;
        this._tick = tick;
    }
    millisecondsPerTick() {
        return Math.round(1000 / this.ticksPerSecond);
    }
    stop() {
        clearInterval(this.systemTimer);
        this.systemTimer = null;
    }
    start() {
        this.systemTimer =
            setInterval(this.tick.bind(this), this.millisecondsPerTick());
    }
    tick() {
        this._tick();
    }
}
