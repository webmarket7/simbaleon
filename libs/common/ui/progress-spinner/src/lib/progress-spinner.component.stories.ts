import { text, number, boolean } from '@storybook/addon-knobs';
import { SlProgressSpinnerComponent } from './progress-spinner.component';

export default {
  title: 'SlProgressSpinnerComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: SlProgressSpinnerComponent,
  props: {
    options: text('options', ),
    diameter: number('diameter', 0),
    mode: text('mode', ),
    strokeWidth: number('strokeWidth', 0),
    stroke: text('stroke', ''),
    indeterminateTiming: text('indeterminateTiming', ''),
    determinateTiming: text('determinateTiming', ''),
    value: text('value', ''),
    playOnInit: boolean('playOnInit', false),
  }
})
