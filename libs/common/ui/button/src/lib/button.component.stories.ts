import { SlButtonComponent } from './button.component';
import { boolean, select } from '@storybook/addon-knobs';

export default {
    title: 'Button'
};

const moduleMetadata = {
    declarations: [
        SlButtonComponent
    ]
};
const constructProps = () => {
    return {
        color: select('color', {
            Primary: 'primary',
            Accent: 'accent',
            Warning: 'warning',
            None: undefined
        }, undefined),
        disabled: boolean('disabled', false)
    };
};

export const basic = () => ({
    moduleMetadata,
    props: constructProps(),
    template: `<button sl-button [color]='color' [disabled]='disabled'>Create issue</button>`
});

export const raised = () => ({
    moduleMetadata,
    props: constructProps(),
    template: `<button sl-raised-button [color]='color' [disabled]='disabled'>Create issue</button>`
});

export const flat = () => ({
    moduleMetadata,
    props: constructProps(),
    template: `<button sl-flat-button [color]='color' [disabled]='disabled'>Create issue</button>`
});

export const stroked = () => ({
    moduleMetadata,
    props: constructProps(),
    template: `<button sl-stroked-button [color]='color' [disabled]='disabled'>Create issue</button>`
});

