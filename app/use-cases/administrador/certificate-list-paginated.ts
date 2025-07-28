/* eslint-disable @unicorn/filename-case */
import Certificate from '#models/certificate'
import { inject } from '@adonisjs/core'

@inject()
export default class CertificateListPaginatedUseCase {
  public async execute({
    currentPage,
    perPage,
  }: {
    perPage: number
    currentPage: number
    search?: string
  }) {
    const resultado = await Certificate.query()
      .innerJoin('users', 'users.id', 'certificates.student_id')
      .select(['users.id as student_id', 'certificates.*'])
      .orderBy('users.nome', 'asc')
      .orderBy('certificates.curso', 'asc')
      .orderBy('certificates.ano', 'asc')
      .preload('student')
      .paginate(currentPage, perPage)

    return resultado?.toJSON()
  }
}
