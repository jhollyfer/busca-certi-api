import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up(): Promise<void> {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  }

  async down(): Promise<void> {
    await this.db.rawQuery('DROP EXTENSION IF EXISTS "uuid-ossp"')
  }
}
