export enum SlActionTrackerStates {
    Idle,
    Playing,
    Finishing
}

export type SlActionTrackerState = SlActionTrackerStates.Idle
    | SlActionTrackerStates.Playing
    | SlActionTrackerStates.Finishing;
