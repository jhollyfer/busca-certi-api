import { UserRoleEnum } from '#constants/enums'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  private userRole = Object.keys(UserRoleEnum)
  private userRoleName = 'user_role'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      const defaultUuid = this.db.rawQuery('uuid_generate_v4()').knexQuery
      table.uuid('id').primary().defaultTo(defaultUuid)

      table.string('name').notNullable()
      table.string('email', 254).nullable().unique()
      table.string('password').nullable()

      table
        .enu('role', this.userRole, {
          enumName: this.userRoleName,
          useNative: true,
        })
        .notNullable()
        .defaultTo(UserRoleEnum.STUDENT)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.raw(`DROP TYPE IF EXISTS "${this.userRoleName}" CASCADE`)
    this.schema.dropTable(this.tableName)
  }
}
