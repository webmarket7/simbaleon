import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { SlDialogModule } from '@simbaleon/common/ui/dialog';

import { AppComponent } from './app.component';
import { IssueDialogModule } from './issue-dialog/issue-dialog.module';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SlDialogModule,
        IssueDialogModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
