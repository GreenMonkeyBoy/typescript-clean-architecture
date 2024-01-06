export class SuccessResponsePayload {
  data: unknown

  constructor(payload: unknown) {
    this.data = payload
  }
}

export class ErrorResponsePayload {
  error: {
    status: number
    message: string
    description?: unknown
  }

  private constructor(status: number, message: string, description?: unknown) {
    this.error = {
      status,
      message,
      description,
    }
  }

  static create(data: { status: number; message: string; description?: unknown }) {
    return new ErrorResponsePayload(data.status, data.message, data.description)
  }

  static createValidationError(message: string, description: unknown) {
    return new ErrorResponsePayload(400, message, description)
  }
  static createInternalServerError() {
    return new ErrorResponsePayload(500, `Internal Server Error`)
  }
}
