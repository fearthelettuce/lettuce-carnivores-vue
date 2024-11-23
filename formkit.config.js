import { generateClasses } from '@formkit/themes'
import { createAutoHeightTextareaPlugin } from '@formkit/addons'

const config = {
  plugins: [createAutoHeightTextareaPlugin()],
  config: {
    classes: generateClasses({
      global: {
        outer: '$reset',
        input: 'form-control',
        label: 'form-label',
        help: 'form-text',
      },

      checkbox: {
        outer: 'form-check',
        label: 'form-check-label',
        input: '$reset form-check-input',
      },
      submit: {
        outer: '$reset mt-3',
        input: '$reset btn btn-primary',
      },
    }),
  },
}

export default config
