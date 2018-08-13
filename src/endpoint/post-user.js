const { json } = require('micro')

const { db } = require('../util/neo4j')

module.exports = async req => {
  const { id, ...params } = await json(req, { encoding: 'utf8' })
  try {
    const commands = [
      'MERGE (a:User { id: $id })',
      'ON CREATE SET a.created = timestamp()',
      'SET a += $params'
    ]
    await db.run(commands.join(' '), { id, params })
    return { success: true }
  } catch (error) {
    return { success: false, error: `[${error.code}] ${error.message}` }
  }
}
