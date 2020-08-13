import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

export type ThemePalette = 'primary' | 'accent' | 'warn' | undefined;

@Component({
    selector: `button[sl-button], button[sl-raised-button], button[sl-flat-button],
               button[sl-stroked-button]`,
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    exportAs: 'SlButton',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SlButtonComponent {

    @HostBinding('class') private _className: string;

    @Input()
    set color(value: ThemePalette) {
        let className = 'sl-button';

        if (value) {
            className = className + ` sl-button--${value}`;
        }

        this._className = className;
        this._color = value;
    }

    private _color: ThemePalette;

    @HostBinding('attr.disabled')
    @Input()
    set disabled(isDisabled: boolean) {
        this._disabled = isDisabled || null;
    }

    get disabled() {
        return this._disabled;
    }

    private _disabled: true | null;

    constructor() {
    }
}
