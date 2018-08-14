const { parseQueryString } = require('../util')
const { db, returnData } = require('../util/neo4j')
const { FormError } = require('../util/validator')

function validateParams(params) {
  if (Object.keys(params).filter(v => v).length === 0) {
    throw new FormError('You must specify at least 1 parameter')
  }
}

module.exports = async req => {
  try {
    const params = parseQueryString(req.url.split('?')[1] || '')
    validateParams(params)
    const commands = [
      'MATCH (a:User)',
      `WHERE ${Object.keys(params)
        .map(key => `a.${key} = $${key}`)
        .join(' AND ')}`,
      'RETURN a',
      'LIMIT 1'
    ]
    const { records } = await db.run(commands.join(' '), params)
    return { success: true, result: returnData(records)[0] }
  } catch (error) {
    return { success: false, error: `[${error.code}] ${error.message}` }
  }
}
