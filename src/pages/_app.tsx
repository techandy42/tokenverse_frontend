/* The master page of the application that wraps other pages */
/* Provider and ThemeProvider provides the child pages and components with Redux and MUI theme */

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../styles/theme'
import { Provider } from 'react-redux'
import { store } from '../redux/app/store'
import { useEffect } from 'react'

import Web3 from 'web3'

function MyApp({ Component, pageProps }: AppProps) {
  // handle all account related code
  /*
  useEffect(() => {
    const fetchAccount = async () => {
      // send account to redux
      const account = await getAccount()
      console.log(account)
      // add the account to back-end if it doesn't exist
    }
    fetchAccount()
  }, [])
  */

  useEffect(() => {
    window.addEventListener('load', async function () {
      if (window.ethereum) {
        // use MetaMask's provider
        const web3 = new Web3(window.ethereum)
        window.ethereum.enable() // get permission to access accounts

        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        const weiBalance = await web3.eth.getBalance(account)
        const etherBalance = await web3.utils.fromWei(weiBalance, 'ether')
        const networkId = await web3.eth.net.getId()

        // prints current info to console
        console.log('account: ', account)
        console.log('current ether balance: ', etherBalance)
        console.log('networkId: ', networkId)

        // detect Metamask account change
        window.ethereum.on('accountsChanged', async function (accounts: any) {
          const account = accounts[0]
          const weiBalance = await web3.eth.getBalance(account)
          const etherBalance = await web3.utils.fromWei(weiBalance, 'ether')

          // prints changed account info to console
          console.log('account changed: ', account)
          console.log('current ether balance: ', etherBalance)
        })

        // detect Network account change
        window.ethereum.on('networkChanged', function (networkId: any) {
          // prints changed network info to console
          console.log('networkId changed: ', networkId)
        })
      } else {
        console.warn(
          'No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live',
        )
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        const web3 = new Web3(
          new Web3.providers.HttpProvider('http://127.0.0.1:7545'),
        )
      }
    })
  }, [])

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
