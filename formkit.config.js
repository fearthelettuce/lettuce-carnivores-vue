import { generateClasses } from '@formkit/themes'
import { createAutoHeightTextareaPlugin } from '@formkit/addons'

const config = {
  plugins: [
    createAutoHeightTextareaPlugin(),
  ],
  config: {
    classes: generateClasses({
      global: {
        outer: '$reset',
        input: 'form-control',
        label: 'form-label',
        help: 'form-text'
      },
      form: {
        form: "col-md-4 col-lg-3 mt-5 mx-auto p-5 border rounded"
      },
      checkbox: {
        outer: 'form-check',
        label: 'form-check-label',
        input: '$reset form-check-input',
      },
      submit: {
        outer: '$reset mt-3',
        input: '$reset btn btn-primary'
      },
    })
  },

}

export default config