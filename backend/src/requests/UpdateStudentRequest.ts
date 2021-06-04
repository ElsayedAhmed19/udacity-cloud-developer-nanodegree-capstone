/**
 * Fields in a request to update a single STUDENT item.
 */
export interface UpdateStudentRequest {
  name: string
  dueDate: string
  done: boolean
}