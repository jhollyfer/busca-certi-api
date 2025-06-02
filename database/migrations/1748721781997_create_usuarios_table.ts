import { UsuarioTipo } from '#constants/enums'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  private tipoUsuario = Object.keys(UsuarioTipo)
  private tipoUsuarioNomeEnum = 'usuario_tipo'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      const defaultUuid = this.db.rawQuery('uuid_generate_v4()').knexQuery
      table.uuid('id').primary().defaultTo(defaultUuid)

      table.string('nome').notNullable()
      table.string('email', 254).nullable().unique()
      table.string('senha').nullable()

      table
        .enu('tipo', this.tipoUsuario, {
          enumName: this.tipoUsuarioNomeEnum,
          useNative: true,
        })
        .notNullable()
        .defaultTo(UsuarioTipo.ALUNO)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.raw(`DROP TYPE IF EXISTS "${this.tipoUsuarioNomeEnum}" CASCADE`)
    this.schema.dropTable(this.tableName)
  }
}
