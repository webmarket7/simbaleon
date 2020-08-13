import { addons } from '@storybook/addons';

export class LightDarkThemeVariables {
    constructor(lightTheme, darkTheme) {
        this.lightTheme = lightTheme;
        this.darkTheme = darkTheme;
        this.channel = addons.getChannel();
        this.head = this.getDocumentHead();
    }

    init() {
        this.channel.on('DARK_MODE', isDark => {
            if (this.css) {
                this.removeStyleTag(this.css);
            }

            this.css = this.createStyleTag(isDark ? this.darkTheme : this.lightTheme);
            this.addStyleTag(this.css);
        });
    }

    getDocumentHead() {
        return document.getElementsByTagName('head')[0];
    }

    createStyleTag(styles) {
        const css = document.createElement('style');

        css.appendChild(document.createTextNode(styles));

        return css;
    }

    addStyleTag(css) {
        this.head.appendChild(css);
    }

    removeStyleTag(css) {
        this.head.removeChild(css);
    }
}
