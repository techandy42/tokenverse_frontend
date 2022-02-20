import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

// declaring the types for account data state
export type AccountDataState = {
  email: string
  address: string
  companyName: string
  createdAt: Date
  description: string
  facebookLink: string
  image: JSON | null
  instagramLink: string
  linkedInLink: string
  mainLink: string
  twitterLink: string
  userName: string
  verified: boolean
  verificationDate: Date
  role: UserRole
  likedNfts: number[]
  cartNfts: number[]
}

const initialState: AccountDataState = {
  email: '',
  address: '0x0000000000000000000000000000000000000000',
  companyName: '',
  createdAt: new Date(0, 0, 0, 0, 0, 0),
  description: '',
  facebookLink: '',
  image: null,
  instagramLink: '',
  linkedInLink: '',
  mainLink: '',
  twitterLink: '',
  userName: '',
  verified: false,
  verificationDate: new Date(0, 0, 0, 0, 0, 0),
  role: UserRole.USER,
  likedNfts: new Array(),
  cartNfts: new Array(),
}

export const accountDataSlice = createSlice({
  name: 'accountData',
  initialState,
  reducers: {
    updateAccountData: (state, action: PayloadAction<AccountDataState>) => {
      state = action.payload
    },
  },
})

// export actions from slice
export const { updateAccountData } = accountDataSlice.actions

// export selector that allows access to actions above
export const selectAccountData = (state: RootState) => state.accountData

// export slice
export default accountDataSlice.reducer
