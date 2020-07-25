import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlSpinnerComponent } from './spinner.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SlSpinnerComponent', () => {
    let component: SlSpinnerComponent;
    let fixture: ComponentFixture<SlSpinnerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            declarations: [SlSpinnerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlSpinnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add class sl-spinner to host element', () => {
        expect(fixture.debugElement.properties).toHaveProperty('className', 'sl-spinner');
    });
});
