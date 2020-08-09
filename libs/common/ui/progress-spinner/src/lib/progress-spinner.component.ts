import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { AnimationFactory, AnimationPlayer } from '@angular/animations';
import clamp from 'lodash-es/clamp';

import { SlProgressSpinnerMode, SlProgressSpinnerModes } from './progress-spinner-mode';
import { ProgressSpinnerAnimationsService } from './progress-spinner-animations.service';
import { SlProgressSpinnerAccessor } from './models/accessor.interface';
import { SlProgressSpinnerConfig } from './models/config.interface';
import { SlProgressSpinnerAnimationDoneEvent } from './models/animation-done-event.interface';
import { SlProgressSpinnerConfigBuilder } from './progress-spinner-config-builder';
import { SL_PROGRESS_SPINNER_DEFAULT_OPTIONS, SlProgressSpinnerOptions } from './progress-spinner-options';


@Component({
    selector: 'sl-progress-spinner',
    exportAs: 'SlProgressSpinner',
    templateUrl: './progress-spinner.component.html',
    styleUrls: ['./progress-spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SlProgressSpinnerComponent implements SlProgressSpinnerAccessor, OnChanges, AfterViewInit, OnDestroy {

    @ViewChild('circle') private _circle: ElementRef<SVGCircleElement>;

    @HostBinding('attr.role') role = 'progressbar';
    @HostBinding('class') className = 'sl-progress-spinner';

    configBuilder: SlProgressSpinnerConfigBuilder;
    config: SlProgressSpinnerConfig;

    @Input() options: Partial<SlProgressSpinnerOptions>;

    @Input()
    @HostBinding('style.width.px')
    @HostBinding('style.height.px')
    diameter: number;

    @Input()
    @HostBinding('attr.mode')
    mode: SlProgressSpinnerMode;

    @Input() strokeWidth: number;
    @Input() stroke: string;
    @Input() indeterminateTiming: string;
    @Input() determinateTiming: string;

    @Input()
    set value(value: number) {
        this._value = clamp(value, 0, 100);
    };

    get value(): number {
        return this._value;
    }

    private _value: number;

    @Input() playOnInit: boolean;

    _radius: number;
    _strokeCircumference: number;
    _dashOffset: number;

    private _animationPlayer: AnimationPlayer;
    private _shouldFinish = false;

    @Output() animationDone: EventEmitter<SlProgressSpinnerAnimationDoneEvent> = new EventEmitter<SlProgressSpinnerAnimationDoneEvent>();

    constructor(
        private _cdRef: ChangeDetectorRef,
        private _animations: ProgressSpinnerAnimationsService,
        @Optional() @Inject(SL_PROGRESS_SPINNER_DEFAULT_OPTIONS) private _defaultOptions?: SlProgressSpinnerOptions
    ) {
        this.configBuilder = new SlProgressSpinnerConfigBuilder(_defaultOptions);
        this.config = this.configBuilder.build();
        this.applyConfig(this.config);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            this.configBuilder = new SlProgressSpinnerConfigBuilder({
                ...this._defaultOptions,
                ...changes.options.currentValue
            });
        }

        if (changes.mode) {
            this.configBuilder.setMode(changes.mode.currentValue);
        }

        if (changes.diameter) {
            this.configBuilder.setDiameter(changes.diameter.currentValue);
        }

        if (changes.strokeWidth) {
            this.configBuilder.setStrokeWidth(changes.strokeWidth.currentValue);
        }

        if (changes.stroke) {
            this.configBuilder.setStroke(changes.stroke.currentValue);
        }

        if (changes.indeterminateTiming) {
            this.configBuilder.setIndeterminateTiming(changes.indeterminateTiming.currentValue);
        }

        if (changes.determinateTiming) {
            this.configBuilder.setDeterminateTiming(changes.determinateTiming.currentValue);
        }

        if (changes.value) {
            this.configBuilder.setValue(changes.value.currentValue);
        }

        if (changes.playOnInit) {
            this.configBuilder.setPlayOnInit(changes.playOnInit.currentValue);
        }

        this.config = this.configBuilder.build();
        this.applyConfig(this.config);

        if (this.mode === SlProgressSpinnerModes.Determinate
            && changes.value
            && !changes.value.isFirstChange()
        ) {
            this.play();
        }
    }

    ngAfterViewInit(): void {
        if (this.playOnInit) {
            this.play();
        }
    }

    ngOnDestroy(): void {
        this.animationDone.complete();
        this._destroyAnimationPlayer();
    }

    applyConfig(config: SlProgressSpinnerConfig): void {
        this.mode = config.mode;
        this.playOnInit = config.playOnInit;
        this.value = config.value;

        this.diameter = config.diameter;
        this.strokeWidth = config.strokeWidth;
        this.stroke = config.stroke;
        this._radius = config._radius;
        this._strokeCircumference = config._strokeCircumference;
        this._dashOffset = config._strokeCircumference;

        this._cdRef.markForCheck();
    }

    finish(): void {
        this._shouldFinish = true;
    }

    play(): void {
        this._destroyAnimationPlayer();

        if (this.mode === SlProgressSpinnerModes.Indeterminate) {
            this._playIndeterminate();
        } else {
            this._playDeterminate();
        }
    }

    reset(): void {
        this._shouldFinish = false;
        this._setDashOffset(this.config._strokeCircumference);
        this._destroyAnimationPlayer();
    }

    private _playIndeterminate(): void {
        const { min, max, full } = this.config._dashArray;
        const timing = this.config.indeterminateTiming;
        const animationFactory = this._animations.indeterminate(min, max, full, timing);

        this._spin(animationFactory);
    }

    private _spin(animationFactory: AnimationFactory): void {
        this._animationPlayer = this._createAnimationPlayer(animationFactory);
        this._animationPlayer.onDone(() => {
            this._destroyAnimationPlayer();

            if (this._shouldFinish) {
                this.animationDone.emit({ mode: this.mode });
            } else {
                this._spin(animationFactory);
            }
        });
        this._playAnimation();
    }

    private _playDeterminate(): void {
        const { _dashOffset: dashOffset, determinateTiming: timing } = this.config;
        const animationFactory = this._animations.determinate(dashOffset, timing);

        this._animationPlayer = this._createAnimationPlayer(animationFactory);
        this._animationPlayer.onDone(() => {
            this._setDashOffset(dashOffset);
            this._destroyAnimationPlayer();
            this.animationDone.emit({ mode: this.mode, value: this.value });
        });
        this._playAnimation();
    }

    private _createAnimationPlayer(animationFactory: AnimationFactory): AnimationPlayer {
        return animationFactory.create(this._circle.nativeElement);
    }

    private _destroyAnimationPlayer(): void {
        if (this._animationPlayer) {
            this._animationPlayer.destroy();
            this._animationPlayer = null;
        }
    }

    private _playAnimation(): void {
        this._animationPlayer.play();
    }

    private _setDashOffset(dashOffset: number): void {
        this._dashOffset = dashOffset;
        this._cdRef.markForCheck();
    }
}
