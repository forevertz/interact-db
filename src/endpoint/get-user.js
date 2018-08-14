const { parseQueryString } = require('../util')
const { db, returnData } = require('../util/neo4j')

module.exports = async req => {
  try {
    const params = parseQueryString(req.url.split('?')[1] || '')
    const commands = [
      'MATCH (a:User)',
      `WHERE ${Object.keys(params)
        .filter(v => v)
        .map(key => `a.${key} = $${key}`)
        .concat('1=1')
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
