/* eslint-disable @unicorn/filename-case */
import CertificateListPaginatedUseCase from '#use-cases/administrador/certificate-list-paginated'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CertificateListPaginatedController {
  constructor(private readonly useCase: CertificateListPaginatedUseCase) {}

  async handle({ request, response }: HttpContext) {
    const { perPage, currentPage } = request.only(['perPage', 'currentPage'])
    const result = await this.useCase.execute({ perPage, currentPage })
    return response.ok(result)
  }
}
