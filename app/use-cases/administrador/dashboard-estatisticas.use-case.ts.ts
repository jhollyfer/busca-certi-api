/* eslint-disable @unicorn/filename-case */
import { CertificadoStatusCorrecao, CertificadoStatusEntrega, UsuarioTipo } from '#constants/enums'
import Certificado from '#models/certificado'
import Usuario from '#models/usuario'
import { inject } from '@adonisjs/core'

@inject()
export default class DashboardEstatisticasCertificadosUseCase {
  public async execute() {
    const [alunos] = await Usuario.query().where('tipo', UsuarioTipo.ALUNO).count({
      alunos: '*',
    })

    const [certificados] = await Certificado.query().count({
      total: '*',
    })

    const [disponiveis] = await Certificado.query()
      .where('status_entrega', CertificadoStatusEntrega.DISPONIVEL_PARA_ENTREGA)
      .count({
        disponiveis: '*',
      })

    const [entregues] = await Certificado.query()
      .where('status_entrega', CertificadoStatusEntrega.ENTREGUE)
      .count({
        entregues: '*',
      })

    const [corrigir] = await Certificado.query()
      .where('status_correcao', CertificadoStatusCorrecao.NECESSITA_CORRECAO)
      .count({
        corrigir: '*',
      })

    return {
      alunos: alunos?.toJSON()?.alunos,
      certificados: {
        total: certificados?.toJSON()?.total,
        disponiveis: disponiveis?.toJSON()?.disponiveis,
        entregues: entregues?.toJSON()?.entregues,
        corrigir: corrigir?.toJSON()?.corrigir,
      },
    }
  }
}
