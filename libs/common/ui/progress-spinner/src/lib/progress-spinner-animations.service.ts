import { Injectable } from '@angular/core';
import {
    animate,
    AnimationAnimateMetadata,
    AnimationBuilder,
    AnimationFactory,
    keyframes,
    style
} from '@angular/animations';
import { Memoize } from '@simbaleon/common/util/optimizations';

@Injectable({
    providedIn: 'root'
})
export class ProgressSpinnerAnimationsService {

    constructor(private _animationBuilder: AnimationBuilder) {
    }

    @Memoize()
    static getIndeterminateAnimationSteps(min: number, max: number, full: number, timing: string): AnimationAnimateMetadata[] {
        return [
            animate(timing, keyframes([
                style({
                    transform: 'rotate(0)',
                    'stroke-dasharray': `${min} ${full}`
                }),
                style({
                    transform: 'rotate(180deg)',
                    'stroke-dasharray': `${max} ${max}`
                }),
                style({
                    transform: 'rotate(720deg)',
                    'stroke-dasharray': `${min} ${full}`
                })
            ]))
        ];
    }

    @Memoize()
    static getDeterminateAnimationSteps(finish: number, timing: string): AnimationAnimateMetadata[] {
        return [
            animate(timing, style({
                'stroke-dashoffset': `${finish}`
            }))
        ];
    }

    indeterminate(min: number, max: number, full: number, timing: string): AnimationFactory {
        return this._animationBuilder.build(ProgressSpinnerAnimationsService.getIndeterminateAnimationSteps(min, max, full, timing));
    }

    determinate(finish: number, timing: string): AnimationFactory {
        return this._animationBuilder.build(ProgressSpinnerAnimationsService.getDeterminateAnimationSteps(finish, timing));
    }
}
