
class TimerManager
{
	ticksPerSecond: number;
	_tick: any;

	systemTimer: any;

	constructor(ticksPerSecond: number, tick: any)
	{
		this.ticksPerSecond = ticksPerSecond || 1000;
		this._tick = tick;
	}

	millisecondsPerTick(): number
	{
		return Math.round(1000 / this.ticksPerSecond);
	}

	stop(): void
	{
		clearInterval(this.systemTimer);
		this.systemTimer = null;
	}

	start(): void
	{
		this.systemTimer =
			setInterval(this.tick.bind(this), this.millisecondsPerTick() );
	}

	tick(): void
	{
		this._tick();
	}
}
