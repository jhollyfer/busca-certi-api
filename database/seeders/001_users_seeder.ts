import { UserRoleEnum } from '#constants/enums'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { parse } from 'csv-parse'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

interface CsvUser {
  id: string
  name: string
  email: string
  password: string
  role: string
  created_at: string
  updated_at: string
}

export default class extends BaseSeeder {
  async run(): Promise<void> {
    try {
      // Lê o arquivo CSV (ajuste o caminho conforme necessário)
      const csvPath = join(process.cwd(), 'database/seeders/001_users.csv')
      const csvContent = readFileSync(csvPath, 'utf-8')

      // Parse do CSV usando callback
      const users: CsvUser[] = await new Promise((resolve, reject) => {
        parse(
          csvContent,
          {
            columns: true,
            skip_empty_lines: true,
            trim: true,
          },
          (err, records: CsvUser[]) => {
            if (err) reject(err)
            else resolve(records)
          }
        )
      })

      console.log(`Processando ${users.length} usuários do CSV...`)

      for await (const userData of users) {
        const user = new User()
        user.id = userData.id.trim()
        user.name = userData.name.trim()
        user.role = UserRoleEnum.STUDENT
        await user.save()
        console.log(`Usuário ${user.name} (${user.id}) criado com sucesso!`)
      }

      console.log('Seed concluído com sucesso!')
    } catch (error) {
      console.error('Erro ao processar o CSV:', error)
      throw error
    }
  }
}
