import { Component } from '@angular/core';
import { SlDialogService } from '@simbaleon/common/ui/dialog';
import { IssueDialogComponent } from './issue-dialog/issue-dialog.component';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'sl-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private _dialogService: SlDialogService) {
    }

    openDialog(event: MouseEvent) {
        event.stopPropagation();

        const dialogRef = this._dialogService.open(IssueDialogComponent);

        dialogRef.closingRequested()
            .pipe(switchMap(() => of(true)))
            .subscribe((r) => r ? dialogRef.confirmClosing() : dialogRef.cancelClosing());
    }
}
