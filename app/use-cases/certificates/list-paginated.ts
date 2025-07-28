/* eslint-disable @unicorn/filename-case */
import Usuario from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class CertificateListPaginatedUseCase {
  public async execute({
    search,
    page = 1,
    perPage = 10,
  }: {
    search?: string
    perPage?: number
    page?: number
  }) {
    const students = await Usuario.query()
      .if(search, (query) => {
        query.whereILike('name', `%${search}%`)
      })
      .preload('certificates')
      .paginate(page, perPage)

    return students
  }
}
