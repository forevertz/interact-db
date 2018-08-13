const { json } = require('micro')

const { db } = require('../util/neo4j')

module.exports = async req => {
  const { userId, contentId, type, ...params } = await json(req, { encoding: 'utf8' })
  try {
    const commands = [
      'MATCH (user:User { id: $userId })',
      'MATCH (action:Content { id: $contentId })',
      `CREATE (user)-[interaction:${type.toUpperCase()} { created: timestamp() }]->(action)`,
      'SET interaction += $params'
    ]
    await db.run(commands.join(' '), { userId, contentId, params })
    return { success: true }
  } catch (error) {
    return { success: false, error: `[${error.code}] ${error.message}` }
  }
}
