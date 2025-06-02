import { CertificadoStatusCorrecao, CertificadoStatusEntrega, UsuarioTipo } from '#constants/enums'
import CertificadoModel from '#models/certificado'
import Usuario from '#models/usuario'
import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import fs from 'node:fs/promises'
import * as XLSX from 'xlsx'

interface DadosCurso {
  nome: string
  curso: string
  ano: number
  correcao: string
  entregue: string
  local: string
}

interface Certificado {
  curso: string
  ano: number
  statusEntrega: CertificadoStatusEntrega
  statusCorrecao: CertificadoStatusCorrecao
}

@inject()
export default class ImportarCertificadosUseCase {
  async execute(payload: MultipartFile) {
    const processados = await this.processar(payload)
    const mapeados = await this.mapear(processados)
    const formatados = await this.formatar(mapeados)
    await this.armazenar(formatados)
    return { certificados: processados.length, alunos: formatados.length }
  }

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD') // Decompõe os caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos (acentos)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais, mantém apenas letras, números e espaços
      .replace(/\s+/g, ' ') // Substitui múltiplos espaços por um único espaço
      .trim()
      .toUpperCase()
  }

  private async processar(payload: MultipartFile) {
    const buffer = await fs.readFile(payload.tmpPath!)

    const workbook = XLSX.read(buffer, { type: 'buffer' })

    const sheetName = workbook.SheetNames[1]
    const worksheet = workbook.Sheets[sheetName]

    if (!worksheet) {
      return []
    }

    const dados = XLSX.utils.sheet_to_json<DadosCurso>(worksheet, {
      header: ['numero', 'nome', 'curso', 'ano', 'correcao', 'entregue', 'local'],
      range: 1,
      defval: '',
    })

    return dados
  }

  private async mapear(dados: DadosCurso[]) {
    const filtrados = dados.filter((row) => row.nome || row.curso)
    const mapeados = filtrados.reduce((acc: Map<string, Certificado[]>, row) => {
      const nome = this.normalizarTexto((row.nome || '').toString().trim())
      const curso = (row.curso || '').toString().trim()
      const ano = (row.ano || '').toString().trim()
      const correcao = (row.correcao || '').toString().trim()
      const entregue = (row.entregue || '').toString().trim()

      if (!nome) return acc

      const certificado: Certificado = {
        curso: curso || 'Curso não informado',
        ano: Number(ano),
        statusEntrega:
          entregue === 'NÃO'
            ? CertificadoStatusEntrega.DISPONIVEL_PARA_ENTREGA
            : CertificadoStatusEntrega.ENTREGUE,
        statusCorrecao:
          correcao === 'NÃO'
            ? CertificadoStatusCorrecao.NAO_NECESSITA_CORRECAO
            : CertificadoStatusCorrecao.NECESSITA_CORRECAO,
      }

      // Usa o nome normalizado como chave para agrupar variações do mesmo nome
      if (acc.has(nome)) {
        const entrada = acc.get(nome)!
        const jaPossuiCertificado = entrada.some(
          (cert) => cert.curso === certificado.curso && cert.ano === certificado.ano
        )

        if (!jaPossuiCertificado) {
          entrada.push(certificado)
        }
      } else {
        acc.set(nome, [certificado])
      }

      return acc
    }, new Map<string, Certificado[]>())

    return mapeados
  }

  private async formatar(dados: Map<string, Certificado[]>) {
    return Array.from(dados.entries())
      .map(([nome, certificados]) => ({
        aluno: nome,
        tipo: UsuarioTipo.ALUNO,
        certificados: certificados.sort((a, b) => {
          if (a.curso !== b.curso) {
            return a.curso.localeCompare(b.curso)
          }
          return a.ano - b.ano
        }),
      }))
      .sort((a, b) => a.aluno.localeCompare(b.aluno))
  }

  private async armazenar(dados: { aluno: string; certificados: Certificado[] }[]) {
    for await (const { aluno, certificados } of dados) {
      const usuario = await Usuario.updateOrCreate({ nome: aluno }, { nome: aluno })

      await CertificadoModel.updateOrCreateMany(
        ['ano', 'alunoId', 'curso'],
        certificados.map((certificado) => ({
          ano: certificado.ano,
          alunoId: usuario.id,
          curso: certificado.curso,
          statusCorrecao: certificado.statusCorrecao,
          statusEntrega: certificado.statusEntrega,
        }))
      )
    }
  }
}
