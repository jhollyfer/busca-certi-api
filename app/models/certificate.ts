import { CertificateStatusCorrection, CertificateStatusDelivery } from '#constants/enums'
import BaseUUID from '#models/base-uuid'
import User from '#models/user'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Certificate extends BaseUUID {
  @column()
  declare course: string

  @column()
  declare year: number

  @column()
  declare statusDelivery: CertificateStatusDelivery

  @column()
  declare statusCorrection: CertificateStatusCorrection

  @column()
  declare studentId: string

  @belongsTo(() => User, {
    foreignKey: 'studentId',
  })
  declare student: BelongsTo<typeof User>

  serializeExtras() {
    return {
      total: Number(this.$extras.total ?? 0),
      available: Number(this.$extras.available ?? 0),
      delivered: Number(this.$extras.delivered ?? 0),
      needsCorrection: Number(this.$extras.needsCorrection ?? 0),
    }
  }
}
