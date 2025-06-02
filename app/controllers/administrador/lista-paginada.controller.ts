/* eslint-disable @unicorn/filename-case */
import ListaPaginadaCertificadosUseCase from '#use-cases/administrador/lista-paginada.use-case'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ListaPaginadaCertificadosController {
  constructor(private readonly useCase: ListaPaginadaCertificadosUseCase) {}

  async handle({ request, response }: HttpContext) {
    const { perPage, currentPage } = request.only(['perPage', 'currentPage'])
    const resultado = await this.useCase.execute({ perPage, currentPage })
    return response.ok(resultado)
  }
}
