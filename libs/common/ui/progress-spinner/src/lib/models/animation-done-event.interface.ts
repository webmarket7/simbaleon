import { SlProgressSpinnerMode } from '../progress-spinner-mode';

export interface SlProgressSpinnerAnimationDoneEvent {
    mode: SlProgressSpinnerMode;
    value?: number;
}
