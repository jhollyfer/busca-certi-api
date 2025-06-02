/* eslint-disable @unicorn/filename-case */
import Usuario from '#models/usuario'
import { inject } from '@adonisjs/core'

@inject()
export default class BuscarPorNomeCertificadosUseCase {
  public async execute({ nomeCompleto }: { nomeCompleto: string }) {
    const nomeCompletoLimpo = nomeCompleto?.trim()?.toUpperCase()

    const aluno = await Usuario.query()
      // .whereILike('nome', `%${nomeCompletoLimpo}%`)
      .where('nome', nomeCompletoLimpo)
      .preload('certificados')
      .first()

    return aluno?.toJSON()
  }
}
