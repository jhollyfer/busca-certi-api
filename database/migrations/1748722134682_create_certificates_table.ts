import { CertificateStatusCorrection, CertificateStatusDelivery } from '#constants/enums'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'certificates'

  private statusDelivery = Object.keys(CertificateStatusDelivery)
  private statusDeliveryName = 'certificate_status_delivery'

  private statusCorrection = Object.keys(CertificateStatusCorrection)
  private statusCorrectionName = 'certificate_status_correction'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      const defaultUuid = this.db.rawQuery('uuid_generate_v4()').knexQuery
      table.uuid('id').primary().defaultTo(defaultUuid)

      table.string('course').notNullable()
      table.integer('year').notNullable()

      table
        .uuid('student_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .enu('status_delivery', this.statusDelivery, {
          enumName: this.statusDeliveryName,
          useNative: true,
        })
        .notNullable()
        .defaultTo(CertificateStatusDelivery.AVAILABLE)

      table
        .enu('status_correction', this.statusCorrection, {
          enumName: this.statusCorrectionName,
          useNative: true,
        })
        .notNullable()
        .defaultTo(CertificateStatusCorrection.DOES_NOT_NEED_CORRECTION)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw(`DROP TYPE IF EXISTS "${this.statusDeliveryName}" CASCADE`)
    this.schema.raw(`DROP TYPE IF EXISTS "${this.statusCorrectionName}" CASCADE`)
    this.schema.dropTable(this.tableName)
  }
}
