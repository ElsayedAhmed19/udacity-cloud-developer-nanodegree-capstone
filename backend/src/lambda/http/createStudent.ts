import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateStudentRequest } from '../../requests/CreateStudentRequest'
import { createStudent } from '../../businessLogic/students'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
const logger = createLogger('students')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('create new student event: ', { event })

  const newStudent: CreateStudentRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const newItem = await createStudent(userId, newStudent)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
