const { json } = require('micro')

const { db } = require('../util/neo4j')
const { FormError, isString } = require('../util/validator')

function validateParams({ userId, id, aboutUserId, aboutContentId, ...params }) {
  if (!userId || !isString(userId)) {
    throw new FormError('Parameter `userId` is required and should be a string')
  }
  if (!id || !isString(id)) {
    throw new FormError('Parameter `id` is required and should be a string')
  }
  if (!aboutUserId && !aboutContentId) {
    throw new FormError('Parameters `aboutUserId` or `aboutContentId` are required')
  } else if (aboutUserId && aboutContentId) {
    throw new FormError('Parameters `aboutUserId` and `aboutContentId` cannot be used together')
  } else if (aboutUserId && !isString(aboutUserId)) {
    throw new FormError('Parameter `aboutUserId` should be a string')
  } else if (aboutContentId && !isString(aboutContentId)) {
    throw new FormError('Parameter `aboutContentId` should be a string')
  }
}

module.exports = async req => {
  try {
    const { userId, id, aboutUserId, aboutContentId, ...params } = await json(req, {
      encoding: 'utf8'
    })
    validateParams({ userId, id, aboutUserId, aboutContentId, ...params })
    let commands = [
      'MATCH (user:User { id: $userId })',
      aboutUserId
        ? 'MATCH (about:User { id: $aboutUserId })'
        : 'MATCH (about:Content { id: $aboutContentId })',
      `CREATE (comment:Content:Comment { id: $id, created: timestamp() })`,
      'SET comment += $params',
      `CREATE (user)-[:COMMENTED { created: timestamp() }]->(comment)`,
      'CREATE (comment)-[:ABOUT { created: timestamp() }]->(about)'
    ]
    await db.run(commands.join(' '), { userId, id, aboutUserId, aboutContentId, params })
    return { success: true }
  } catch (error) {
    return { success: false, error: `[${error.code}] ${error.message}` }
  }
}
