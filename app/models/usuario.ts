import { UsuarioTipo } from '#constants/enums'
import BaseUUID from '#models/base-uuid'
import Certificado from '#models/certificado'
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

export default class Usuario extends compose(BaseUUID, AuthFinder) {
  static table = 'usuarios'

  @column()
  declare nome: string

  @column()
  declare email: string | null

  @column({ serializeAs: null })
  declare senha: string | null

  @column()
  declare tipo: UsuarioTipo

  static tokens = DbAccessTokensProvider.forModel(Usuario)

  @hasMany(() => Certificado, {
    foreignKey: 'alunoId',
  })
  declare certificados: HasMany<typeof Certificado>

  serializeExtras() {
    return {
      alunos: Number(this.$extras.alunos ?? 0),
    }
  }
}
