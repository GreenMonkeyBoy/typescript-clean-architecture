import { plainToInstance } from 'class-transformer'
import {
  ValidationError as ClassValidatorValidationError,
  validate,
} from 'class-validator'
import { FastifyReply, FastifyRequest } from 'fastify'

import { ValidationError } from '../../../../application/interfaces/validation-error.interface'
import { ClassConstructor } from '../../../../application/types/class-constructor.type'
import { ErrorResponsePayload } from '../../response-payload'
import { BaseRequestHandler } from './base.request-handler'

export class ValidationRequestHandler extends BaseRequestHandler {
  constructor(
    private obj: {
      body?: ClassConstructor<object>
      params?: ClassConstructor<object>
    },
  ) {
    super()
  }

  async handle(req: FastifyRequest, reply: FastifyReply) {
    let classValidatorValidationErrors: ClassValidatorValidationError[] = []

    if (this.obj.params) {
      if (!req.params) {
        return reply.status(400).send(
          ErrorResponsePayload.create({
            status: 400,
            message: `The request must include the params`,
          }),
        )
      }

      const paramsvalidationError = await validate(
        plainToInstance(this.obj.params, req.params),
      )

      classValidatorValidationErrors = classValidatorValidationErrors.concat(
        paramsvalidationError,
      )
    }

    if (this.obj.body) {
      if (!req.body) {
        return reply.status(400).send(
          ErrorResponsePayload.create({
            status: 400,
            message: `The request must include a body`,
          }),
        )
      }

      const bodyValidationError = await validate(
        plainToInstance(this.obj.body, req.body),
        {
          forbidNonWhitelisted: true,
          forbidUnknownValues: true,
        },
      )

      classValidatorValidationErrors =
        classValidatorValidationErrors.concat(bodyValidationError)
    }

    if (classValidatorValidationErrors.length > 0) {
      const validationErrors: ValidationError[] =
        classValidatorValidationErrors.map((n) => ({
          property: n.property,
          value: n.value,
          constraints: n.constraints,
        }))

      return reply.status(400).send(
        ErrorResponsePayload.create({
          status: 400,
          message: `The request is invalid`,
          description: validationErrors,
        }),
      )
    }

    return super.handle(req, reply)
  }
}
