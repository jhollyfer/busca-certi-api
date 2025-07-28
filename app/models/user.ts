import { UserRoleEnum } from '#constants/enums'
import BaseUUID from '#models/base-uuid'
import Certificate from '#models/certificate'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'senha',
})

export default class User extends compose(BaseUUID, AuthFinder) {
  static table = 'users'

  @column()
  declare name: string

  @column()
  declare email: string | null

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  declare role: UserRoleEnum

  static tokens = DbAccessTokensProvider.forModel(User)

  @hasMany(() => Certificate, {
    foreignKey: 'studentId',
  })
  declare certificates: HasMany<typeof Certificate>

  serializeExtras() {
    return {
      students: Number(this.$extras.students ?? 0),
    }
  }
}
