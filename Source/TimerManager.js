"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class TimerManager {
            constructor(ticksPerSecond, tick) {
                this.ticksPerSecond = ticksPerSecond || 24;
                this._tick = tick;
            }
            static default() {
                return new TimerManager(null, null);
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
            tickHandlerSet(tickHandler) {
                this._tick = tickHandler;
            }
        }
        TextAdventureEngine.TimerManager = TimerManager;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
