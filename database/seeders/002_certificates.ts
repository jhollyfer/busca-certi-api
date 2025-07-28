import { CertificateStatusCorrection, CertificateStatusDelivery } from '#constants/enums'
import Certificate from '#models/certificate'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { parse } from 'csv-parse'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

interface CsvCertificate {
  id: string
  course: string
  year: string
  student_id: string
  status_delivery: CertificateStatusDelivery
  status_correction: CertificateStatusCorrection
  created_at: string
  updated_at: string
}

export default class extends BaseSeeder {
  async run(): Promise<void> {
    try {
      // Lê o arquivo CSV (ajuste o caminho conforme necessário)
      const csvPath = join(process.cwd(), 'database/seeders/002_certificates.csv')
      const csvContent = readFileSync(csvPath, 'utf-8')

      // Parse do CSV usando callback
      const certificates: CsvCertificate[] = await new Promise((resolve, reject) => {
        parse(
          csvContent,
          {
            columns: true,
            skip_empty_lines: true,
            trim: true,
          },
          (err, records: CsvCertificate[]) => {
            if (err) reject(err)
            else resolve(records)
          }
        )
      })

      console.log(`Processando ${certificates.length} certificados do CSV...`)

      for await (const payload of certificates) {
        const certificate = new Certificate()
        certificate.id = payload.id.trim()
        certificate.course = payload.course.trim()
        certificate.year = Number(payload.year.trim())
        certificate.studentId = payload.student_id.trim()
        certificate.statusDelivery = payload.status_delivery
        certificate.statusCorrection = payload.status_correction
        await certificate.save()

        console.log(`Certificado (${certificate.id}) criado com sucesso!`)
      }

      console.log('Seed concluído com sucesso!')
    } catch (error) {
      console.error('Erro ao processar o CSV:', error)
      throw error
    }
  }
}
