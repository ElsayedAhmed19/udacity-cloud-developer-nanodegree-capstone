import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as uuid from 'uuid'
import { generateUploadUrl, updateAttachmentUrl } from '../../businessLogic/students'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Generate upload url ', { event })

  const userId = getUserId(event)
  const studentId = event.pathParameters.studentId
  const attachmentId = uuid.v4()
  const uploadUrl = await generateUploadUrl(attachmentId)

  await updateAttachmentUrl(userId, studentId, attachmentId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}