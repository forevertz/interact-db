const { json } = require('micro')

const { db } = require('../util/neo4j')

module.exports = async req => {
  const { userId, toUserId, toContentId, type, ...params } = await json(req, { encoding: 'utf8' })
  try {
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
