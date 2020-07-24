import { SlSpinnerSvgBuilder } from './spinner-svg-builder';
import { SlSpinnerConfig } from '@simbaleon/common/ui/spinner';

describe('SlSpinnerSvgBuilder', () => {
    const config = new SlSpinnerConfig({
        circleDiameter: 18,
        circleStrokeWidth: 2,
        circleStrokeMinFracture: 0,
        circleStrokeMaxFracture: 0.5,
        withCheckmark: true,
        checkmarkDistance: 0.15,
    });
    const circumference = 50.26548245743669;
    const dashArray = {
        min: 0,
        max: 25.132741228718345,
        full: circumference
    };
    const checkmarkPoints = '12.464823227814083 5.535176772185917, 8.307035354437183 12.464823227814083, 5.535176772185917 9.692964645562817';

    it('should calculate radius based on circle diameter', () => {
        expect(SlSpinnerSvgBuilder.calculateRadius(config.circleDiameter)).toEqual(9);
    });

    it('should calculate svg circle path radius based on circle diameter and stroke width', () => {
        expect(SlSpinnerSvgBuilder.calculateSvgCircleRadius(config.circleDiameter, config.circleStrokeWidth)).toEqual(8);
    });

    it('should calculate circumference of circle', () => {
        expect(SlSpinnerSvgBuilder.calculateCircumference(config.circleDiameter, config.circleStrokeWidth)).toEqual(circumference);
    });

    it('should calculate dash array of circle from circumference and user settings of min and max fractures', () => {
        expect(SlSpinnerSvgBuilder.calculateCircleDashArray(circumference, config.circleStrokeMinFracture, config.circleStrokeMaxFracture)).toEqual(dashArray);
    });

    it('should calculate checkmark svg polyline points', () => {
        expect(SlSpinnerSvgBuilder.calculateCheckmarkPoints(config.circleDiameter, config.circleStrokeWidth, config.checkmarkDistance))
            .toEqual(checkmarkPoints);
    });

    it('should build spinner svg options from spinner config', () => {
        expect(SlSpinnerSvgBuilder.build(config)).toEqual({
            center: 9,
            radius: 8,
            circleStrokeCircumference: circumference,
            circleDashArray: dashArray,
            checkmarkPoints: checkmarkPoints
        });
        expect(SlSpinnerSvgBuilder.build({...config, withCheckmark: false})).toEqual({
            center: 9,
            radius: 8,
            circleStrokeCircumference: circumference,
            circleDashArray: dashArray,
        })
    });
});
