import { SlCheckmarkConfig } from './models/config.interface';
import { SlCheckmarkConfigBuilder } from './checkmark-config-builder';


describe('SlCheckmarkConfigBuilder', () => {
    const defaultConfig: SlCheckmarkConfig = {
        playOnInit: true,
        containerSize: 8,
        strokeWidth: 2,
        stroke: 'green',
        timing: '0.225s linear',
        _points: '8 0, 3.2 7, 1 4.8',
        _dashArray: 16
    };

    it('should build default config if initialized without custom options', () => {
        expect(new SlCheckmarkConfigBuilder().build()).toEqual(defaultConfig);
    });

    it('should merge default config with custom options if builder was instantiated with any', () => {
        expect(new SlCheckmarkConfigBuilder({
            playOnInit: false,
            containerSize: 24,
            strokeWidth: 3
        }).build()).toEqual({
            playOnInit: false,
            containerSize: 24,
            strokeWidth: 3,
            stroke: 'green',
            timing: '0.225s linear',
            _points: '24 0, 9.6 22.5, 1.5 14.4',
            _dashArray: 48
        });
    });

    describe('set custom settings', () => {
        let configBuilder: SlCheckmarkConfigBuilder;

        beforeEach(() => {
            configBuilder = new SlCheckmarkConfigBuilder();
        });

        it('should change the setting, which determines if animation should play on component intialization', () => {
            const customPlayOnInit = false;
            const config = configBuilder.setPlayOnInit(customPlayOnInit).build();

            expect(config).toHaveProperty('playOnInit', customPlayOnInit);
        });

        it('should set custom container size and recalculate points and dashArray based on new value', () => {
            const customContainerSize = 24;
            const config = configBuilder.setContainerSize(customContainerSize).build();

            expect(config).toHaveProperty('containerSize', customContainerSize);
            expect(config).toHaveProperty('_points', '24 0, 9.6 23, 1 14.4');
            expect(config).toHaveProperty('_dashArray', 48);
        });

        it('should set custom stroke', () => {
            const customStroke = 'yellow';
            const config = configBuilder.setStroke(customStroke).build();

            expect(config).toHaveProperty('stroke', customStroke);
        });

        it('should set custom stroke width and recalculate points based on new value', () => {
            const customStrokeWidth = 3;
            const config = configBuilder.setStrokeWidth(customStrokeWidth).build();

            expect(config).toHaveProperty('strokeWidth', customStrokeWidth);
            expect(config).toHaveProperty('_points', '8 0, 3.2 6.5, 1.5 4.8');
        });

        it('should set custom timing option for checkmark animation', () => {
            const customTiming = '1.5s linear';
            const config = configBuilder.setTiming(customTiming).build();

            expect(config).toHaveProperty('timing', customTiming);
        });
    });
});
