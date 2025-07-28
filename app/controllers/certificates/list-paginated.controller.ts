/* eslint-disable @unicorn/filename-case */
import CertificateListPaginatedUseCase from '#use-cases/certificates/list-paginated'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CertificateListPaginatedController {
  constructor(private readonly useCase: CertificateListPaginatedUseCase) {}

  async handle({ request, response }: HttpContext) {
    const { search } = request.qs()
    const result = await this.useCase.execute({ search })
    return response.ok(result)
  }
}
