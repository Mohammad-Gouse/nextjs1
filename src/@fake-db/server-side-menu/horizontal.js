// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const navigation = [
  {
    icon: 'mdi:home-outline',
    title: 'Dashboards',
    children: [
      {
        icon: 'mdi:chart-donut',
        title: 'CRM',
        path: '/dashboards/crm'
      },
      {
        icon: 'mdi:chart-timeline-variant',
        title: 'Analytics',
        path: '/dashboards/analytics'
      },
      {
        icon: 'mdi:cart-outline',
        title: 'eCommerce',
        path: '/dashboards/ecommerce'
      }
    ]
  },
  
]
mock.onGet('/api/horizontal-nav/data').reply(() => {
  return [200, navigation]
})
