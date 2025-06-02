import { CertificadoStatusCorrecao, CertificadoStatusEntrega } from '#constants/enums'
import BaseUUID from '#models/base-uuid'
import Usuario from '#models/usuario'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Certificado extends BaseUUID {
  @column()
  declare curso: string

  @column()
  declare ano: number

  @column()
  declare statusEntrega: CertificadoStatusEntrega

  @column()
  declare statusCorrecao: CertificadoStatusCorrecao

  @column()
  declare alunoId: string

  @belongsTo(() => Usuario, {
    foreignKey: 'alunoId',
  })
  declare aluno: BelongsTo<typeof Usuario>

  serializeExtras() {
    return {
      total: Number(this.$extras.total ?? 0),
      disponiveis: Number(this.$extras.disponiveis ?? 0),
      entregues: Number(this.$extras.entregues ?? 0),
      corrigir: Number(this.$extras.corrigir ?? 0),
    }
  }
}
