import { InjectionToken } from '@angular/core';

export interface SlCheckmarkOptions {
    playOnInit: boolean;
    containerSize: number;
    stroke: string;
    strokeWidth: number;
    timing: string;
}

export const SL_CHECKMARK_DEFAULT_OPTIONS = new InjectionToken<SlCheckmarkOptions>('SL_CHECKMARK_DEFAULT_OPTIONS');

