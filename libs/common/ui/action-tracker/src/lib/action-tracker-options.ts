import { InjectionToken } from '@angular/core';

export interface SlActionTrackerOptions {
    circleDiameter: number;
    circleStrokeWidth: number;
    strokeSuccess: string;
    stroke: string;
    checkmarkStrokeWidth: number;
}

export const SL_ACTION_TRACKER_DEFAULT_OPTIONS = new InjectionToken<SlActionTrackerOptions>('SL_ACTION_TRACKER_DEFAULT_OPTIONS');
