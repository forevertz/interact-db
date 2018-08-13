const { json } = require('micro')

const { capitalize } = require('../util')
const { db } = require('../util/neo4j')

module.exports = async req => {
  const { userId, id, type, action, ...params } = await json(req, { encoding: 'utf8' })
  try {
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
