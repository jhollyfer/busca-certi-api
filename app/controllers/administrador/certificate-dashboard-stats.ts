/* eslint-disable @unicorn/filename-case */
import CertificateDashboardStatsUseCase from '#use-cases/administrador/certificate-dashboard-stats'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdministratorDashboardStatusController {
  constructor(private readonly useCase: CertificateDashboardStatsUseCase) {}

  async handle({ response }: HttpContext) {
    const result = await this.useCase.execute()
    return response.ok(result)
  }
}
