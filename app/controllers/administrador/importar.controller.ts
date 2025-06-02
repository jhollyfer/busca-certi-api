import ImportarCertificadosUseCase from '#use-cases/administrador/importar.use-case'
import { ArmazenamentoValidador } from '#validators/storage'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ImportarCertificadosController {
  constructor(private readonly useCase: ImportarCertificadosUseCase) {}

  async handle({ request, response }: HttpContext) {
    const validador = ArmazenamentoValidador['submissao']['payload']
    const { arquivos } = await request.validateUsing(validador)

    if (!arquivos.length)
      return response.unprocessableEntity({
        message: 'Por favor, envie pelo menos um arquivo',
        codigo: 422,
      })

    const existeArquivoInvalido = arquivos.some(
      (arquivo) => !arquivo.isValid || !['xlsx', 'xlsm', 'csv'].includes(arquivo.extname!)
    )

    if (existeArquivoInvalido)
      return response.unprocessableEntity({
        message: 'Por favor, envie apenas arquivos .xlsx, .xlsm ou .csv',
        codigo: 422,
      })

    const [arquivo] = arquivos

    const resultado = await this.useCase.execute(arquivo)

    return response.ok(resultado)
  }
}
