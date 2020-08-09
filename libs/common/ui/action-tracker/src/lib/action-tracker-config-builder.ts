import { SlActionTrackerOptions } from './action-tracker-options';
import { SlActionTrackerConfig } from './models/config.interface';
import { Memoize } from '@simbaleon/common/util/optimizations';


const DEFAULT_OPTIONS = {
    circleDiameter: 18,
    circleStrokeWidth: 2,
    stroke: '#7DB0D5',
    strokeSuccess: 'green',
    checkmarkStrokeWidth: 2
};

export class SlActionTrackerConfigBuilder {
    private _config: SlActionTrackerConfig;

    constructor(options?: Partial<SlActionTrackerOptions>) {
        const appliedDefaults = SlActionTrackerConfigBuilder._applyDefaults(options);
        const { circleDiameter, circleStrokeWidth } = appliedDefaults;

        this._config = {
            ...appliedDefaults,
            _checkmarkContainerSize: SlActionTrackerConfigBuilder._calculateCheckmarkContainerSize(circleDiameter, circleStrokeWidth)
        };
    }

    private static _applyDefaults(options?: Partial<SlActionTrackerOptions>): SlActionTrackerOptions {
        return options ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;
    }

    private static _precise(val: number): number {
        return Number.parseFloat(val.toPrecision(4));
    }

    @Memoize()
    private static _calculateCheckmarkContainerSize(circleDiameter: number, circleStrokeWidth: number): number {
        const innerDiameter = circleDiameter - circleStrokeWidth * 2;
        const inscribedSquareSide = innerDiameter / Math.sqrt(2);

        return SlActionTrackerConfigBuilder._precise(inscribedSquareSide * 0.85);
    }

    build(): SlActionTrackerConfig {
        return this._config;
    }

    setCircleDiameter(circleDiameter: number): this {
        this._config.circleDiameter = circleDiameter;
        this._updateCheckmarkContainerSize();

        return this;
    }

    setCircleStrokeWidth(circleStrokeWidth: number): this {
        this._config.circleStrokeWidth = circleStrokeWidth;
        this._updateCheckmarkContainerSize();

        return this;
    }

    setStroke(stroke: string): this {
        this._config.stroke = stroke;

        return this;
    }

    setStrokeSuccess(strokeSuccess: string): this {
        this._config.strokeSuccess = strokeSuccess;

        return this;
    }

    setCheckmarkStrokeWidth(checkmarkStrokeWidth: number): this {
        this._config.checkmarkStrokeWidth = checkmarkStrokeWidth;

        return this;
    }

    private _updateCheckmarkContainerSize(): void {
        const { circleDiameter, circleStrokeWidth } = this._config;

        this._config._checkmarkContainerSize = SlActionTrackerConfigBuilder._calculateCheckmarkContainerSize(circleDiameter, circleStrokeWidth);
    }
}
