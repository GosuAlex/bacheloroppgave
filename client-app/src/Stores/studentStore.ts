import {observable, action} from 'mobx';
import { createContext } from 'react';
import { IStudent } from 'Models/students';
import agent from 'Api/agent';

class StudentStore {
    @action createStudent = async (student: IStudent) => {
        try {
            await agent.Students.create(student);
        } catch (error) {
            console.log(error);
        }
    }
}

export default createContext(new StudentStore())
//Creates new instance of StudentStore