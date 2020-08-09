import { SlProgressSpinnerConfigBuilder } from './progress-spinner-config-builder';
import { SlProgressSpinnerModes } from '@simbaleon/common/ui/progress-spinner';
import { SlProgressSpinnerConfig } from './models/config.interface';


describe('SlProgressSpinnerConfigBuilder', () => {
    const defaultStrokeCircumference = 50.26548245743669;
    const defaultConfig: SlProgressSpinnerConfig = {
        mode: SlProgressSpinnerModes.Indeterminate,
        diameter: 18,
        stroke: '#7DB0D5',
        strokeWidth: 2,
        min: 0,
        max: 0.5,
        indeterminateTiming: '1s linear',
        determinateTiming: '0.225s linear',
        value: 0,
        playOnInit: true,
        _radius: 8,
        _strokeCircumference: defaultStrokeCircumference,
        _dashArray: { min: 0, max: defaultStrokeCircumference / 2, full: defaultStrokeCircumference },
        _dashOffset: defaultStrokeCircumference
    };

    it('should build default config if initialized without custom options', () => {
        expect(new SlProgressSpinnerConfigBuilder().build()).toEqual(defaultConfig);
    });

    it('should merge default config with custom options if builder was instantiated with any', () => {
        expect(new SlProgressSpinnerConfigBuilder({
            stroke: 'black'
        }).build()).toEqual({...defaultConfig, stroke: 'black'});
    });

    it('should change spinner mode', () => {
        const config = new SlProgressSpinnerConfigBuilder().setMode(SlProgressSpinnerModes.Determinate).build();

        expect(config).toHaveProperty('mode', SlProgressSpinnerModes.Determinate);
    });

    it('should change the setting, which determines if animation should play on component intialization', () => {
        const customPlayOnInit = false;
        const config = new SlProgressSpinnerConfigBuilder().setPlayOnInit(customPlayOnInit).build();

        expect(config).toHaveProperty('playOnInit', customPlayOnInit);
    });

    it('should set custom diameter', () => {
        const customDiameter = 10;
        const config = new SlProgressSpinnerConfigBuilder().setDiameter(customDiameter).build();

        expect(config).toHaveProperty('diameter', customDiameter);
    });

    it('should set custom stroke', () => {
        const customStroke = 'green';
        const config = new SlProgressSpinnerConfigBuilder().setStroke(customStroke).build();

        expect(config).toHaveProperty('stroke', customStroke);
    });

    it('should set custom stroke width', () => {
        const customStrokeWidth = 3;
        const config = new SlProgressSpinnerConfigBuilder().setStrokeWidth(customStrokeWidth).build();

        expect(config).toHaveProperty('strokeWidth', customStrokeWidth);
    });

    it('should set custom minimum circle length for indeterminate spinner in percents as decimal', () => {
        const customMin = 0.25;
        const config = new SlProgressSpinnerConfigBuilder().setMin(customMin).build();

        expect(config).toHaveProperty('min', customMin);
    });

    it('should set custom maximum circle length for indeterminate spinner in percents as decimal', () => {
        const customMax = 0.25;
        const config = new SlProgressSpinnerConfigBuilder().setMax(customMax).build();

        expect(config).toHaveProperty('max', customMax);
    });

    it('should set custom timing option for indeterminate spinner animation', () => {
        const customTiming = '1.5s linear';
        const config = new SlProgressSpinnerConfigBuilder().setIndeterminateTiming(customTiming).build();

        expect(config).toHaveProperty('indeterminateTiming', customTiming);
    });

    it('should set custom timing option for determinate spinner animation', () => {
        const customTiming = '0.3s linear';
        const config = new SlProgressSpinnerConfigBuilder().setDeterminateTiming(customTiming).build();

        expect(config).toHaveProperty('determinateTiming', customTiming);
    });

    it('should set custom value and clamp it with min 0 and max 100', () => {
        expect(new SlProgressSpinnerConfigBuilder({ value: 200 }).build()).toHaveProperty('value', 100);
        expect(new SlProgressSpinnerConfigBuilder().setValue(-100).build()).toHaveProperty('value', 0);
    });

    it('should recalculate circle radius when diameter or stroke width changes', () => {
        const builder = new SlProgressSpinnerConfigBuilder({ diameter: 16, strokeWidth: 1 });

        expect(builder.build()).toHaveProperty('_radius', 7.5);
        expect(builder.setDiameter(24).build()).toHaveProperty('_radius', 11.5);
        expect(builder.setStrokeWidth(2).build()).toHaveProperty('_radius', 11);
    });

    it('should recalculate circle stroke circumference when diameter or stroke width changes', () => {
        const builder = new SlProgressSpinnerConfigBuilder({ diameter: 16, strokeWidth: 1 });

        expect(builder.build()).toHaveProperty('_strokeCircumference', 47.12388980384689);
        expect(builder.setDiameter(24).build()).toHaveProperty('_strokeCircumference', 72.25663103256524);
        expect(builder.setStrokeWidth(3).build()).toHaveProperty('_strokeCircumference', 65.97344572538566);
    });

    it('should recalculate circle dash array when diameter, stroke width, min or max changes', () => {
        const builder = new SlProgressSpinnerConfigBuilder({ diameter: 16, strokeWidth: 1, min: 0.1, max: 0.4 });

        expect(builder.build()).toHaveProperty('_dashArray', {
            min: 4.71238898038469,
            max: 18.84955592153876,
            full: 47.12388980384689
        });
        expect(builder.setDiameter(24).build()).toHaveProperty('_dashArray', {
            min: 7.225663103256524,
            max: 28.902652413026097,
            full: 72.25663103256524
        });
        expect(builder.setStrokeWidth(3).build()).toHaveProperty('_dashArray', {
            min: 6.597344572538566,
            max: 26.389378290154266,
            full: 65.97344572538566
        });
        expect(builder.setMin(0.3).build()).toHaveProperty('_dashArray', {
            min: 19.7920337176157,
            max: 26.389378290154266,
            full: 65.97344572538566
        });
        expect(builder.setMax(0.7).build()).toHaveProperty('_dashArray', {
            min: 19.7920337176157,
            max: 46.18141200776996,
            full: 65.97344572538566
        });
    });

    it('should recalculate dash offset when diameter, stroke width or value changes', () => {
        const builder = new SlProgressSpinnerConfigBuilder({ diameter: 16, strokeWidth: 1, min: 0.1, max: 0.4 });

        expect(builder.build()).toHaveProperty('_dashOffset', 47.12388980384689);
        expect(builder.setDiameter(24).build()).toHaveProperty('_dashOffset', 72.25663103256524);
        expect(builder.setStrokeWidth(3).build()).toHaveProperty('_dashOffset', 65.97344572538566);
        expect(builder.setValue(50).build()).toHaveProperty('_dashOffset', 32.98672286269283);
    });
});
