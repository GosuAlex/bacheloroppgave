import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'

// changed from HTMLInputElement to make it work with newer version of FinalForm
/*
https://github.com/final-form/react-final-form/issues/687
When you get to the DateInput there is another error, that downgrading didn't solve.

The expected type comes from property 'component' which is declared here on type 'IntrinsicAttributes & FieldProps<string, HTMLInputElement>'

I can change
extends FieldRenderProps<Date, HTMLInputElement>,

back to string, but that removes all the date stuff that it had going on.
*/
interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {

}

const TextInput: React.FC<IProps> = ({input, width, type, placeholder, meta: {touched, error}}) => {
  return (
    <Form.Field error={touched && !!error} type={type} width={width} >
      <input {...input} placeholder={placeholder} />
      {touched && error && (
        <Label basic color="red" >
          {error}
        </Label>
      )}
    </Form.Field>
  )
}

export default TextInput
