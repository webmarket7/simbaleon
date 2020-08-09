import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';

import { SlActionTrackerComponent } from './action-tracker.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SlProgressSpinnerAccessor, SlProgressSpinnerModes } from '@simbaleon/common/ui/progress-spinner';
import { By } from '@angular/platform-browser';
import { SlCheckmarkAccessor } from '@simbaleon/common/ui/checkmark';
import { SlActionTrackerStates } from './action-tracker-states';

class MockSlProgressSpinnerComponent implements SlProgressSpinnerAccessor {
    play(): void {
    }

    finish(): void {
    }

    reset(): void {
    }
}

class MockSlCheckmarkComponent implements SlCheckmarkAccessor {
    play(): void {
    }

    reset(): void {
    }
}

describe('SlActionTrackerComponent', () => {
    let component: SlActionTrackerComponent;
    let fixture: ComponentFixture<SlActionTrackerComponent>;

    const getSpinnerDe = () => fixture.debugElement.query(By.css('sl-progress-spinner'));
    const getCheckmarkDe = () => fixture.debugElement.query(By.css('sl-checkmark'));

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule
            ],
            declarations: [
                SlActionTrackerComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlActionTrackerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should complete all subjects before component gets destroyed', () => {
        component.ngOnDestroy();

        expect(component['_spinnerAnimationDoneSubject']).toHaveProperty('isStopped', true);
        expect(component['_checkmarkAnimationDoneSubject']).toHaveProperty('isStopped', true);
        expect(component.animationDone).toHaveProperty('isStopped', true);
    });

    describe('input value changes', function() {

        it('should merge config, passed through an input with (custom) default options and apply them', () => {
            const circleDiameter = 24,
                circleStrokeWidth = 3,
                stroke = 'grey';

            component.options = {
                circleDiameter,
                circleStrokeWidth,
                stroke
            };
            component.ngOnChanges({
                options: new SimpleChange(null, component.options, true)
            });

            expect(component.config).toHaveProperty('circleDiameter', circleDiameter);
            expect(component.config).toHaveProperty('circleStrokeWidth', circleStrokeWidth);
            expect(component.config).toHaveProperty('stroke', stroke);
        });

        it('should update circle diameter setting in config if appropriate input value changes', () => {
            component.circleDiameter = 24;
            component.ngOnChanges({
                circleDiameter: new SimpleChange(null, component.circleDiameter, true)
            });

            expect(component.config).toHaveProperty('circleDiameter', component.circleDiameter);
        });

        it('should update circle stroke width setting in config if appropriate input value changes', () => {
            component.circleStrokeWidth = 3;
            component.ngOnChanges({
                circleStrokeWidth: new SimpleChange(null, component.circleStrokeWidth, true)
            });

            expect(component.config).toHaveProperty('circleStrokeWidth', component.circleStrokeWidth);
        });

        it('should update stroke setting in config if appropriate input value changes', () => {
            component.stroke = 'black';
            component.ngOnChanges({
                stroke: new SimpleChange(null, component.stroke, true)
            });

            expect(component.config).toHaveProperty('stroke', component.stroke);
        });

        it('should update stroke success setting in config if appropriate input value changes', () => {
            component.strokeSuccess = 'yellow';
            component.ngOnChanges({
                strokeSuccess: new SimpleChange(null, component.strokeSuccess, true)
            });

            expect(component.config).toHaveProperty('strokeSuccess', component.strokeSuccess);
        });

        it('should update timing setting in config if appropriate input value changes', () => {
            component.checkmarkStrokeWidth = 3;
            component.ngOnChanges({
                checkmarkStrokeWidth: new SimpleChange(null, component.checkmarkStrokeWidth, true)
            });

            expect(component.config).toHaveProperty('checkmarkStrokeWidth', component.checkmarkStrokeWidth);
        });
    });

    describe('accessor interface methods', () => {
        let spinner: SlProgressSpinnerAccessor;
        let spinnerDe: DebugElement;
        let spinnerEl: any;

        let checkmark: SlCheckmarkAccessor;
        let checkmarkDe: DebugElement;
        let checkmarkEl: any;

        beforeEach(() => {
            spinner = new MockSlProgressSpinnerComponent();
            component['_spinner'] = spinner;
            spinnerDe = getSpinnerDe();
            spinnerEl = spinnerDe.nativeElement;

            checkmark = new MockSlCheckmarkComponent();
            component['_checkmark'] = checkmark;
            checkmarkDe = getCheckmarkDe();
            checkmarkEl = checkmarkDe.nativeElement;
        });

        it('should start animation sequence', () => {
            const spinnerPlaySpy = jest.spyOn(spinner, 'play');

            component.start();

            expect(spinnerPlaySpy).toBeCalledTimes(1);
            expect(component.state).toBe(SlActionTrackerStates.Playing);
        });

        it('should throw, if user tries to start animation sequence before previous one has finished', () => {
            component.start();

            expect(() => component.start()).toThrowError('Previous animation sequence hasn\'t finished yet');
        });

        it('should finish animation sequence and emit event after animation done', fakeAsync(() => {
            const spinnerFinishSpy = jest.spyOn(spinner, 'finish');
            const checkmarkPlaySpy = jest.spyOn(checkmark, 'play');
            const animationDoneSpy = jest.spyOn(component.animationDone, 'emit');

            component.start();
            component.finish();

            expect(component.state).toBe(SlActionTrackerStates.Finishing);

            spinnerDe.triggerEventHandler('animationDone', { mode: SlProgressSpinnerModes.Indeterminate });
            tick();
            fixture.detectChanges();

            expect(spinnerFinishSpy).toBeCalledTimes(1);
            expect(checkmarkPlaySpy).toBeCalledTimes(1);
            expect(spinnerEl).toHaveProperty('mode', SlProgressSpinnerModes.Determinate);
            expect(spinnerEl).toHaveProperty('stroke', component.strokeSuccess);
            expect(spinnerEl).toHaveProperty('value', 100);

            spinnerDe.triggerEventHandler('animationDone', { mode: SlProgressSpinnerModes.Determinate, value: 100 });
            checkmarkDe.triggerEventHandler('animationDone', undefined);
            tick();

            expect(animationDoneSpy).toHaveBeenCalledTimes(1);
            expect(component.state).toBe(SlActionTrackerStates.Idle);
        }));

        it('should throw, if user tries to finish animation sequence before it even has started', () => {
            expect(() => component.finish()).toThrowError('Animation sequence hasn\'t started yet');
        });

        it('should throw, if user tries to finish animation sequence after it was already scheduled to finish', () => {
            component.start();
            component.finish();

            expect(() => component.finish()).toThrowError('Animation sequence is already scheduled to finish');
        });

        it('should reset action tracker, so that it can play animation sequence again from scratch', () => {
            const spinnerResetSpy = jest.spyOn(spinner, 'reset');
            const checkmarkResetSpy = jest.spyOn(checkmark, 'reset');

            component.reset();

            expect(spinnerResetSpy).toHaveBeenCalledTimes(1);
            expect(checkmarkResetSpy).toHaveBeenCalledTimes(1);
            expect(spinnerEl).toHaveProperty('mode', SlProgressSpinnerModes.Indeterminate);
            expect(spinnerEl).toHaveProperty('stroke', component.stroke);
            expect(spinnerEl).toHaveProperty('value', 0);
            expect(component.state).toBe(SlActionTrackerStates.Idle);
        });
    });
});
