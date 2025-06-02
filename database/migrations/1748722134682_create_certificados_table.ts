import { CertificadoStatusCorrecao, CertificadoStatusEntrega } from '#constants/enums'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'certificados'

  private statusEntrega = Object.keys(CertificadoStatusEntrega)
  private statusCorrecao = Object.keys(CertificadoStatusCorrecao)

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      const defaultUuid = this.db.rawQuery('uuid_generate_v4()').knexQuery
      table.uuid('id').primary().defaultTo(defaultUuid)

      table.string('curso').notNullable()
      table.integer('ano').notNullable()

      table
        .uuid('aluno_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table
        .enu('status_entrega', this.statusEntrega, {
          enumName: 'certificado_status_entrega',
          useNative: true,
        })
        .notNullable()
        .defaultTo(CertificadoStatusEntrega.DISPONIVEL_PARA_ENTREGA)

      table
        .enu('status_correcao', this.statusCorrecao, {
          enumName: 'certificado_status_correcao',
          useNative: true,
        })
        .notNullable()
        .defaultTo(CertificadoStatusCorrecao.NAO_NECESSITA_CORRECAO)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw(`DROP TYPE IF EXISTS "certificado_status_correcao" CASCADE`)
    this.schema.raw(`DROP TYPE IF EXISTS "certificado_status_entrega" CASCADE`)
    this.schema.dropTable(this.tableName)
  }
}
