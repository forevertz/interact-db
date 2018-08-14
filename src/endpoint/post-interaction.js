const { json } = require('micro')

const { db } = require('../util/neo4j')
const { FormError, isString } = require('../util/validator')

function validateParams({ userId, toUserId, toContentId, type, ...params }) {
  if (!userId || !isString(userId)) {
    throw new FormError('Parameter `userId` is required and should be a string')
  }
  if (!type || !isString(type)) {
    throw new FormError('Parameter `type` is required and should be a string')
  }
  if (!toUserId && !toContentId) {
    throw new FormError('Parameters `toUserId` or `toContentId` are required')
  } else if (toUserId && toContentId) {
    throw new FormError('Parameters `toUserId` and `toContentId` cannot be used together')
  } else if (toUserId && !isString(toUserId)) {
    throw new FormError('Parameter `toUserId` should be a string')
  } else if (toContentId && !isString(toContentId)) {
    throw new FormError('Parameter `toContentId` should be a string')
  }
}

module.exports = async req => {
  try {
    const { userId, toUserId, toContentId, type, ...params } = await json(req, { encoding: 'utf8' })
    validateParams({ userId, toUserId, toContentId, type, ...params })
    const commands = [
      'MATCH (user:User { id: $userId })',
      toUserId ? 'MATCH (to:User { id: $toUserId })' : 'MATCH (to:Content { id: $toContentId })',
      `CREATE (user)-[interaction:${type.toUpperCase()} { created: timestamp() }]->(to)`,
      'SET interaction += $params'
    ]
    await db.run(commands.join(' '), { userId, toUserId, params })
    return { success: true }
  } catch (error) {
    return { success: false, error: `[${error.code}] ${error.message}` }
  }
}
