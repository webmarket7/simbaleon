import { number, text } from '@storybook/addon-knobs';
import { SlActionTrackerComponent } from './action-tracker.component';
import { SlProgressSpinnerModule } from '@simbaleon/common/ui/progress-spinner';
import { SlCheckmarkModule } from '@simbaleon/common/ui/checkmark';

export default {
    title: 'SlActionTrackerComponent'
};

export const primary = () => ({
    moduleMetadata: {
        imports: [
            SlProgressSpinnerModule,
            SlCheckmarkModule
        ]
    },
    component: SlActionTrackerComponent,
    props: {
        circleStrokeWidth: number('circleStrokeWidth', 0),
        stroke: text('stroke', ''),
        strokeSuccess: text('strokeSuccess', ''),
        checkmarkStrokeWidth: number('checkmarkStrokeWidth', 0)
    }
});
