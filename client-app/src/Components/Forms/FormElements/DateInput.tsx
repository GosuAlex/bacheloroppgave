import React, { useState } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';


interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps {
  id: any;
}

const DateInput: React.FC<IProps> = ({setPickedDate, pickedDate, input, width, placeholder, meta: {touched, error: ferror},
  //type, label, required, inline, id, error, content, disabled, control, children, className, as, 
   id, date=false, time=false, ...rest}) => {

  return (
    <Form.Field error={touched && !!ferror} width={width} >
      <DatePicker
        todayButton="I dag"
        selected={pickedDate}
        onChange={date => setPickedDate(date)}
        // onChangeRaw={}
        showTimeSelect
        timeIntervals={60}
        timeCaption="Klokkeslett"
        timeFormat="HH:mm"
        dateFormat="d MMMM, h:mm aa"
      />
      {touched && ferror && (
        <Label basic color="red" >
          {ferror}
        </Label>
      )}
    </Form.Field>
  )
}

export default DateInput