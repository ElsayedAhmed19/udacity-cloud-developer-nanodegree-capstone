import 'source-map-support/register'

import * as uuid from 'uuid'

import { StudentItem } from '../models/StudentItem'
import { StudentUpdate } from '../models/StudentUpdate'
import { UpdateStudentRequest } from '../requests/UpdateStudentRequest'
import { CreateStudentRequest } from '../requests/CreateStudentRequest'
import { DataAccessLayer } from '../dataLayer/DataAccessLayer'
import { Storage } from '../dataLayer/Storage'
import { createLogger } from '../utils/logger'
const dataAccessLayer = new DataAccessLayer()
const storage = new Storage()

const logger = createLogger('students')
export async function getStudents(userId: string): Promise<StudentItem[]> {
  logger.info(`Getting all students for the user has Id ${userId}`)

  return await dataAccessLayer.getStudentItems(userId)
}

export async function createStudent(userId: string, createStudentRequest: CreateStudentRequest): Promise<StudentItem> {
  const studentId = uuid.v4()

  const newItem: StudentItem = {
    userId,
    studentId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    ...createStudentRequest
  }

  logger.info(`Creating a student ${studentId} for user ${userId}`, { studentItem: newItem })

  await dataAccessLayer.createStudentItem(newItem)

  return newItem
}

export async function updateStudent(userId: string, studentItemId: string, updateStudentRequest: UpdateStudentRequest) {
  logger.info(`Updating a student ${studentItemId} for user ${userId}`, { studentUpdate: updateStudentRequest })

  const studentItem = await dataAccessLayer.getStudentItem(studentItemId)

  if (!studentItem)
    throw new Error('Student not found')

  if (studentItem.userId !== userId) {
    logger.error(`User ${userId} is not allowed to update student ${studentItemId}`)
    throw new Error('User is not allowed to update item')
  }

  dataAccessLayer.updateStudentItem(studentItemId, updateStudentRequest as StudentUpdate)
}

export async function deleteStudent(userId: string, studentItemId: string) {
  logger.info(`Deleting a student ${studentItemId} for user ${userId}`, { userId, studentItemId })

  const studentItem = await dataAccessLayer.getStudentItem(studentItemId)

  if (!studentItem)
    throw new Error('Student not found')

  if (studentItem.userId !== userId) {
    logger.error(`User ${userId} is not allowed to delete student ${studentItemId}`)
    throw new Error('User is not allowed to delete item')
  }

  dataAccessLayer.deleteStudentItem(studentItemId)
}

export async function updateAttachmentUrl(userId: string, studentItemId: string, attachmentId: string) {
  logger.info(`Generating attachment URL for attachment ${attachmentId}`)

  const attachmentUrl = await storage.getAttachmentUrl(attachmentId)

  logger.info(`Updating student ${studentItemId} with attachment URL ${attachmentUrl}`, { userId, studentItemId })

  const studentItem = await dataAccessLayer.getStudentItem(studentItemId)

  if (!studentItem)
    throw new Error('Student not found')

  if (studentItem.userId !== userId) {
    logger.error(`User ${userId} is not allowed to update student ${studentItemId}`)
    throw new Error('User is not allowed to update item')
  }

  await dataAccessLayer.updateAttachmentUrl(studentItemId, attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
  logger.info(`Generating upload URL for attachment ${attachmentId}`)

  return await storage.getUploadUrl(attachmentId)
}