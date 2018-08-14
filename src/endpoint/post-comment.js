const { json } = require('micro')

const { db } = require('../util/neo4j')

module.exports = async req => {
  const { userId, id, aboutUserId, aboutContentId, ...params } = await json(req, {
    encoding: 'utf8'
  })
  try {
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
