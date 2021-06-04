import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createStudent, deleteStudent, getStudents, patchStudent } from '../api/students-api'
import Auth from '../auth/Auth'
import { Student } from '../types/Student'

interface StudentsProps {
  auth: Auth
  history: History
}

interface StudentsState {
  students: Student[]
  newStudentName: string
  loadingStudents: boolean
}

export class Students extends React.PureComponent<StudentsProps, StudentsState> {
  state: StudentsState = {
    students: [],
    newStudentName: '',
    loadingStudents: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newStudentName: event.target.value })
  }

  onEditButtonClick = (studentId: string) => {
    this.props.history.push(`/students/${studentId}/edit`)
  }

  onStudentCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newStudent = await createStudent(this.props.auth.getIdToken(), {
        name: this.state.newStudentName,
        dueDate
      })
      this.setState({
        students: [...this.state.students, newStudent],
        newStudentName: ''
      })
    } catch {
      alert('Student creation failed')
    }
  }

  onStudentDelete = async (studentId: string) => {
    try {
      await deleteStudent(this.props.auth.getIdToken(), studentId)
      this.setState({
        students: this.state.students.filter(student => student.studentId != studentId)
      })
    } catch {
      alert('Student deletion failed')
    }
  }

  onStudentCheck = async (pos: number) => {
    try {
      const student = this.state.students[pos]
      await patchStudent(this.props.auth.getIdToken(), student.studentId, {
        name: student.name,
        dueDate: student.dueDate,
        done: !student.done
      })
      this.setState({
        students: update(this.state.students, {
          [pos]: { done: { $set: !student.done } }
        })
      })
    } catch {
      alert('Student deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const students = await getStudents(this.props.auth.getIdToken())
      this.setState({
        students,
        loadingStudents: false
      })
    } catch (e) {
      alert(`Failed to fetch students: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">STUDENTS</Header>

        {this.renderCreateStudentInput()}

        {this.renderStudents()}
      </div>
    )
  }

  renderCreateStudentInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Student Name',
              onClick: this.onStudentCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Enter Student Name"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderStudents() {
    if (this.state.loadingStudents) {
      return this.renderLoading()
    }

    return this.renderStudentsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading School Students
        </Loader>
      </Grid.Row>
    )
  }

  renderStudentsList() {
    return (
      <Grid padded>
        {this.state.students.map((student, pos) => {
          return (
            <Grid.Row key={student.studentId}>
              <Grid.Column width={10} verticalAlign="middle">
                {student.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {student.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(student.studentId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onStudentDelete(student.studentId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {student.attachmentUrl && (
                <Image src={student.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
