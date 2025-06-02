/* eslint-disable @unicorn/filename-case */
import DashboardEstatisticasCertificadosUseCase from '#use-cases/administrador/dashboard-estatisticas.use-case.ts'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DashboardEstatisticasCertificadosUseCaseCertificadosController {
  constructor(private readonly useCase: DashboardEstatisticasCertificadosUseCase) {}

  async handle({ response }: HttpContext) {
    const resultado = await this.useCase.execute()
    return response.ok(resultado)
  }
}
