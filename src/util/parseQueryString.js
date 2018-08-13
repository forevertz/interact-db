module.exports = function parseQueryString(queryString) {
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
