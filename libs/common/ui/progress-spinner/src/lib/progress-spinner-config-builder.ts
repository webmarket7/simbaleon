import clamp from 'lodash-es/clamp';
import { Memoize } from '@simbaleon/common/util/optimizations';

import { SlProgressSpinnerMode, SlProgressSpinnerModes } from './progress-spinner-mode';
import { SlProgressSpinnerOptions } from './progress-spinner-options';
import { SlProgressSpinnerConfig } from './models/config.interface';
import { SlProgressSpinnerDasharray } from './models/dasharray.interface';


const DEFAULT_OPTIONS = {
    mode: SlProgressSpinnerModes.Indeterminate,
    diameter: 18,
    stroke: '#7DB0D5',
    strokeWidth: 2,
    min: 0,
    max: 0.5,
    indeterminateTiming: '1s linear',
    determinateTiming: '0.225s linear',
    value: 0,
    playOnInit: true
};


export class SlProgressSpinnerConfigBuilder {
    private _config: SlProgressSpinnerConfig;

    constructor(options?: Partial<SlProgressSpinnerOptions>) {
        const appliedDefaults = SlProgressSpinnerConfigBuilder._applyDefaults(options);
        const { diameter, strokeWidth, min, max, value } = appliedDefaults;
        const _strokeCircumference = SlProgressSpinnerConfigBuilder._calcStrokeCircumference(diameter, strokeWidth);
        const _dashArray = SlProgressSpinnerConfigBuilder._calcDashArray(_strokeCircumference, min, max);
        const _dashOffset = SlProgressSpinnerConfigBuilder._calcDashOffset(_strokeCircumference, value);

        this._config = {
            ...appliedDefaults,
            value: clamp(value, 0, 100),
            _radius: SlProgressSpinnerConfigBuilder._calcRadius(diameter, strokeWidth),
            _strokeCircumference,
            _dashArray,
            _dashOffset
        };
    }

    private static _applyDefaults(options?: Partial<SlProgressSpinnerOptions>): SlProgressSpinnerOptions {
        return options ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;
    }

    /*
    * To calc svg circle radius we should subtract stroke width before dividing diameter.
    * This is because in svg radius gets computed from center of stroke. This means, that to fit circle with
    * stroke width of 2px into 18px x 18px square container the circle radius should be 8px.
    */
    @Memoize()
    private static _calcRadius(diameter: number, strokeWidth: number): number {
        return (diameter - strokeWidth) / 2;
    }

    @Memoize()
    private static _calcStrokeCircumference(diameter: number, strokeWidth: number): number {
        return 2 * Math.PI * SlProgressSpinnerConfigBuilder._calcRadius(diameter, strokeWidth);
    }

    @Memoize()
    private static _calcDashArray(circumference: number, min: number, max: number): SlProgressSpinnerDasharray {
        return {
            min: circumference * min,
            max: circumference * max,
            full: circumference
        };
    }

    @Memoize()
    private static _calcDashOffset(circumference: number, value: number): number {
        return circumference * ((100 - value) / 100);
    }

    build(): SlProgressSpinnerConfig {
        return this._config;
    }

    setMode(mode: SlProgressSpinnerMode): this {
        this._config.mode = mode;

        return this;
    }

    setPlayOnInit(playOnInit: boolean): this {
        this._config.playOnInit = playOnInit;

        return this;
    }

    setDiameter(diameter: number): this {
        this._config.diameter = diameter;
        this._updateDiameterOrStrokeWidth();

        return this;
    }

    setStroke(stroke: string): this {
        this._config.stroke = stroke;

        return this;
    }

    setStrokeWidth(strokeWidth: number): this {
        this._config.strokeWidth = strokeWidth;
        this._updateDiameterOrStrokeWidth();

        return this;
    }

    setMin(strokeMinLength: number): this {
        this._config.min = strokeMinLength;
        this._updateMinOrMax();

        return this;
    }

    setMax(strokeMaxLength: number): this {
        this._config.max = strokeMaxLength;
        this._updateMinOrMax();

        return this;
    }

    setIndeterminateTiming(timing: string): this {
        this._config.indeterminateTiming = timing;

        return this;
    }

    setDeterminateTiming(timing: string): this {
        this._config.determinateTiming = timing;

        return this;
    }

    setValue(value: number): this {
        this._config.value = clamp(value, 0, 100);
        this._updateValue();

        return this;
    }

    private _updateDiameterOrStrokeWidth(): void {
        const { diameter, strokeWidth, min, max, value } = this._config;

        this._config._radius = SlProgressSpinnerConfigBuilder._calcRadius(diameter, strokeWidth);

        const _strokeCircumference = SlProgressSpinnerConfigBuilder._calcStrokeCircumference(diameter, strokeWidth);

        this._config._strokeCircumference = _strokeCircumference;
        this._config._dashArray = SlProgressSpinnerConfigBuilder._calcDashArray(_strokeCircumference, min, max);
        this._config._dashOffset = SlProgressSpinnerConfigBuilder._calcDashOffset(_strokeCircumference, value);
    }

    private _updateMinOrMax(): void {
        const { _strokeCircumference, min, max } = this._config;

        this._config._dashArray = SlProgressSpinnerConfigBuilder._calcDashArray(_strokeCircumference, min, max);
    }

    private _updateValue(): void {
        const { _strokeCircumference, value } = this._config;

        this._config._dashOffset = SlProgressSpinnerConfigBuilder._calcDashOffset(_strokeCircumference, value);
    }
}
