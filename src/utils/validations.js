import { extend } from 'vee-validate'
import { required, between, integer } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: '{_field_} is required'
})

extend('between', {
  ...between,
  message: '{_field_} must be between {min} and {max}'
})

extend('integer', {
  ...integer,
  message: '{_field_} must be a number'
})
