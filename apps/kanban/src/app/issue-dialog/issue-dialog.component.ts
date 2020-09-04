import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { SlDialogRef } from '../../../../../libs/common/ui/dialog/src/lib/dialog-ref';
import { take } from 'rxjs/operators';

@Component({
    selector: 'sl-issue-dialog',
    templateUrl: './issue-dialog.component.html',
    styleUrls: ['./issue-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueDialogComponent implements OnInit {

    constructor(@Optional() private _dialogRef: SlDialogRef<IssueDialogComponent>) {
    }

    ngOnInit(): void {
    }

    close(): void {
        this._dialogRef.closingConfirmed()
            .pipe(take(1))
            .subscribe((isConfirmed?: boolean) => {
                if (isConfirmed) {
                    this._dialogRef.close();
                }
            });
        this._dialogRef.requestClosing();
    }
}
