import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import { StudentItem } from '../models/StudentItem'
import { StudentUpdate } from '../models/StudentUpdate'
import { createLogger } from '../utils/logger'
const logger = createLogger('dataAccessLAyer')


const XAWS = AWSXRay.captureAWS(AWS)
export class DataAccessLayer {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly studentsTable = process.env.STUDENTS_TABLE,
    private readonly studentsByUserIndex = process.env.STUDENTS_BY_USER_INDEX
  ) {}

  async studentItemExists(studentId: string): Promise<boolean> {
    return !!await this.getStudentItem(studentId)
  }

  async getStudentItem(studentId: string): Promise<StudentItem> {
    logger.info(`Getting student ${studentId} from ${this.studentsTable}`)

    const result = await this.docClient.get({
      TableName: this.studentsTable,
      Key: {
        studentId
      }
    }).promise()

    const studentItem = result.Item

    return studentItem as StudentItem
  }

  async createStudentItem(studentItem: StudentItem) {
    logger.info(`Creating student ${studentItem.studentId} into ${this.studentsTable}`)

    await this.docClient.put({
      TableName: this.studentsTable,
      Item: studentItem,
    }).promise()
  }

  async getStudentItems(userId: string): Promise<StudentItem[]> {
    logger.info(`Getting all students for user ${userId} from ${this.studentsTable}`)

    const result = await this.docClient.query({
      TableName: this.studentsTable,
      IndexName: this.studentsByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const studentItems = result.Items

    logger.info(`Getting ${studentItems.length} students for user ${userId} in ${this.studentsTable}`)

    return studentItems as StudentItem[]
  }

  async deleteStudentItem(studentId: string) {
    logger.info(`Deleting student ${studentId} from ${this.studentsTable}`)

    await this.docClient.delete({
      TableName: this.studentsTable,
      Key: {
        studentId
      }
    }).promise()
  }

  async updateStudentItem(studentId: string, studentUpdate: StudentUpdate) {
    logger.info(`Updating student item ${studentId} in ${this.studentsTable}`)

    await this.docClient.update({
      TableName: this.studentsTable,
      Key: {
        studentId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": studentUpdate.name,
        ":dueDate": studentUpdate.dueDate,
        ":done": studentUpdate.done
      }
    }).promise()
  }

  async updateAttachmentUrl(studentId: string, attachmentUrl: string) {
    logger.info(`Updating URL for a student ${studentId} in ${this.studentsTable}`)

    await this.docClient.update({
      TableName: this.studentsTable,
      Key: {
        studentId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }
}