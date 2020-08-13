import { addDecorator, addParameters } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { themes } from '@storybook/theming/dist/create';

addDecorator(withKnobs);
addParameters({
    darkMode: {
        dark: { ...themes.dark, appBg: '#303030' },
        light: { ...themes.normal, appBg: '#F5F5F5' },
        current: 'light'
    }
});
