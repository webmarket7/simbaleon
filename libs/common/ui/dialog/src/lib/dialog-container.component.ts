import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component, ComponentRef,
    ElementRef, EmbeddedViewRef,
    EventEmitter,
    HostBinding, HostListener, Inject, Optional,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { ConfigurableFocusTrapFactory, FocusOrigin, FocusTrap } from '@angular/cdk/a11y';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';

import { slDialogAnimations } from './dialog-animations';
import { DialogRole, SlDialogConfig } from './dialog-config';


export function throwDialogContentAlreadyAttachedError(): void {
    throw Error('Attempting to attach modal content after content is already attached');
}

@Component({
    selector: 'sl-dialog-container',
    templateUrl: './dialog-container.component.html',
    styleUrls: ['./dialog-container.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [slDialogAnimations.dialogContainer]
})
export class SlDialogContainerComponent extends BasePortalOutlet {

    @HostBinding('class') className = 'sl-dialog__container';
    @HostBinding('tabindex') tabindex = '-1';
    @HostBinding('aria-modal') ariaModal = 'true';

    /** ID for the container DOM element. */
    @HostBinding('attr.id') id: string;

    @HostBinding('attr.role') role: DialogRole;

    /** ID of the element that should be considered as the dialog's label. */
    @HostBinding('attr.aria-label') ariaLabel: string | null;

    /** ID of the element that should be considered as the dialog's label. */
    @HostBinding('attr.aria-labelledby') ariaLabelledBy: string | null;

    @HostBinding('attr.aria-describedby') ariaDescribedBy: string | null;

    private _document: Document;

    /** The portal outlet inside of this container into which the dialog content will be loaded. */
    @ViewChild(CdkPortalOutlet, { static: true }) private _portalOutlet: CdkPortalOutlet;

    /** The class that traps and manages focus within the dialog. */
    private _focusTrap: FocusTrap;

    /** Element that was focused before the dialog was opened. Save this to restore upon close. */
    private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

    /** Emits when an animation state changes. */
    animationStateChanged = new EventEmitter<AnimationEvent>();

    /** State of the dialog animation. */
    @HostBinding('@dialogContainer') state: 'void' | 'enter' | 'exit' = 'enter';

    /** Callback, invoked when an animation on the host starts. */
    @HostListener('@dialogContainer.start', ['$event']) onAnimationStart(event: AnimationEvent) {
        this.animationStateChanged.emit(event);
    }

    /** Callback, invoked whenever an animation on the host completes. */
    @HostListener('@dialogContainer.done', ['$event']) onAnimationDone(event: AnimationEvent): void {
        if (event.toState === 'enter') {
            this._trapFocus();
        } else if (event.toState === 'exit') {
            this._restoreFocus();
        }

        this.animationStateChanged.emit(event);
    }

    constructor(
        private _elementRef: ElementRef,
        private _focusTrapFactory: ConfigurableFocusTrapFactory,
        private _changeDetectorRef: ChangeDetectorRef,
        @Optional() @Inject(DOCUMENT) _document: any,
        public config: SlDialogConfig
    ) {
        super();
        this._document = _document;
        this.ariaLabel = config.ariaLabel || null;
        this.ariaLabelledBy = config.ariaLabel ? null : (config.ariaLabelledBy || null);
        this.ariaDescribedBy = config.ariaDescribedBy || null;
        this.role = config.role;
    }

    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
        if (this._portalOutlet.hasAttached()) {
            throwDialogContentAlreadyAttachedError();
        }

        this._setupFocusTrap();
        return this._portalOutlet.attachComponentPortal(portal);
    }

    attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
        if (this._portalOutlet.hasAttached()) {
            throwDialogContentAlreadyAttachedError();
        }

        this._setupFocusTrap();
        return this._portalOutlet.attachTemplatePortal(portal);
    }

    /** Moves focus back into the modal if it was moved out. */
    recaptureFocus(): void {
        if (!this._containsFocus()) {
            const focusContainer = !this.config.autoFocus || !this._focusTrap.focusInitialElement();

            if (focusContainer) {
                this._elementRef.nativeElement.focus();
            }
        }
    }

    private _setupFocusTrap() {
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        }

        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;

            if (this._elementRef.nativeElement.focus) {
                Promise.resolve().then(() => this._elementRef.nativeElement.focus());
            }
        }
    }

    /** Moves the focus inside the focus trap. */
    private _trapFocus(): void {
        if (this.config.autoFocus) {
            this._focusTrap.focusInitialElementWhenReady();
        } else if (!this._containsFocus()) {
            this._elementRef.nativeElement.focus();
        }
    }

    /** Returns whether focus is inside the dialog. */
    private _containsFocus(): boolean {
        const element = this._elementRef.nativeElement;
        const activeElement = this._document.activeElement;

        return element === activeElement || element.contains(activeElement);
    }

    /** Restores focus to the element that was focused before the dialog opened. */
    private _restoreFocus() {
        const toFocus = this._elementFocusedBeforeDialogWasOpened;

        if (this.config.restoreFocus && toFocus && typeof toFocus.focus === 'function') {
            const activeElement = this._document.activeElement;
            const element = this._elementRef.nativeElement;

            // Make sure that focus is still inside the dialog or is on the body (usually because a
            // non-focusable element like the backdrop was clicked) before moving it. It's possible that
            // the consumer moved it themselves before the animation was done, in which case we shouldn't
            // do anything.
            if (!activeElement
                || activeElement === this._document.body
                || activeElement === element
                || element.contains(activeElement)) {
                toFocus.focus();
            }
        }

        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    }

    /** Starts the dialog exit animation. */
    startExitAnimation(): void {
        this.state = 'exit';
        this._changeDetectorRef.markForCheck();
    }
}
