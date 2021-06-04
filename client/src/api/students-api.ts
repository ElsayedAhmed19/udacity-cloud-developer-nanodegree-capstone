import { apiEndpoint } from '../config'
import { Student } from '../types/Student';
import { CreateStudentRequest } from '../types/CreateStudentRequest';
import Axios from 'axios'
import { UpdateStudentRequest } from '../types/UpdateStudentRequest';

export async function getStudents(idToken: string): Promise<Student[]> {
  console.log('Fetching students')

  const response = await Axios.get(`${apiEndpoint}/students`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Students:', response.data)
  return response.data.items
}

export async function createStudent(
  idToken: string,
  newStudent: CreateStudentRequest
): Promise<Student> {
  const response = await Axios.post(`${apiEndpoint}/students`,  JSON.stringify(newStudent), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchStudent(
  idToken: string,
  studentId: string,
  updatedStudent: UpdateStudentRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/students/${studentId}`, JSON.stringify(updatedStudent), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteStudent(
  idToken: string,
  studentId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/students/${studentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  studentId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/students/${studentId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
