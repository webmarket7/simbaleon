import { SlSpinnerConfig } from './spinner-config';

export interface SpinnerCircleDashArray {
    min: number;
    max: number;
    full: number;
}

export interface SlSpinnerSvgOptions {
    center: number;
    radius: number;
    circleStrokeCircumference: number;
    circleDashArray: SpinnerCircleDashArray;
    checkmarkPoints?: string;
}

export class SlSpinnerSvgBuilder {

    /*
     * Converts degrees to radians using formula: radians = degrees * (π/180).
     * @param {number} diameter - The circle diameter.
     */
    static convertDegreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /*
     * Calculates radius of regular circle using formula: R = D / 2.
     * @param {number} diameter - The circle diameter.
     */
    static calculateRadius(diameter: number): number {
        return diameter / 2;
    }

    /*
     * To calculate svg circle radius we should subtract stroke width before dividing diameter.
     * This is because in svg radius gets computed from center of stroke. This means, that to fit circle with
     * stroke width of 2px into 18px x 18px square container the circle radius should be 8px.
     * @param {number} diameter - The circle diameter.
     * @param {number} strokeWidth - The circle stroke width.
     */
    static calculateSvgCircleRadius(diameter: number, strokeWidth: number): number {
        return SlSpinnerSvgBuilder.calculateRadius(diameter - strokeWidth);
    }

    /*
     * Calculates circle circumference using formula: C = 2πR.
     * @param {number} diameter - The circle diameter.
     * @param {number} strokeWidth - The circle stroke width.
     */
    static calculateCircumference(diameter: number, strokeWidth: number): number {
        return 2 * Math.PI * SlSpinnerSvgBuilder.calculateSvgCircleRadius(diameter, strokeWidth);
    }

    /*
     * Calculates dash array for spinning animation, which is a set of circle circumference fractures:
     * minimal possible fracture, maximal possible fracture and full circumference.
     * @param {number} circumference - The circle circumference.
     * @param {number} min - The minimal possible fracture of circumference as decimal from 0 to 1.
     * @param {number} max - The maximal possible fracture of circumference as decimal from 0 to 1.
     */
    static calculateCircleDashArray(circumference: number, min: number, max: number): SpinnerCircleDashArray {
        return {
            min: circumference * min,
            max: circumference * max,
            full: circumference
        };
    }

    /*
     * Calculates svg polyline points to form a checkmark of right size centered inside the circle.
     * @param {number} diameter - The circle diameter.
     * @param {number} strokeWidth - The circle stroke width.
     * @param {number} distance - Fracture of inner circle diameter (decimal from 0 to 1), which determines how far checkmark container
     *                            should be from circle inner edge. This value may have an influence both on position
     *                            and size of the checkmark.
     */
    static calculateCheckmarkPoints(diameter: number, strokeWidth: number, distance: number): string {
        const innerDiameter = diameter - strokeWidth * 2;
        const inscribedSquareSide = innerDiameter / Math.sqrt(2);
        const inscribedSquareOffset = (diameter - inscribedSquareSide) / 2;
        const checkmarkContainerOffset = inscribedSquareOffset + (innerDiameter * distance * Math.sin(SlSpinnerSvgBuilder.convertDegreesToRadians(45)));
        const checkmarkContainerSide = diameter - (checkmarkContainerOffset * 2);
        const topLeftPoint = { x: checkmarkContainerOffset, y: checkmarkContainerOffset };

        return `${topLeftPoint.x + checkmarkContainerSide} ${topLeftPoint.y}, ${topLeftPoint.x + (checkmarkContainerSide * 0.4)} ${topLeftPoint.y + checkmarkContainerSide}, ${topLeftPoint.x} ${topLeftPoint.x + checkmarkContainerSide * 0.6}`;
    }

    /*
     * Builds an object with svg options calculated from spinner config object.
     * @param {SlSpinnerSvgOptions} config - The spinner config.
     */
    static build(config: SlSpinnerConfig): SlSpinnerSvgOptions {
        const { circleDiameter, circleStrokeWidth, circleStrokeMinFracture, circleStrokeMaxFracture, withCheckmark, checkmarkDistance } = config;
        const circleStrokeCircumference = SlSpinnerSvgBuilder.calculateCircumference(config.circleDiameter, config.circleStrokeWidth);

        return {
            center: SlSpinnerSvgBuilder.calculateRadius(circleDiameter),
            radius: SlSpinnerSvgBuilder.calculateSvgCircleRadius(circleDiameter, circleStrokeWidth),
            circleStrokeCircumference,
            circleDashArray: SlSpinnerSvgBuilder.calculateCircleDashArray(circleStrokeCircumference, circleStrokeMinFracture, circleStrokeMaxFracture),
            ...(withCheckmark && { checkmarkPoints: SlSpinnerSvgBuilder.calculateCheckmarkPoints(circleDiameter, circleStrokeWidth, checkmarkDistance) })
        };
    }
}
