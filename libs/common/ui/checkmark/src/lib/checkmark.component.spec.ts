import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SlCheckmarkComponent } from './checkmark.component';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';


describe('SlCheckmarkComponent', () => {
    let component: SlCheckmarkComponent;
    let fixture: ComponentFixture<SlCheckmarkComponent>;

    const getPolyline = () => fixture.debugElement.query(By.css('polyline'));

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            declarations: [SlCheckmarkComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlCheckmarkComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should play animation after view is initialized if playOnInit option is true', () => {
        const playSpy = jest.spyOn(component, 'play').mockImplementation(() => {
        });

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

    it('should play checkmark animation and emit animationDone event after it is done', fakeAsync(() => {
        const spy = jest.spyOn<any, string>(component, '_playAnimation');
        const animationDoneSpy = jest.spyOn(component.animationDone, 'emit');

        fixture.detectChanges();
        tick();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(animationDoneSpy).toHaveBeenCalledTimes(1);
        expect(animationDoneSpy).toHaveBeenCalledWith();
    }));

    it('should reset checkmark', fakeAsync(() => {
        const spy = jest.spyOn<any, string>(component, '_playAnimation');
        const dashOffset = -(component.config['_dashArray']);

        component.playOnInit = false;
        component.ngOnChanges({
            playOnInit: new SimpleChange(undefined, component.playOnInit, true)
        });
        fixture.detectChanges();

        expect(getPolyline().attributes['stroke-dashoffset']).toBe(`${dashOffset}`);
        component.play();
        tick();
        fixture.detectChanges();
        expect(getPolyline().attributes['stroke-dashoffset']).toBe('0');
        component.reset();
        fixture.detectChanges();
        expect(getPolyline().attributes['stroke-dashoffset']).toBe(`${dashOffset}`);
    }));

    describe('input value changes', function() {

        it('should merge config, passed through an input with (custom) default options and apply them', () => {
            const containerSize = 24,
                strokeWidth = 3,
                stroke = 'grey';

            component.options = {
                containerSize,
                strokeWidth,
                stroke
            };
            component.ngOnChanges({
                options: new SimpleChange(null, component.options, true)
            });

            expect(component.config).toHaveProperty('containerSize', containerSize);
            expect(component.config).toHaveProperty('strokeWidth', strokeWidth);
            expect(component.config).toHaveProperty('stroke', stroke);
        });

        it('should update container size setting in config if appropriate input value changes', () => {
            component.containerSize = 24;
            component.ngOnChanges({
                containerSize: new SimpleChange(null, component.containerSize, true)
            });

            expect(component.config).toHaveProperty('containerSize', component.containerSize);
        });

        it('should update stroke width setting in config if appropriate input value changes', () => {
            component.strokeWidth = 3;
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

        it('should update timing setting in config if appropriate input value changes', () => {
            component.timing = '2s linear';
            component.ngOnChanges({
                timing: new SimpleChange(null, component.timing, true)
            });

            expect(component.config).toHaveProperty('timing', component.timing);
        });

        it('should update playOnInit setting in config if appropriate input value changes', () => {
            component.playOnInit = false;
            component.ngOnChanges({
                playOnInit: new SimpleChange(null, component.playOnInit, true)
            });

            expect(component.config).toHaveProperty('playOnInit', false);
        });
    });
});
