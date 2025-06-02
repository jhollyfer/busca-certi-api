import vine from '@vinejs/vine'

export const ArmazenamentoSchema = {
  submissao: {
    payload: vine.object({
      arquivos: vine.array(
        vine.file({
          size: '2mb',
          // extnames: ['jpg', 'png', 'jpeg', 'webp'],
        })
      ),
    }),
  },
}

export const ArmazenamentoValidador = {
  submissao: {
    payload: vine.compile(ArmazenamentoSchema['submissao']['payload']),
  },
}
