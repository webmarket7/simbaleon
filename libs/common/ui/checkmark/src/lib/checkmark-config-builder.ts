import { SlCheckmarkConfig } from './models/config.interface';
import { SlCheckmarkOptions } from './checkmark-options';
import { Memoize } from '@simbaleon/common/util/optimizations';


const DEFAULT_OPTIONS = {
    playOnInit: true,
    containerSize: 8,
    strokeWidth: 2,
    stroke: 'green',
    timing: '0.225s linear'
};

export class SlCheckmarkConfigBuilder {
    private _config: SlCheckmarkConfig;

    constructor(options?: Partial<SlCheckmarkOptions>) {
        const appliedDefaults = SlCheckmarkConfigBuilder._applyDefaults(options);
        const { containerSize, strokeWidth } = appliedDefaults;

        this._config = {
            ...appliedDefaults,
            _points: SlCheckmarkConfigBuilder._calculatePoints(containerSize, strokeWidth),
            _dashArray: SlCheckmarkConfigBuilder._calculateDashArray(containerSize)
        };
    }

    private static _applyDefaults(options?: Partial<SlCheckmarkOptions>): SlCheckmarkOptions {
        return options ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;
    }

    private static _precise(val: number): number {
        return Number.parseFloat(val.toPrecision(4));
    }

    /*
     * Calculates svg polyline points to form a checkmark of right size centered inside the designated container.
     * @param {number} containerRize - The container size.
     * @param {number} strokeWidth - The circle stroke width.
     */
    @Memoize()
    private static _calculatePoints(containerSize: number, strokeWidth: number): string {
        const bottomX = SlCheckmarkConfigBuilder._precise(containerSize * 0.4);
        const leftY = SlCheckmarkConfigBuilder._precise(containerSize * 0.6);

        return `${containerSize} 0, ${bottomX} ${containerSize - (strokeWidth / 2)}, ${strokeWidth / 2} ${leftY}`;
    }

    @Memoize()
    private static _calculateDashArray(containerSize: number): number {
        return containerSize * 2;
    }

    build(): SlCheckmarkConfig {
        return this._config;
    }

    setPlayOnInit(playOnInit: boolean): this {
        this._config.playOnInit = playOnInit;

        return this;
    }

    setContainerSize(containerSize: number): this {
        this._config.containerSize = containerSize;
        this._config._points = SlCheckmarkConfigBuilder._calculatePoints(containerSize, this._config.strokeWidth);
        this._config._dashArray = SlCheckmarkConfigBuilder._calculateDashArray(containerSize);

        return this;
    }

    setStroke(stroke: string): this {
        this._config.stroke = stroke;

        return this;
    }

    setStrokeWidth(strokeWidth: number): this {
        this._config.strokeWidth = strokeWidth;
        this._config._points = SlCheckmarkConfigBuilder._calculatePoints(this._config.containerSize, strokeWidth);

        return this;
    }

    setTiming(timing: string): this {
        this._config.timing = timing;

        return this;
    }
}
