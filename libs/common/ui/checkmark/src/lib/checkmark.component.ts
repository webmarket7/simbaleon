import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef,
    EventEmitter, HostBinding,
    Inject,
    Input,
    OnChanges, OnDestroy,
    Optional,
    Output,
    SimpleChanges, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { SL_CHECKMARK_DEFAULT_OPTIONS, SlCheckmarkOptions } from './checkmark-options';
import { SlCheckmarkConfigBuilder } from './checkmark-config-builder';
import { SlCheckmarkConfig } from './models/config.interface';
import { SlCheckmarkAccessor } from './models/accessor.interface';
import { AnimationFactory, AnimationPlayer } from '@angular/animations';
import { CheckmarkAnimationService } from './checkmark-animation.service';


@Component({
    selector: 'sl-checkmark',
    templateUrl: './checkmark.component.html',
    styleUrls: ['./checkmark.component.scss'],
    exportAs: 'SlCheckmark',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SlCheckmarkComponent implements SlCheckmarkAccessor, AfterViewInit, OnChanges, OnDestroy {

    @ViewChild('checkmark') private _checkmark: ElementRef<SVGPolylineElement>;

    configBuilder: SlCheckmarkConfigBuilder;
    config: SlCheckmarkConfig;

    @HostBinding('class') className = 'sl-checkmark';

    @HostBinding('style.height.px')
    @HostBinding('style.width.px')
    @Input() containerSize: number;

    @Input() options: Partial<SlCheckmarkOptions>;
    @Input() playOnInit: boolean;

    @Input() strokeWidth: number;
    @Input() stroke: string;
    @Input() timing: string;

    _points: string;
    _dashArray: number;
    _dashOffset: number;

    private _animationPlayer: AnimationPlayer;

    @Output() animationDone: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private _cdRef: ChangeDetectorRef,
        private _animations: CheckmarkAnimationService,
        @Optional() @Inject(SL_CHECKMARK_DEFAULT_OPTIONS) private _defaultOptions?: SlCheckmarkOptions
    ) {
        this.configBuilder = new SlCheckmarkConfigBuilder(_defaultOptions);
        this.config = this.configBuilder.build();
        this.applyConfig(this.config);
    }

    ngAfterViewInit(): void {
        if (this.playOnInit) {
            this.play();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            this.configBuilder = new SlCheckmarkConfigBuilder({
                ...this._defaultOptions,
                ...changes.options.currentValue
            });
        }

        if (changes.containerSize) {
            this.configBuilder.setContainerSize(changes.containerSize.currentValue);
        }

        if (changes.strokeWidth) {
            this.configBuilder.setStrokeWidth(changes.strokeWidth.currentValue);
        }

        if (changes.stroke) {
            this.configBuilder.setStroke(changes.stroke.currentValue);
        }

        if (changes.timing) {
            this.configBuilder.setTiming(changes.timing.currentValue);
        }

        if (changes.playOnInit) {
            this.configBuilder.setPlayOnInit(changes.playOnInit.currentValue);
        }

        this.config = this.configBuilder.build();
        this.applyConfig(this.config);
    }

    ngOnDestroy(): void {
        this._destroyAnimationPlayer();
        this.animationDone.complete();
    }

    applyConfig(config: SlCheckmarkConfig): void {
        this.playOnInit = config.playOnInit;
        this.containerSize = config.containerSize;
        this.strokeWidth = config.strokeWidth;
        this.stroke = config.stroke;
        this.timing = config.timing;
        this._points = config._points;
        this._dashArray = config._dashArray;
        this._setDashOffset(-(this.config._dashArray));
        this._cdRef.markForCheck();
    }

    play(): void {
        this._destroyAnimationPlayer();

        const animationFactory = this._animations.checkmark(this.config._dashArray, this.config.timing);
        this._animationPlayer = this._createAnimationPlayer(animationFactory);
        this._animationPlayer.onDone(() => {
            this._setDashOffset(0);
            this.animationDone.emit();
        });
        this._playAnimation();
    }

    reset(): void {
        this._setDashOffset(-(this.config._dashArray));
        this._destroyAnimationPlayer();
    }

    private _createAnimationPlayer(animationFactory: AnimationFactory): AnimationPlayer {
        return animationFactory.create(this._checkmark.nativeElement);
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
