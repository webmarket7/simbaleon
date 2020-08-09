import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlCheckmarkComponent } from './checkmark.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SlCheckmarkComponent
    ],
    exports: [
        SlCheckmarkComponent
    ]
})
export class SlCheckmarkModule {
}
