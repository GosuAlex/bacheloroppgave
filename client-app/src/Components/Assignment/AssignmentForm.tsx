import React, { useContext, useState, useEffect } from 'react'
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';
import { RootStoreContext } from 'Stores/rootStore';
import { RouteComponentProps } from 'react-router-dom';
import { IAssignmentFormValues } from 'Models/assignments';
import { v4 as uuid } from "uuid";
import { Grid, Segment, Form, Button, Label, Item } from 'semantic-ui-react';
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from 'Components/Forms/FormElements/TextInput';
import TextAreaInput from 'Components/Forms/FormElements/TextAreaInput';
import SelectInput from 'Components/Forms/FormElements/SelectInput';
import DateInput from 'Components/Forms/FormElements/DateInput';
import { category } from 'Components/Forms/FormElements/categoryOptions';

const validation = combineValidators({
  title: isRequired({message: "Oppgavetittel kreves"}),
  categoryId: isRequired("CategoryId"),
  description: composeValidators(
    isRequired("Description"),
    hasLengthGreaterThan(4)({message: "Description needs to be at least 5 characters"})
  )(),
  // deadline: isRequired("Deadline"),
});

interface DetailsParams {
  id: string;
}

const assignmentInit: IAssignmentFormValues = {
  id: undefined,
  companyId: "",
  companyName: "",
  title: "",
  description: "",
  categoryId: "",
  timePosted: undefined,
  deadline: undefined,
  status: "",
  creator: null
}

const AssignmentForm: React.FC<RouteComponentProps<DetailsParams>> = ({match, history}) => {
  const rootStore = useContext(RootStoreContext);
  const { /*listCategories,*/ loadAssignment, createAssignment, editAssignment, submitting } = rootStore.assignmentStore;
  const { user, userCompany, getUserCompany } = rootStore.userStore;

  const [assignment, setAssignment] = useState(assignmentInit);
  const [company, setCompany] = useState(userCompany);
  const [loading, setLoading] = useState(false); 
  const [pickedDate, setPickedDate] = useState(new Date())

  useEffect(() => {
    getUserCompany(user!.id)
      .then((userCompany) => setCompany(userCompany));

    if(match.params.id) {
      setLoading(true);
      loadAssignment(match.params.id)
        .then((assignment) => {
          setPickedDate(new Date(Date.parse(assignment.deadline)));
          setAssignment(assignment)
        })
        .finally(() => setLoading(false));
    }
  }, [loadAssignment, match.params.id, getUserCompany, user]);

  const handleFinalFormSubmit = (values: any) => {
    const {...assignment}: IAssignmentFormValues = values;   
    assignment.companyId = userCompany?.id;
    assignment.companyName = userCompany?.name;
    assignment.creator = user;
    assignment.status = 2;

    assignment.deadline = pickedDate;
    assignment.timePosted= new Date();
    
    if (!assignment.id) {
      assignment.id = uuid();
      createAssignment(assignment);
    } else {
      editAssignment(assignment);
    }
    console.log(assignment);
  }


  return (
    <Grid style={{marginTop: "0px"}}>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validation}
            initialValues={assignment}
            onSubmit={handleFinalFormSubmit}
            render={({handleSubmit, invalid, pristine}) => (
              <Form onSubmit={handleSubmit} loading={loading} >
                {userCompany && 
                  <span style={{fontSize: "1.5em"}}>{userCompany?.name}</span>
                }
                <Field name="title" placeholder="Oppgavetittel" value={assignment.title} component={TextInput} />
                <Field name="description" rows={5} placeholder="Oppgave beskrivelse" value={assignment.description} component={TextAreaInput} />
                <Field name="categoryId" placeholder="Kategori" value={assignment.categoryId} component={SelectInput} options={category} />
                <Form.Group widths="equal">
                  <Field name="deadline" pickedDate={pickedDate} setPickedDate={setPickedDate} value={assignment.deadline} component={DateInput} />
                </Form.Group>
                <Button loading={submitting} disabled={loading || invalid || pristine} floated="right" positive type="submit" content="Opprett oppdrag" />
                <Button onClick={() => history.goBack()} disabled={loading} floated="right" type="button" content="Avbryt" />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default AssignmentForm
