export class SlSpinnerConfig {
    circleDiameter: number;
    circleStroke: string;
    circleStrokeSuccess: string;
    circleStrokeWidth: number;
    circleStrokeMinFracture: number;
    circleStrokeMaxFracture: number;
    spinningTiming: number;

    withCheckmark: boolean;
    checkmarkStrokeWidth: number;
    checkmarkStroke: string;
    checkmarkDistance: number;
    checkmarkTiming: number;

    constructor({
                    circleDiameter,
                    circleStroke,
                    circleStrokeSuccess,
                    circleStrokeWidth,
                    circleStrokeMinFracture,
                    circleStrokeMaxFracture,
                    spinningTiming,
                    withCheckmark,
                    checkmarkStrokeWidth,
                    checkmarkStroke,
                    checkmarkDistance,
                    checkmarkTiming
                }: {
        circleDiameter?: number,
        circleStroke?: string,
        circleStrokeSuccess?: string,
        circleStrokeWidth?: number,
        circleStrokeMinFracture?: number,
        circleStrokeMaxFracture?: number,
        spinningTiming?: number,
        withCheckmark?: boolean,
        checkmarkStrokeWidth?: number,
        checkmarkStroke?: string,
        checkmarkDistance?: number,
        checkmarkTiming?: number,
    } = {}) {
        this.circleDiameter = circleDiameter || 18;
        this.circleStroke = circleStroke || '#7DB0D5';
        this.circleStrokeSuccess = circleStrokeSuccess || 'green';
        this.circleStrokeWidth = circleStrokeWidth || 2;
        this.circleStrokeMinFracture = circleStrokeMinFracture || 0;
        this.circleStrokeMaxFracture = circleStrokeMaxFracture || 0.5;
        this.spinningTiming = spinningTiming || 2;

        this.withCheckmark = withCheckmark || false;
        this.checkmarkStrokeWidth = checkmarkStrokeWidth || 3;
        this.checkmarkStroke = checkmarkStroke || 'green';
        this.checkmarkDistance = checkmarkDistance || 0.15;
        this.checkmarkTiming = checkmarkTiming || 0.6;
    }
}
