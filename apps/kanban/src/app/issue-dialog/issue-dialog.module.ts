import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueDialogComponent } from './issue-dialog.component';


@NgModule({
    declarations: [IssueDialogComponent],
    imports: [
        CommonModule
    ],
    exports: [IssueDialogComponent]
})
export class IssueDialogModule {
}
