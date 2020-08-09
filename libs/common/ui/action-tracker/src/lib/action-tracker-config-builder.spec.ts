import { SlActionTrackerConfigBuilder } from './action-tracker-config-builder';
import { SlActionTrackerConfig } from './models/config.interface';


describe('SlActionTrackerConfigBuilder', () => {
    const defaultConfig: SlActionTrackerConfig = {
        circleDiameter: 18,
        circleStrokeWidth: 2,
        stroke: '#7DB0D5',
        strokeSuccess: 'green',
        checkmarkStrokeWidth: 2,
        _checkmarkContainerSize: 8.415
    };

    it('should build default config if initialized without custom options', () => {
        expect(new SlActionTrackerConfigBuilder().build()).toEqual(defaultConfig);
    });

    it('should merge default config with custom options if builder was instantiated with any', () => {
        expect(new SlActionTrackerConfigBuilder({
            circleDiameter: 24,
            circleStrokeWidth: 3
        }).build()).toEqual({
            circleDiameter: 24,
            circleStrokeWidth: 3,
            stroke: '#7DB0D5',
            strokeSuccess: 'green',
            checkmarkStrokeWidth: 2,
            _checkmarkContainerSize: 10.82
        });
    });

    describe('set custom settings', () => {
        let configBuilder: SlActionTrackerConfigBuilder;

        beforeEach(() => {
            configBuilder = new SlActionTrackerConfigBuilder();
        });

        it('should set custom circle diameter and update checkmark container size based on new value', () => {
            const customCircleDiameter = 24;
            const config = configBuilder.setCircleDiameter(customCircleDiameter).build();

            expect(config.circleDiameter).toBe(customCircleDiameter);
            expect(config._checkmarkContainerSize).toBe(12.02);
        });

        it('should set custom circle stroke width and update checkmark container size based on new value', () => {
            const customCircleStrokeWidth = 3;
            const config = configBuilder.setCircleStrokeWidth(customCircleStrokeWidth).build();

            expect(config.circleStrokeWidth).toBe(customCircleStrokeWidth);
            expect(config._checkmarkContainerSize).toBe(7.212);
        });

        it('should set custom stroke', () => {
            const customStroke = 'grey';
            const config = configBuilder.setStroke(customStroke).build();

            expect(config.stroke).toBe(customStroke);
        });

        it('should set custom stroke used for success animation', () => {
            const customStrokeSuccess = 'yellow';
            const config = configBuilder.setStrokeSuccess(customStrokeSuccess).build();

            expect(config.strokeSuccess).toBe(customStrokeSuccess);
        });

        it('should set custom checkmark stroke width', () => {
            const customCheckmarkStrokeWidth = 3;
            const config = configBuilder.setCheckmarkStrokeWidth(customCheckmarkStrokeWidth).build();

            expect(config.checkmarkStrokeWidth).toBe(customCheckmarkStrokeWidth);
        });
    });
});
