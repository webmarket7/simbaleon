import { Injectable, InjectionToken, Injector, StaticProvider, TemplateRef } from '@angular/core';
import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

import { SlDialogConfig } from './dialog-config';
import { SlDialogRef } from './dialog-ref';
import { SlDialogContainerComponent } from './dialog-container.component';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { defer, Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';


/** Injection token that can be used to access the data that was passed in to a dialog. */
export const SL_DIALOG_DATA = new InjectionToken<any>('SlDialogData');

@Injectable()
export class SlDialogService {

    private _openDialogs: SlDialogRef<any>[] = [];
    private _ariaHiddenElements = new Map<Element, string | null>();

    /** Keeps track of the currently-open dialogs. */
    get openDialogs(): SlDialogRef<any>[] {
        return this._openDialogs;
    }

    private readonly _afterOpened = new Subject<SlDialogRef<any>>();

    /** Stream that emits when a dialog has been opened. */
    get afterOpened(): Subject<SlDialogRef<any>> {
        return this._afterOpened;
    }

    private readonly _afterAllClosed = new Subject<void>();

    readonly afterAllClosed: Observable<void> = defer(() => this.openDialogs.length
        ? this._afterAllClosed
        : this._afterAllClosed.pipe(startWith(undefined))) as Observable<any>;


    constructor(
        private _overlay: Overlay,
        private _injector: Injector
    ) {
    }

    open<T, D = any, R = any>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: SlDialogConfig<D>): SlDialogRef<T, R> {
        config = applyConfigDefaults(config, new SlDialogConfig());

        const overlayRef = this._createOverlay(config);
        const modalContainer = this._attachModalContainer(overlayRef, config);
        const modalRef = this._attachModalContent<T, R>(
            componentOrTemplateRef,
            modalContainer,
            overlayRef,
            config
        );

        this.openDialogs.push(modalRef);

        modalRef.afterClosed().subscribe(() => this._removeOpenDialog(modalRef));
        this.afterOpened.next(modalRef);

        return modalRef;
    }

    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll(): void {
        this._closeDialogs(this.openDialogs);
    }

    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id: string): SlDialogRef<any> | undefined {
        return this.openDialogs.find(dialog => dialog.id === id);
    }

    private _createOverlay(config: SlDialogConfig): OverlayRef {
        return this._overlay.create(this._getOverlayConfig(config));
    }

    private _getOverlayConfig(modalConfig: SlDialogConfig): OverlayConfig {
        return new OverlayConfig({
            positionStrategy: this._overlay.position().global(),
            scrollStrategy: modalConfig.scrollStrategy,
            panelClass: modalConfig.panelClass,
            hasBackdrop: modalConfig.hasBackdrop,
            minWidth: modalConfig.minWidth,
            minHeight: modalConfig.minHeight,
            maxWidth: modalConfig.maxWidth,
            maxHeight: modalConfig.maxHeight,
            disposeOnNavigation: modalConfig.closeOnNavigation,
            ...(modalConfig.backdropClass && { backdropClass: modalConfig.backdropClass })
        });
    }

    private _attachModalContainer(overlayRef: OverlayRef, config?: SlDialogConfig): SlDialogContainerComponent {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const injector = Injector.create({
            parent: userInjector || this._injector,
            providers: [{ provide: SlDialogConfig, useValue: config }]
        });
        const containerPortal = new ComponentPortal(
            SlDialogContainerComponent,
            config.viewContainerRef,
            injector,
            config.componentFactoryResolver
        );
        const containerRef = overlayRef.attach<SlDialogContainerComponent>(containerPortal);

        return containerRef.instance;
    }

    private _attachModalContent<T, R>(
        componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
        modalContainer: SlDialogContainerComponent,
        overlayRef: OverlayRef,
        config: SlDialogConfig): SlDialogRef<T, R> {

        // Create a reference to the modal we're creating in order to give the user a handle
        // to modify and close it.
        const modalRef = new SlDialogRef<T, R>(overlayRef, modalContainer, config.id);

        if (componentOrTemplateRef instanceof TemplateRef) {
            const templatePortal = new TemplatePortal<T>(componentOrTemplateRef, null, {
                $implicit: config.data,
                modalRef
            } as any);

            modalContainer.attachTemplatePortal(templatePortal);
        } else {
            const injector = this._createInjector<T>(config, modalRef, modalContainer);
            const componentPortal = new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector);
            const contentRef = modalContainer.attachComponentPortal<T>(componentPortal);

            modalRef.componentInstance = contentRef.instance;
        }

        modalRef
            .updateSize(config.width, config.height)
            .updatePosition(config.position);

        return modalRef;
    }

    private _createInjector<T>(
        config: SlDialogConfig,
        modalRef: SlDialogRef<T>,
        modalContainer: SlDialogContainerComponent
    ): Injector {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const providers: StaticProvider[] = [
            { provide: SlDialogContainerComponent, useValue: modalContainer },
            { provide: SL_DIALOG_DATA, useValue: config.data },
            { provide: SlDialogRef, useValue: modalRef }
        ];

        return Injector.create({ parent: userInjector || this._injector, providers });
    }

    /**
     * Removes a dialog from the array of open dialogs.
     * @param dialogRef Dialog to be removed.
     */
    private _removeOpenDialog(dialogRef: SlDialogRef<any>) {
        const index = this.openDialogs.indexOf(dialogRef);

        if (index > -1) {
            this.openDialogs.splice(index, 1);

            // If all the dialogs were closed, remove/restore the `aria-hidden`
            // to a the siblings and emit to the `afterAllClosed` stream.
            if (!this.openDialogs.length) {
                this._ariaHiddenElements.forEach((previousValue, element) => {
                    if (previousValue) {
                        element.setAttribute('aria-hidden', previousValue);
                    } else {
                        element.removeAttribute('aria-hidden');
                    }
                });

                this._ariaHiddenElements.clear();
                this._afterAllClosed.next();
            }
        }
    }

    /** Closes all of the dialogs in an array. */
    private _closeDialogs(dialogs: SlDialogRef<any>[]): void {
        let i = dialogs.length;

        while (i--) {
            dialogs[i].close();
        }
    }
}

function applyConfigDefaults(config?: SlDialogConfig, defaultOptions?: SlDialogConfig): SlDialogConfig {
    return { ...defaultOptions, ...config };
}

