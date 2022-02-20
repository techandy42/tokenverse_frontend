import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

// declaring the types for account info state
export type AccountInfoState = {
  account: string
  etherBalance: string
  networkId: number
}

const initialState: AccountInfoState = {
  account: '0x0000000000000000000000000000000000000000',
  etherBalance: '0',
  networkId: 0,
}

export const accountInfoSlice = createSlice({
  name: 'accountInfo',
  initialState,
  reducers: {
    updateAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload
    },
    updateEtherBalance: (state, action: PayloadAction<string>) => {
      state.etherBalance = action.payload
    },
    updateNetworkId: (state, action: PayloadAction<number>) => {
      state.networkId = action.payload
    },
  },
})

// export actions from slice
export const { updateAccount, updateEtherBalance, updateNetworkId } =
  accountInfoSlice.actions

// export selector that allows access to actions above
export const selectAccountInfo = (state: RootState) => state.accountInfo

// export slice
export default accountInfoSlice.reducer
