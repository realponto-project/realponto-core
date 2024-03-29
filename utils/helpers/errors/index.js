class HttpError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message)
    this.name = 'Error'
    this.statusCode = statusCode
    this.errors = errors
    Error.captureStackTrace(this, this.constructor)
  }
}

class NotFoundError extends HttpError {
  constructor(message) {
    super(message, 404)
    this.name = 'NotFoundError'
    Error.captureStackTrace(this, this.constructor)
  }
}

class UnauthorizedError extends HttpError {
  constructor(message) {
    super('User UNAUTHORIZED', 401)
    this.name = message
    Error.captureStackTrace(this, this.constructor)
  }
}

class InvalidParamsError extends HttpError {
  constructor(message) {
    super(message, 400)
    this.name = 'InvalidParamsError'
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  HttpError,
  NotFoundError,
  UnauthorizedError,
  InvalidParamsError
}
