const { propOr, pipe, applySpec, map, always } = require('ramda')
const {
  UniqueConstraintError,
  Error: SequelizeError,
  ValidationError
} = require('sequelize')

const { HttpError, NotFoundError } = require('./')

const UniqueConstraintErrorFormatter = applySpec({
  field: propOr(null, 'path'),
  message: propOr('must be unique', 'message'),
  type: always('unique_violation')
})

const validationErrorFormatter = applySpec({
  field: pipe(propOr('', 'field')),
  message: propOr('required', 'message'),
  type: always('required')
})

const getError = (status = 500, name = 'Internal Error', formatter) =>
  applySpec({
    status: propOr(status, 'status'),
    name: always(name),
    errors: pipe(propOr([], 'errors'), map(formatter)),
    fields: pipe(propOr([], 'fields'), map(formatter))
  })

const formatErrorResponse = (err) => {
  if (err instanceof NotFoundError) {
    return getError(400, err.name, validationErrorFormatter)(err)
  }

  if (err instanceof UniqueConstraintError) {
    return getError(409, 'unique_constraint', validationErrorFormatter)(err)
  }

  if (err instanceof SequelizeError) {
    return getError(
      409,
      'general_database',
      UniqueConstraintErrorFormatter
    )(err)
  }

  if (err instanceof ValidationError) {
    return getError(422, 'validation_error', validationErrorFormatter)(err)
  }

  if (err instanceof HttpError) {
    return getError(err.statusCode, err.message, validationErrorFormatter)(err)
  }

  if (err instanceof Error && err.message) {
    return {
      status: 500,
      name: 'unknown',
      message: err.message
    }
  }

  return getError()(err)
}

module.exports = formatErrorResponse
