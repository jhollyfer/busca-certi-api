/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const CertificateListPaginatedController = () =>
  import('#controllers/administrador/certificate-list-paginated.controller')
const HomeCertificateListPaginatedController = () =>
  import('#controllers/certificates/list-paginated.controller')
const AdministratorDashboardStatusController = () =>
  import('#controllers/administrador/certificate-dashboard-stats')
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    mensagem: 'Bem vindo ao sistema de busca de certificados',
  }
})

router
  .get('/certificates', [HomeCertificateListPaginatedController])
  .as('certificate-list-paginated')

router
  .group(() => {
    router
      .get('/dashboard', [AdministratorDashboardStatusController])
      .as('administrator-dashboard-stats')
  })
  .prefix('/administrador')

router
  .group(() => {
    router
      .get('/paginated', [CertificateListPaginatedController])
      .as('administrator-certificate-list-paginated')
  })
  .prefix('/certificados')
  .prefix('/administrador')
// .middleware('auth')
