import { CertificadoStatusCorrecao, CertificadoStatusEntrega } from '#constants/enums'
import BaseUUID from '#models/base-uuid'
import Usuario from '#models/usuario'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Certificado extends BaseUUID {
  @column({
    serializeAs: 'course',
  })
  declare curso: string

  @column({
    serializeAs: 'year',
  })
  declare ano: number

  @column({
    serializeAs: 'statusDelivery',
  })
  declare statusEntrega: CertificadoStatusEntrega

  @column({
    serializeAs: 'statusCorrection',
  })
  declare statusCorrecao: CertificadoStatusCorrecao

  @column({
    serializeAs: 'studentId',
  })
  declare alunoId: string

  @belongsTo(() => Usuario, {
    foreignKey: 'alunoId',
    serializeAs: 'student',
  })
  declare aluno: BelongsTo<typeof Usuario>

  serializeExtras() {
    return {
      total: Number(this.$extras.total ?? 0),
      available: Number(this.$extras.disponiveis ?? 0),
      delivered: Number(this.$extras.entregues ?? 0),
      needsCorrection: Number(this.$extras.corrigir ?? 0),
    }
  }
}
