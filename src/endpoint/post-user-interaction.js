const { json } = require('micro')

const { db } = require('../util/neo4j')

module.exports = async req => {
  const { userId, toUserId, type, ...params } = await json(req, { encoding: 'utf8' })
  try {
    const commands = [
      'MATCH (user1:User { id: $userId })',
      'MATCH (user2:User { id: $toUserId })',
      `CREATE (user1)-[interaction:${type.toUpperCase()} { created: timestamp() }]->(user2)`,
      'SET interaction += $params'
    ]
    await db.run(commands.join(' '), { userId, toUserId, params })
    return { success: true }
  } catch (error) {
    return { success: false, error: `[${error.code}] ${error.message}` }
  }
}
