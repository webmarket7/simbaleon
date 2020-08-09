import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SlProgressSpinnerComponent } from './progress-spinner.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule
    ],
    declarations: [
        SlProgressSpinnerComponent
    ],
    exports: [
        SlProgressSpinnerComponent
    ]
})
export class SlProgressSpinnerModule {
}
