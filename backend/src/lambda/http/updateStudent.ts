import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { updateStudent } from '../../businessLogic/students'
import { UpdateStudentRequest } from '../../requests/UpdateStudentRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('updateStudent')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Update a student', { event })
  const studentId = event.pathParameters.studentId
  const userId = getUserId(event)
  const updatedStudent: UpdateStudentRequest = JSON.parse(event.body)

  await updateStudent(userId, studentId, updatedStudent)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}