/* eslint-disable @unicorn/filename-case */
import Usuario from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class CertificateListPaginatedUseCase {
  public async execute({ search }: { search?: string }) {
    const students = await Usuario.query()
      .if(search, (query) => {
        query.whereILike('name', `%${search}%`)
      })
      .preload('certificates')
      .paginate(1, 10)

    return students
  }
}
