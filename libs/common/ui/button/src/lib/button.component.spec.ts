import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SlButtonComponent, ThemePalette } from './button.component';


@Component({
    template: `
        <button sl-button [color]='color' [disabled]='disabled'></button>`
})
class MockHostComponent {
    disabled: boolean;
    color: string;
}

describe('SlButtonComponent', () => {
    let component: SlButtonComponent;
    let fixture: ComponentFixture<SlButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SlButtonComponent,
                MockHostComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('host bindings', () => {
        let hostFixture: ComponentFixture<MockHostComponent>;
        let hostComponent: MockHostComponent;
        const getButtonDe = () => hostFixture.debugElement.query(By.css('button'));

        beforeEach(() => {
            hostFixture = TestBed.createComponent(MockHostComponent);
            hostComponent = hostFixture.componentInstance;
        });

        it('should disable/enable button via disabled input', () => {
            hostComponent.disabled = false;
            hostFixture.detectChanges();

            expect(getButtonDe().attributes).toHaveProperty('disabled', null);

            hostComponent.disabled = true;
            hostFixture.detectChanges();

            expect(getButtonDe().attributes).toHaveProperty('disabled', 'true');
        });

        it('should add appropriate css class based on color property when it changes', () => {
            const setColor = (color: ThemePalette) => {
                hostComponent.color = color;
                hostFixture.detectChanges();
            };
            const getColorProp = () => {
                return getButtonDe().properties.className;
            };

            setColor('primary');
            expect(getColorProp()).toBe('sl-button sl-button--primary');

            setColor('accent');
            expect(getColorProp()).toBe('sl-button sl-button--accent');

            setColor('warn');
            expect(getColorProp()).toBe('sl-button sl-button--warn');

            setColor(undefined);
            expect(getColorProp()).toBe('sl-button');
        });
    });
});
