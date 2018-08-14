const { json } = require('micro')

const { capitalize } = require('../util')
const { db } = require('../util/neo4j')
const { FormError, isString } = require('../util/validator')

function validateParams({ userId, id, type, action, ...params }) {
  if (!userId || !isString(userId)) {
    throw new FormError('Parameter `userId` is required and should be a string')
  }
  if (!id || !isString(id)) {
    throw new FormError('Parameter `id` is required and should be a string')
  }
  if (!type || !isString(type)) {
    throw new FormError('Parameter `type` is required and should be a string')
  }
  if (!action || !isString(action)) {
    throw new FormError('Parameter `action` is required and should be a string')
  }
}

module.exports = async req => {
  try {
    const { userId, id, type, action = 'SHARED', ...params } = await json(req, { encoding: 'utf8' })
    validateParams({ userId, id, type, action, ...params })
    const commands = [
      'MATCH (user:User { id: $userId })',
      `CREATE (action:Content:${capitalize(type)} { id: $id, created: timestamp() })`,
      'SET action += $params',
      `CREATE (user)-[:${action.toUpperCase()} { created: timestamp() }]->(action)`
    ]
    await db.run(commands.join(' '), { userId, id, params })
    return { success: true }
  } catch (error) {
    return { success: false, error: `[${error.code}] ${error.message}` }
  }
}
