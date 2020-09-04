import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ScrollStrategy } from '@angular/cdk/overlay';

export type DialogRole = 'dialog' | 'alertdialog';

export interface DialogPosition {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
}

export class SlDialogConfig<D = any> {
    viewContainerRef?: ViewContainerRef;
    id?: string;
    role?: DialogRole = 'dialog';
    panelClass?: string | string[] = '';
    hasBackdrop = true;
    backdropClass = '';
    disableClose = false;
    width = '';
    height = '';
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string = '80vw';
    maxHeight?: number | string = '80vh';
    position?: DialogPosition;
    data?: D | null = null;
    ariaDescribedBy?: string | null = null;
    ariaLabelledBy?: string | null = null;
    ariaLabel?: string | null = null;
    autoFocus = true;
    restoreFocus = true;
    scrollStrategy?: ScrollStrategy;
    closeOnNavigation = true;
    componentFactoryResolver?: ComponentFactoryResolver;
}
