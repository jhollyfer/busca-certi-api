/* eslint-disable @unicorn/filename-case */
import BuscarPorNomeCertificadosUseCase from '#use-cases/buscar-por-nome.use-case'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class BuscarPorNomeCertificadosController {
  constructor(private readonly useCase: BuscarPorNomeCertificadosUseCase) {}

  async handle({ request, response }: HttpContext) {
    const { nomeCompleto } = request.only(['nomeCompleto'])
    const resultado = await this.useCase.execute({ nomeCompleto })
    return response.ok(resultado)
  }
}
