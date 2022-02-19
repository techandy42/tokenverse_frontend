/* The master page of the application that wraps other pages */
/* Provider and ThemeProvider provides the child pages and components with Redux and MUI theme */

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../styles/theme'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
