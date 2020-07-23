import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlSpinnerComponent } from './spinner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule
    ],
    declarations: [SlSpinnerComponent],
    exports: [SlSpinnerComponent]
})
export class CommonUiSpinnerModule {
}
