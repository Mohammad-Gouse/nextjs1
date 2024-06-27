import { useAuth } from 'src/hooks/useAuth'

const navigation = () => {
  const authContext = useAuth()
  const { roleBasedAccess } = authContext
  console.log({ roleBasedAccess })

  const userRole = roleBasedAccess?.role || 'guest' // Assuming 'guest' as a default role

  let navItems = [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      children: [
        {
          title: 'View Price',
          path: '/view-price'
        },
        {
          title: 'User Input Price',
          path: '/add-price'
        },
        // {
        //   title: 'Admin Input Price',
        //   path: '/admin-dashboard'
        // },
        // {
        //   title: 'Configuration',
        //   path: '/configuration'
        // }
      ]
    }
  ]

  const userRoles = window.localStorage.getItem('roles')
  console.log(userRoles)
  if (userRoles?.includes("admin")) {
    navItems[0].children.push(
      {
        title: 'Admin Input Price',
        path: '/admin-dashboard'
      },
      {
        title: 'Configuration',
        path: '/configuration'
      })
  }

  return filterNavigationByRole(navItems, userRole)
}

const filterNavigationByRole = (navItems, userRole) => {
  return navItems
    .map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child => !child.roles || child.roles.includes(userRole))
        return { ...item, children: filteredChildren }
      }
      return item
    })
    .filter(item => !item.children || item.children.length > 0)
}

export default navigation
