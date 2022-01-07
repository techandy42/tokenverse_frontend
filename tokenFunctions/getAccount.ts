import Web3 from 'web3'

export interface IAccountInfo {
  accountAddress: string
  etherBalance: string
  errorMessage: string | null
}

const getAccount = async () => {
  let accountInfo: IAccountInfo = {
    accountAddress: '',
    etherBalance: '',
    errorMessage: null,
  }
  if (typeof window.ethereum === 'undefined') {
    accountInfo.errorMessage = 'MetaMask not installed'
  }

  if (typeof window.ethereum !== 'undefined') {
    // Instance web3 with the provided information
    const web3 = new Web3(window.ethereum)
    try {
      // Request account access
      await window.ethereum.enable()
      const accounts = await web3.eth.getAccounts()
      const account = accounts[0]
      const weiBalance = await web3.eth.getBalance(account)
      const etherBalance = await web3.utils.fromWei(weiBalance, 'ether')
      accountInfo.accountAddress = account
      accountInfo.etherBalance = etherBalance
    } catch (e) {
      // User denied access
      accountInfo.errorMessage = 'User denied access to MetaMask account'
    }
    return accountInfo
  }
}

export default getAccount
