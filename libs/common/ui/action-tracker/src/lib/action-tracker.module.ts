import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SlActionTrackerComponent } from './action-tracker.component';
import { SlProgressSpinnerModule } from '@simbaleon/common/ui/progress-spinner';
import { SlCheckmarkModule } from '@simbaleon/common/ui/checkmark';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        SlProgressSpinnerModule,
        SlCheckmarkModule
    ],
    declarations: [
        SlActionTrackerComponent
    ],
    exports: [
        SlActionTrackerComponent
    ]
})
export class SlActionTrackerModule {
}
