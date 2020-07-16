import React, { useContext } from 'react'
import {Form as FinalForm, Field} from "react-final-form"
import { FORM_ERROR } from 'final-form';
import { Form, Button, Header } from 'semantic-ui-react'
import TextInput from 'Components/Forms/FormElements/TextInput'
import { RootStoreContext } from 'Stores/rootStore'
import { IUserFormValues } from 'Models/user'
import { combineValidators, isRequired } from 'revalidate';
import ErrorMessage from 'Components/Forms/FormElements/ErrorMessage';

const validate = combineValidators({
  username: isRequired("username"),
  email: isRequired("email"),
  firstName: isRequired("firstName"),
  lastName: isRequired("lastName"),
  role: isRequired("role"),
  password: isRequired("password")
});

const styleRadio = {
  paddingLeft: "5px",
  paddingRight: "15px",
};

const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { register } = rootStore.userStore;
  const { closeModal } = rootStore.modalStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) => register(values).catch(error => ({
        [FORM_ERROR]: error
      }))}
      validate={validate}
      render={({handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit}) => (
        <Form onSubmit={handleSubmit} error >
          <Header as="h2" content="Registrer ny bruker" textAlign="center" />
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field name="username" component={TextInput} placeholder="Username" />
          <Field name="firstName" component={TextInput} placeholder="Fornavn" />
          <Field name="lastName" component={TextInput} placeholder="Etternavn" />
          <Field name="password" component={TextInput} placeholder="Password" type="password" />

          <Header as="h4" content="Brukertype" textAlign="left" />
          <Field name="role" component="input" type="radio" value="1" id="student"/>
          <label htmlFor="student" style={styleRadio} >Student</label>
          <Field name="role" component="input" type="radio" value="2" id="company" />
          <label htmlFor="company" style={styleRadio} >Bedrift</label>

          <br/><br/>
          {submitError && !dirtySinceLastSubmit ? <ErrorMessage error={submitError} /> : null}
          <Button disabled={(invalid && !dirtySinceLastSubmit) || pristine} loading={submitting} color="green" content="Registrer" />
          <Button onClick={() => closeModal()} content="Avbryt" />
        </Form>
      )}      
    />
  )
}

export default RegisterForm
