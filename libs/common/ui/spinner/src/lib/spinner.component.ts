import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject, Input,
    Optional, Renderer2,
    ViewEncapsulation
} from '@angular/core';
import { SL_SPINNER_DEFAULT_CONFIG } from './spinner-default-config.token';
import { SlSpinnerConfig } from './spinner-config';
import { SlSpinnerAccessor } from './spinner-accessor.interface';
import { AnimationBuilder } from '@angular/animations';
import { SlSpinnerSvgBuilder, SlSpinnerSvgOptions } from './spinner-svg-builder';


@Component({
    selector: 'sl-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    exportAs: 'SlSpinner',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SlSpinnerComponent implements SlSpinnerAccessor {

    @HostBinding('class') className = 'sl-spinner';

    @Input() config: SlSpinnerConfig;

    circleVisible: boolean;
    checkmarkVisible: boolean;

    @HostBinding('style.width.px')
    @HostBinding('style.height.px')
    circleDiameter: number;

    circleStroke: string;
    circleStrokeWidth: number;

    circleStrokeSuccess: string;
    circleStrokeMinFracture: number;
    circleStrokeMaxFracture: number;
    spinningTiming: number;

    withCheckmark: boolean;
    checkmarkStroke: string;
    checkmarkStrokeWidth: number;
    checkmarkDistance: number;
    checkmarkTiming: number;

    outerRadius: number;
    innerRadius: number;
    circleStrokeCircumference: number;
    circleDashArray: number;
    checkmarkPoints: string;

    svgOptions: SlSpinnerSvgOptions;

    constructor(
        private _cdRef: ChangeDetectorRef,
        private _animationBuilder: AnimationBuilder,
        private _renderer: Renderer2,
        @Optional() @Inject(SL_SPINNER_DEFAULT_CONFIG) private _defaultConfig?: SlSpinnerConfig
    ) {
    }

    reset(): void {
    }

    start(): void {
        this._checkConfig();
    }

    stop(): void {
    }

    private _checkConfig(): void {
        this.svgOptions = SlSpinnerSvgBuilder.build(applyConfigDefaults(this._defaultConfig, this.config))
    }
}

function applyConfigDefaults(defaultOptions?: SlSpinnerConfig, config?: Partial<SlSpinnerConfig>): SlSpinnerConfig {
    return {...(defaultOptions || new SlSpinnerConfig()), ...config};
}

