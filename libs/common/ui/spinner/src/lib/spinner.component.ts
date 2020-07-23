import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject,
    Optional, Renderer2,
    ViewEncapsulation
} from '@angular/core';
import { SL_SPINNER_DEFAULT_CONFIG } from './spinner-default-config.token';
import { SlSpinnerConfig } from './spinner-config';
import { SlSpinnerAccessor } from './spinner-accessor.interface';
import { AnimationBuilder } from '@angular/animations';


@Component({
    selector: 'sl-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SlSpinnerComponent implements SlSpinnerAccessor {

    @HostBinding('class') className = 'sl-spinner';

    circleVisible: boolean;
    checkmarkVisible: boolean;

    @HostBinding('style.width.px')
    @HostBinding('style.height.px')
    circleDiameter: number;

    circleStroke: string;
    circleStrokeWidth: number;

    outerRadius: number;
    innerRadius: number;

    withCheckmark: boolean;

    checkmarkPoints: string;
    checkmarkStroke: string;
    checkmarkStrokeWidth: number;

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
    }

    stop(): void {
    }

}
