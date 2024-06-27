// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const navigation = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    badgeContent: 'new',
    badgeColor: 'error',
    children: [
      {
        title: 'View Price',
        path: '/dashboards/crm'
      },
      {
        title: 'Add Price',
        path: '/dashboards/analytics'
      },
      {
        title: 'eCommerce',
        path: '/dashboards/ecommerce'
      }
    ]
  }
]
mock.onGet('/api/vertical-nav/data').reply(() => {
  return [200, navigation]
})
