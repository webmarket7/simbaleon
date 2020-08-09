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
export class CheckmarkAnimationService {

    constructor(private _animationBuilder: AnimationBuilder) {
    }

    static getCheckmarkAnimationSteps(dashArray: number, timing: string): AnimationAnimateMetadata[] {
        return [
            animate(timing, keyframes([
                style({
                    'stroke-dashoffset': `-${dashArray}`
                }),
                style({
                    'stroke-dashoffset': '0'
                })
            ]))
        ]
    }

    @Memoize()
    checkmark(dashArray: number, timing: string): AnimationFactory {
        return this._animationBuilder.build(CheckmarkAnimationService.getCheckmarkAnimationSteps(dashArray, timing));
    }
}
