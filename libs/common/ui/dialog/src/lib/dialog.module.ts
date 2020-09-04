import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { SlDialogService } from './dialog.service';
import { SlDialogContainerComponent } from './dialog-container.component';


@NgModule({
    imports: [
        CommonModule,
        OverlayModule,
        PortalModule
    ],
    providers: [
        SlDialogService
    ],
    declarations: [
        SlDialogContainerComponent
    ],
    exports: [
        SlDialogContainerComponent
    ]
})
export class SlDialogModule {
}
