import { InjectionToken } from '@angular/core';
import { SlProgressSpinnerMode } from './progress-spinner-mode';

export interface SlProgressSpinnerOptions {
    mode: SlProgressSpinnerMode;
    diameter: number;
    stroke: string;
    strokeWidth: number;
    min: number;
    max: number;
    indeterminateTiming: string;
    determinateTiming: string;
    value: number;
    playOnInit: boolean;
}

export const SL_PROGRESS_SPINNER_DEFAULT_OPTIONS = new InjectionToken<SlProgressSpinnerOptions>('SL_PROGRESS_SPINNER_DEFAULT_OPTIONS');
