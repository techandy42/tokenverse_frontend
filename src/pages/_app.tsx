/* The master page of the application that wraps other pages */
/* Provider and ThemeProvider provides the child pages and components with Redux and MUI theme */

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../styles/theme'
import { Provider } from 'react-redux'
import { store } from '../redux/app/store'
import Main from '../components/Main'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Main>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Main>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
