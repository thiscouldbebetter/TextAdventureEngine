
class TimerManager
{
	ticksPerSecond: number;
	_tick: any;

	systemTimer: any;

	constructor(ticksPerSecond: number, tick: any)
	{
		this.ticksPerSecond = ticksPerSecond || 24;
		this._tick = tick;
	}

	static default(): TimerManager
	{
		return new TimerManager(null, null);
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

	tickHandlerSet(tickHandler: any): void
	{
		this._tick = tickHandler;
	}
}
