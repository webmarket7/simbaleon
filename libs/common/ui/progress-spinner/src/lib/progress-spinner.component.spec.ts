import { async, ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SlProgressSpinnerComponent } from './progress-spinner.component';
import { SlProgressSpinnerAnimationDoneEvent, SlProgressSpinnerModes } from '@simbaleon/common/ui/progress-spinner';
import { take } from 'rxjs/operators';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';


class AnimationPlayerStub {
    callback: () => void;
    isDestroyed: boolean;
    timeout: NodeJS.Timer;

    onDone(callback): void {
        this.callback = callback;
    }

    play(): void {
        this.timeout = setTimeout(this.callback, 50);
    }

    destroy(): void {
        this.isDestroyed = true;
        clearTimeout(this.timeout);
    }
}


describe('SlProgressSpinnerComponent', () => {
    let component: SlProgressSpinnerComponent;
    let fixture: ComponentFixture<SlProgressSpinnerComponent>;

    const getCircle = () => fixture.debugElement.query(By.css('circle'));

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule
            ],
            declarations: [
                SlProgressSpinnerComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlProgressSpinnerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should play animation after view is initialized if playOnInit option is true', () => {
        const playSpy = jest.spyOn(component, 'play').mockImplementation(() => {});

        fixture.detectChanges();

        expect(playSpy).toHaveBeenCalledTimes(1);
    });

    it('should not play animation after view is initialized if playOnInit option is false', () => {
        const playSpy = jest.spyOn(component, 'play');

        component.playOnInit = false;
        component.ngOnChanges({
            playOnInit: new SimpleChange(undefined, component.playOnInit, true)
        });
        fixture.detectChanges();

        expect(playSpy).toHaveBeenCalledTimes(0);
    });

    describe('input value changes', function() {

        it('should merge config, passed through an input with (custom) default options and apply them', () => {
            const diameter = 48,
                strokeWidth = 6,
                stroke = 'grey';

            component.options = {
                diameter,
                strokeWidth,
                stroke
            };
            component.ngOnChanges({
                options: new SimpleChange(null, component.options, true)
            });

            expect(component.config).toHaveProperty('diameter', diameter);
            expect(component.config).toHaveProperty('strokeWidth', strokeWidth);
            expect(component.config).toHaveProperty('stroke', stroke);
        });

        it('should update mode setting in config if appropriate input value changes', () => {
            component.mode = SlProgressSpinnerModes.Determinate;
            component.ngOnChanges({
                mode: new SimpleChange(null, component.mode, true)
            });

            expect(component.config).toHaveProperty('mode', component.mode);
        });

        it('should update diameter setting in config if appropriate input value changes', () => {
            component.diameter = 16;
            component.ngOnChanges({
                diameter: new SimpleChange(null, component.diameter, true)
            });

            expect(component.config).toHaveProperty('diameter', component.diameter);
        });

        it('should update stroke width setting in config if appropriate input value changes', () => {
            component.strokeWidth = 4;
            component.ngOnChanges({
                strokeWidth: new SimpleChange(null, component.strokeWidth, true)
            });

            expect(component.config).toHaveProperty('strokeWidth', component.strokeWidth);
        });

        it('should update stroke setting in config if appropriate input value changes', () => {
            component.stroke = 'black';
            component.ngOnChanges({
                stroke: new SimpleChange(null, component.stroke, true)
            });

            expect(component.config).toHaveProperty('stroke', component.stroke);
        });

        it('should update indeterminateTiming setting in config if appropriate input value changes', () => {
            component.indeterminateTiming = '2s linear';
            component.ngOnChanges({
                indeterminateTiming: new SimpleChange(null, component.indeterminateTiming, true)
            });

            expect(component.config).toHaveProperty('indeterminateTiming', component.indeterminateTiming);
        });

        it('should update determinateTiming setting in config if appropriate input value changes', () => {
            component.determinateTiming = '2s linear';
            component.ngOnChanges({
                determinateTiming: new SimpleChange(null, component.determinateTiming, true)
            });

            expect(component.config).toHaveProperty('determinateTiming', component.determinateTiming);
        });

        it('should update value setting in config if appropriate input value changes', () => {
            component.value = 20;
            component.ngOnChanges({
                value: new SimpleChange(null, component.value, true)
            });

            expect(component.config).toHaveProperty('value', component.value);
        });

        it('should update playOnInit setting in config if appropriate input value changes', () => {
            component.playOnInit = false;
            component.ngOnChanges({
                playOnInit: new SimpleChange(null, component.playOnInit, true)
            });

            expect(component.config).toHaveProperty('playOnInit', false);
        });

        it('should play determinate animation on value change', fakeAsync(() => {
            const mode = SlProgressSpinnerModes.Determinate;
            const value = 100;
            let animationDoneEvent: SlProgressSpinnerAnimationDoneEvent;

            component.mode = mode;
            component.value = value;
            component.playOnInit = false;
            fixture.detectChanges();
            tick();
            fixture.detectChanges();
            expect(getCircle().attributes['stroke-dashoffset']).toBe(`${component.config._strokeCircumference}`);

            component.ngOnChanges({
                playOnInit: new SimpleChange(null, false, true),
                mode: new SimpleChange(null, mode, true),
                value: new SimpleChange(null, value, false)
            });
            component.animationDone.pipe(take(1)).subscribe((event) => animationDoneEvent = event);
            tick();
            fixture.detectChanges();

            expect(component.config).toHaveProperty('mode', mode);
            expect(component.config).toHaveProperty('value', value);
            expect(component.config).toHaveProperty('playOnInit', false);
            expect(animationDoneEvent).toEqual({ mode, value });
            expect(getCircle().attributes['stroke-dashoffset']).toBe('0');
        }));
    });

    describe('indeterminate mode', () => {

        it('should play indeterminate animation until component gets destroyed', fakeAsync(() => {
            const spy = jest.spyOn<any, string>(component, '_playAnimation');

            jest.spyOn<any, string>(component, '_createAnimationPlayer').mockReturnValue(new AnimationPlayerStub());
            component.play();
            tick(25);
            fixture.destroy();
            tick(25);

            expect(spy).toHaveBeenCalledTimes(1);
        }));

        it('should finish indeterminate animation and emit animationDone event after it is done', fakeAsync(() => {
            const spy = jest.spyOn<any, string>(component, '_playAnimation');
            let animationDoneEvent: SlProgressSpinnerAnimationDoneEvent;

            jest.spyOn<any, string>(component, '_createAnimationPlayer').mockReturnValue(new AnimationPlayerStub());
            component.animationDone.pipe(take(1)).subscribe((event) => animationDoneEvent = event);
            component.play();
            tick(100);
            component.finish();
            tick(50);

            expect(spy).toHaveBeenCalledTimes(3);
            expect(animationDoneEvent).toEqual({ mode: SlProgressSpinnerModes.Indeterminate });
        }));

        it('should reset spinner and prepare animation to be played again', fakeAsync(() => {
            const spy = jest.spyOn<any, string>(component, '_playAnimation');

            jest.spyOn<any, string>(component, '_createAnimationPlayer').mockReturnValue(new AnimationPlayerStub());
            component.play();
            tick(25);
            component.finish();
            tick(25);
            component.reset();
            component.play();
            tick(25);
            component.finish();
            tick(25);

            expect(spy).toHaveBeenCalledTimes(2);
        }));
    });

    describe('determinate mode', () => {

        it('should play determinate animation and emit animationDone event after it is done', fakeAsync(() => {
            const mode = SlProgressSpinnerModes.Determinate;
            const value = 50;
            const spy = jest.spyOn<any, string>(component, '_playAnimation');
            let animationDoneEvent: SlProgressSpinnerAnimationDoneEvent;

            component.configBuilder.setMode(mode).setValue(value);
            component.applyConfig(component.config);
            fixture.detectChanges();
            component.animationDone.pipe(take(1)).subscribe((event) => animationDoneEvent = event);
            flushMicrotasks();

            expect(spy).toHaveBeenCalledTimes(1);
            expect(animationDoneEvent).toEqual({ mode, value });
        }));

        it('should reset spinner', fakeAsync(() => {
            const spy = jest.spyOn<any, string>(component, '_playAnimation');
            const circumference = component.config['_strokeCircumference'];

            component.configBuilder.setMode(SlProgressSpinnerModes.Determinate).setValue(50);
            component.applyConfig(component.config);
            fixture.detectChanges();
            expect(getCircle().attributes['stroke-dashoffset']).toBe(`${circumference}`);
            component.play();
            tick();
            fixture.detectChanges();
            expect(getCircle().attributes['stroke-dashoffset']).toBe(`${circumference / 2}`);
            component.reset();
            fixture.detectChanges();
            expect(getCircle().attributes['stroke-dashoffset']).toBe(`${circumference}`);
        }));
    });
});
