import { SlProgressSpinnerMode } from '../progress-spinner-mode';
import { SlProgressSpinnerDasharray } from './dasharray.interface';


export interface SlProgressSpinnerConfig {
    mode: SlProgressSpinnerMode;
    playOnInit: boolean;
    value: number;
    diameter: number;
    stroke: string;
    strokeWidth: number;
    min: number;
    max: number;
    indeterminateTiming: string;
    determinateTiming: string;
    _radius: number;
    _strokeCircumference: number;
    _dashArray: SlProgressSpinnerDasharray;
    _dashOffset: number;
}
