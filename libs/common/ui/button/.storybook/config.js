import { configure } from '@storybook/angular';
import { LightDarkThemeVariables } from '../../../../../.storybook/utils/light-dark-theme-variables';
import '../../../../../.storybook/config';

const light = `:root {
    --button-bg-color: rgba(255, 255, 255, 1);
    --button-color: rgba(0,0,0,.87);
    --button-primary-bg-color: #673ab7;
    --button-primary-color: rgba(250, 250, 250, 1);
    --button-accent-bg-color: #ffd740;
    --button-accent-color: rgba(0, 0, 0, 0.87);
    --button-warning-bg-color: #f44336;
    --button-warning-color: rgba(250, 250, 250, 1);
    --button-disabled-bg-color: rgba(0, 0, 0, 0.12);
    --button-disabled-color: rgba(0, 0, 0, 0.26);
}`;
const dark = `:root {
    --button-bg-color: rgba(66, 66, 66, 1);
    --button-color: rgba(250, 250, 250, 1);
    --button-primary-bg-color: #673ab7;
    --button-primary-color: rgba(250, 250, 250, 1);
    --button-accent-bg-color: #ffd740;
    --button-accent-color: rgba(0, 0, 0, 0.87);
    --button-warning-bg-color: #f44336;
    --button-warning-color: rgba(250, 250, 250, 1);
    --button-disabled-bg-color: rgba(255, 255, 255, 0.12);
    --button-disabled-color: rgba(255, 255, 255, 0.3);
}`;

new LightDarkThemeVariables(light, dark).init();

configure(require.context('../src/lib', true, /\.stories\.(j|t)sx?$/), module);
