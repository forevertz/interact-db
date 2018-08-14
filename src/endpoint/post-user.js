const { json } = require('micro')

const { db } = require('../util/neo4j')
const { FormError, isString } = require('../util/validator')

function validateParams({ id, ...params }) {
  if (!id || !isString(id)) {
    throw new FormError('Parameter `id` is required and should be a string')
  }
}

module.exports = async req => {
  try {
    const { id, ...params } = await json(req, { encoding: 'utf8' })
    validateParams({ id, ...params })
    const commands = [
      'MERGE (user:User { id: $id })',
      'ON CREATE SET user.created = timestamp()',
      'SET user += $params'
    ]
    await db.run(commands.join(' '), { id, params })
    return { success: true }
  } catch (error) {
    return { success: false, error: `[${error.code}] ${error.message}` }
  }
}
