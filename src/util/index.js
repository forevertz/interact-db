function parseQueryString(queryString) {
  return queryString.split('&').reduce(
    (params, paramString) => ({
      ...params,
      [paramString.split('=')[0]]: parseFloat(
        paramString
          .split('=')
          .slice(1)
          .join('')
      )
    }),
    {}
  )
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = {
  parseQueryString,
  capitalize
}
