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
  email: isRequired("email"),
  password: isRequired("password")
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;
  const { closeModal } = rootStore.modalStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) => login(values).catch(error => ({
        [FORM_ERROR]: error
      }))}
      validate={validate}
      render={({handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit}) => (
        <Form onSubmit={handleSubmit} error >
          <Header as="h2" content="Logg inn" textAlign="center" />
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field name="password" component={TextInput} placeholder="Password" type="password" />
          {submitError && !dirtySinceLastSubmit ? <ErrorMessage error={submitError} text="Invalid email or password" /> : null}
          <Button disabled={(invalid && !dirtySinceLastSubmit) || pristine} loading={submitting} color="blue" content="Logg inn" />
          <Button onClick={() => closeModal()} color="grey" content="Avbryt" />
        </Form>
      )}      
    />
  )
}

export default LoginForm
