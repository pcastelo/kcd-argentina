import { Navigate, createBrowserRouter } from 'react-router-dom'
import { LocaleLayout } from '@/layouts/LocaleLayout'
import { RootLayout } from '@/layouts/RootLayout'
import { HomePage } from '@/pages/HomePage'

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
        ],
      },
    ],
  },
])
