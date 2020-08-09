import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AnimationFactory, AnimationKeyframesSequenceMetadata, AnimationStyleMetadata } from '@angular/animations';

import { ProgressSpinnerAnimationsService } from './progress-spinner-animations.service';
import { MockAnimationDriver } from '@angular/animations/browser/testing';


describe('ProgressSpinnerAnimationsService', () => {
    let service: ProgressSpinnerAnimationsService;
    let driver: MockAnimationDriver;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule]
        });
        service = TestBed.inject(ProgressSpinnerAnimationsService);
        driver = new MockAnimationDriver();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create indeterminate spinner animation factory', () => {
        const factory = service.indeterminate(0, 50, 100, '1s linear');

        expect(factory).toBeInstanceOf(AnimationFactory);
    });

    it('should create correct indeterminate animation metadata', () => {
        const timings = '1s linear';
        const animationMetaData = ProgressSpinnerAnimationsService.getIndeterminateAnimationSteps(0, 50, 100, timings);
        const animate = animationMetaData[0];
        const steps = (animate.styles as AnimationKeyframesSequenceMetadata).steps;

        expect(animationMetaData).toBeInstanceOf(Array);
        expect(animate.timings).toBe(timings);
        expect(steps[0].styles).toEqual({
            transform: 'rotate(0)',
            'stroke-dasharray': '0 100'
        });
        expect(steps[1].styles).toEqual({
            transform: 'rotate(180deg)',
            'stroke-dasharray': '50 50'
        });
        expect(steps[2].styles).toEqual({
            transform: 'rotate(720deg)',
            'stroke-dasharray': '0 100'
        });
    });

    it('should create determinate spinner animation factory', () => {
        const factory = service.determinate(50, '1s linear');

        expect(factory).toBeInstanceOf(AnimationFactory);
    });

    it('should create correct determinate animation metadata', () => {
        const timings = '1s linear';
        const animationMetaData = ProgressSpinnerAnimationsService.getDeterminateAnimationSteps(0, timings);
        const animate = animationMetaData[0];

        expect(animationMetaData).toBeInstanceOf(Array);
        expect(animate.timings).toBe(timings);
        expect((animate.styles as AnimationStyleMetadata).styles).toEqual({
            'stroke-dashoffset': '0'
        });
    });
});
