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
  name: isRequired("name"),
  description: isRequired("description")
});

const CompanyForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { createUserCompany, user } = rootStore.userStore;
  const { closeModal } = rootStore.modalStore;

  return (
    <FinalForm
      onSubmit={(values: any) => createUserCompany(values, user).catch(error => ({
        [FORM_ERROR]: error
      }))}
      validate={validate}
      render={({handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit}) => (
        <Form onSubmit={handleSubmit} error >
          <Header as="h2" content="Sett inn bedrift info" color="teal" textAlign="center" />
          <Field name="name" component={TextInput} placeholder="Navn" />
          <Field name="description" component={TextInput} placeholder="Beskrivelse" />
          {submitError && !dirtySinceLastSubmit ? <ErrorMessage error={submitError} /> : null}
          <Button disabled={(invalid && !dirtySinceLastSubmit) || pristine} loading={submitting} color="blue" content="Registrer bedrift" />
          <Button onClick={() => closeModal()} color="grey" content="Avbryt" />
        </Form>
      )}      
    />
  )
}

export default CompanyForm
