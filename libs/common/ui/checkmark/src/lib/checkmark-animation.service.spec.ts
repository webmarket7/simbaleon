import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CheckmarkAnimationService } from './checkmark-animation.service';
import { AnimationFactory, AnimationKeyframesSequenceMetadata } from '@angular/animations';


describe('CheckmarkAnimationService', () => {
    let service: CheckmarkAnimationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule]
        });
        service = TestBed.inject(CheckmarkAnimationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create checkmark animation factory', () => {
        const factory = service.checkmark(16, '1s linear');

        expect(factory).toBeInstanceOf(AnimationFactory);
    });

    it('should create correct checkmark animation metadata', () => {
        const timings = '1s linear';
        const animationMetaData = CheckmarkAnimationService.getCheckmarkAnimationSteps(16, timings);
        const animate = animationMetaData[0];
        const steps = (animate.styles as AnimationKeyframesSequenceMetadata).steps;

        expect(animationMetaData).toBeInstanceOf(Array);
        expect(animate.timings).toBe(timings);
        expect(steps[0].styles).toEqual({ 'stroke-dashoffset': '-16' });
        expect(steps[1].styles).toEqual({ 'stroke-dashoffset': '0' });
    });
});
