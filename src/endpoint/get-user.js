const { db } = require('../util/neo4j')
const parseQueryString = require('../util/parseQueryString')

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
    return { success: true, result: records[0]._fields[0] }
  } catch (error) {
    return { success: false, error: `[${error.code}] ${error.message}` }
  }
}
