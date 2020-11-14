import { extend } from 'vee-validate'
import { required, between, integer, min_value, max_value } from 'vee-validate/dist/rules'

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

extend('min_value', {
  ...min_value,
  message: 'The minimum amount is {min}'
})

extend('max_value', {
  ...max_value,
  message: 'The maximum amount is {max}'
})
