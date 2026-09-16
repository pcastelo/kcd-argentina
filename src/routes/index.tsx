import { Navigate, createBrowserRouter } from 'react-router-dom'
import { LocaleLayout } from '@/layouts/LocaleLayout'
import { RootLayout } from '@/layouts/RootLayout'
import { HomePage } from '@/pages/HomePage'
import { HashRedirectPage } from '@/pages/HashRedirectPage'
import { LocationPage } from '@/pages/LocationPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/es" replace />,
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: ':locale',
        element: <LocaleLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'location',
            element: <LocationPage />,
          },
          {
            path: 'organizers',
            element: <HashRedirectPage hash="organizers" />,
          },
          {
            path: 'code-of-conduct',
            element: <HashRedirectPage hash="conduct" />,
          },
        ],
      },
    ],
  },
])
