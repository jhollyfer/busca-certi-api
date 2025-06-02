/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const ImportarCertificadosController = () =>
  import('#controllers/administrador/importar.controller')
const ListaPaginadaCertificadosController = () =>
  import('#controllers/administrador/lista-paginada.controller')
const BuscarPorNomeCertificadosController = () =>
  import('#controllers/certificados/buscar-por-nome.controller')
const DashboardEstatisticasCertificadosUseCaseCertificadosController = () =>
  import('#controllers/administrador/dashboard-estatisticas.controller')
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    mensagem: 'Bem vindo ao sistema de busca de certificados',
  }
})
router.post('/buscar-por-nome', [BuscarPorNomeCertificadosController]).as('buscar-por-nome')

router
  .group(() => {
    router
      .get('/dashboard', [DashboardEstatisticasCertificadosUseCaseCertificadosController])
      .as('dashboard')
  })
  .prefix('/administrador')

router
  .group(() => {
    router.post('/importar', [ImportarCertificadosController]).as('importar')
    router.get('/lista-paginada', [ListaPaginadaCertificadosController]).as('lista-paginada')
  })
  .prefix('/certificados')
  .prefix('/administrador')
// .middleware('auth')
