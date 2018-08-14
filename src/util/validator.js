function FormError(message, code = 'FormError') {
  const error = new Error(message)
  error.code = code
  return error
}

function isString(string, pattern = /^[A-Za-z0-9_-]+$/) {
  return typeof string === 'string' && pattern.test(string)
}

module.exports = {
  FormError,
  isString
}
