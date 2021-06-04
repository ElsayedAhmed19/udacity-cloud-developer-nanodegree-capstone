import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getStudents } from '../../businessLogic/students'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getStudents')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Get all students', { event })
  const userId = getUserId(event)
  const items = await getStudents(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}