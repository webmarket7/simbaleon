import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
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
import { filter, take } from 'rxjs/operators';
import { combineLatest, Observable, Subject } from 'rxjs';

import {
    SlProgressSpinnerAccessor,
    SlProgressSpinnerAnimationDoneEvent,
    SlProgressSpinnerComponent,
    SlProgressSpinnerMode,
    SlProgressSpinnerModes
} from '@simbaleon/common/ui/progress-spinner';
import { SlCheckmarkAccessor, SlCheckmarkComponent } from '@simbaleon/common/ui/checkmark';

import { SlActionTrackerAccessor } from './models/accessor.interface';
import { SlActionTrackerConfigBuilder } from './action-tracker-config-builder';
import { SlActionTrackerConfig } from './models/config.interface';
import { SL_ACTION_TRACKER_DEFAULT_OPTIONS, SlActionTrackerOptions } from './action-tracker-options';
import { SlActionTrackerState, SlActionTrackerStates } from './action-tracker-states';


@Component({
    selector: 'sl-action-tracker',
    templateUrl: './action-tracker.component.html',
    styleUrls: ['./action-tracker.component.scss'],
    exportAs: 'SlActionTracker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SlActionTrackerComponent implements SlActionTrackerAccessor, OnChanges, OnDestroy {

    @ViewChild(SlProgressSpinnerComponent, { static: true }) private _spinner: SlProgressSpinnerAccessor;
    @ViewChild(SlCheckmarkComponent, { static: true }) private _checkmark: SlCheckmarkAccessor;

    @HostBinding('class') className = 'sl-action-tracker';

    configBuilder: SlActionTrackerConfigBuilder;
    config: SlActionTrackerConfig;

    @Input() options: Partial<SlActionTrackerOptions>;

    @HostBinding('style.width.px')
    @HostBinding('style.height.px')
    @Input() circleDiameter: number;
    @Input() circleStrokeWidth: number;
    @Input() stroke: string;
    @Input() strokeSuccess: string;
    @Input() checkmarkStrokeWidth: number;

    protected _checkmarkContainerSize: number;

    protected _spinnerStroke: string;
    protected _spinnerMode: SlProgressSpinnerMode = SlProgressSpinnerModes.Indeterminate;
    protected _spinnerValue = 0;

    private _spinnerAnimationDoneSubject: Subject<SlProgressSpinnerAnimationDoneEvent> = new Subject<SlProgressSpinnerAnimationDoneEvent>();
    private _spinnerAnimationDone$: Observable<SlProgressSpinnerAnimationDoneEvent> = this._spinnerAnimationDoneSubject.asObservable();

    private _checkmarkAnimationDoneSubject: Subject<void> = new Subject<void>();
    private _checkmarkAnimationDone$: Observable<void> = this._checkmarkAnimationDoneSubject.asObservable();

    private _state: SlActionTrackerState = SlActionTrackerStates.Idle;

    get state(): SlActionTrackerState {
        return this._state;
    }

    @Output() animationDone: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private _cdRef: ChangeDetectorRef,
        @Optional() @Inject(SL_ACTION_TRACKER_DEFAULT_OPTIONS) private _defaultOptions?: SlActionTrackerOptions
    ) {
        this.configBuilder = new SlActionTrackerConfigBuilder(_defaultOptions);
        this.config = this.configBuilder.build();
        this.applyConfig(this.config);
        this._spinnerStroke = this.stroke;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            this.configBuilder = new SlActionTrackerConfigBuilder({
                ...this._defaultOptions,
                ...changes.options.currentValue
            });
        }

        if (changes.circleDiameter) {
            this.configBuilder.setCircleDiameter(changes.circleDiameter.currentValue);
        }

        if (changes.circleStrokeWidth) {
            this.configBuilder.setCircleStrokeWidth(changes.circleStrokeWidth.currentValue);
        }

        if (changes.stroke) {
            this.configBuilder.setStroke(changes.stroke.currentValue);
        }

        if (changes.strokeSuccess) {
            this.configBuilder.setStrokeSuccess(changes.strokeSuccess.currentValue);
        }

        if (changes.checkmarkStrokeWidth) {
            this.configBuilder.setCheckmarkStrokeWidth(changes.checkmarkStrokeWidth.currentValue);
        }

        this.config = this.configBuilder.build();
        this.applyConfig(this.config);
    }

    ngOnDestroy(): void {
        this._spinnerAnimationDoneSubject.complete();
        this._checkmarkAnimationDoneSubject.complete();
        this.animationDone.complete();
    }

    applyConfig(config: SlActionTrackerConfig): void {
        this.circleDiameter = config.circleDiameter;
        this.circleStrokeWidth = config.circleStrokeWidth;
        this.strokeSuccess = config.strokeSuccess;
        this.stroke = config.stroke;
        this.checkmarkStrokeWidth = config.checkmarkStrokeWidth;
        this._checkmarkContainerSize = config._checkmarkContainerSize;
        this._cdRef.markForCheck();
    }

    start(): void {
        if (this._state === SlActionTrackerStates.Idle) {
            this._state = SlActionTrackerStates.Playing;
            this._spinner.play();
            this._spinnerAnimationDone$
                .pipe(
                    filter((event: SlProgressSpinnerAnimationDoneEvent) => event.mode === SlProgressSpinnerModes.Indeterminate),
                    take(1)
                )
                .subscribe(() => {
                    this._configureSpinner(SlProgressSpinnerModes.Determinate, this.strokeSuccess, 100);
                    this._checkmark.play();
                });
        } else {
            throw(new Error('Previous animation sequence hasn\'t finished yet'));
        }
    }

    finish(): void {
        if (this._state === SlActionTrackerStates.Playing) {
            this._state = SlActionTrackerStates.Finishing;
            this._listenAnimationDone();
            this._spinner.finish();
        } else if (this.state === SlActionTrackerStates.Idle) {
            throw(new Error('Animation sequence hasn\'t started yet'));
        } else {
            throw(new Error('Animation sequence is already scheduled to finish'));
        }
    }

    reset(): void {
        this._configureSpinner(SlProgressSpinnerModes.Indeterminate, this.stroke, 0);
        this._spinner.reset();
        this._checkmark.reset();
        this._state = SlActionTrackerStates.Idle;
    }

    protected _onSpinnerAnimationDone(event: SlProgressSpinnerAnimationDoneEvent): void {
        this._spinnerAnimationDoneSubject.next(event);
    }

    protected _onCheckmarkAnimationDone(): void {
        this._checkmarkAnimationDoneSubject.next();
    }

    private _configureSpinner(mode: SlProgressSpinnerMode, stroke: string, value: number): void {
        this._spinnerMode = mode;
        this._spinnerStroke = stroke;
        this._spinnerValue = value;
        this._cdRef.markForCheck();
    }

    private _listenAnimationDone(): void {
        const determinateSpinnerAnimationDone$ = this._spinnerAnimationDone$.pipe(
            filter((event: SlProgressSpinnerAnimationDoneEvent) => event.mode === SlProgressSpinnerModes.Determinate)
        );

        combineLatest([determinateSpinnerAnimationDone$, this._checkmarkAnimationDone$])
            .pipe(take(1))
            .subscribe(() => {
                this.animationDone.emit();
                this._state = SlActionTrackerStates.Idle;
            });
    }
}
