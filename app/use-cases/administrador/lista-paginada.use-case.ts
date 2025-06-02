/* eslint-disable @unicorn/filename-case */
import Certificado from '#models/certificado'
import { inject } from '@adonisjs/core'

@inject()
export default class ListaPaginadaCertificadosUseCase {
  public async execute({
    currentPage,
    perPage,
  }: {
    perPage: number
    currentPage: number
    search?: string
  }) {
    const resultado = await Certificado.query()
      .innerJoin('usuarios', 'usuarios.id', 'certificados.aluno_id')
      .select(['usuarios.id as aluno_id', 'certificados.*'])
      .orderBy('usuarios.nome', 'asc')
      .orderBy('certificados.curso', 'asc')
      .orderBy('certificados.ano', 'asc')
      .preload('aluno')
      .paginate(currentPage, perPage)

    return resultado?.toJSON()
  }
}
