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
  image: string | null
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
      state.email = action.payload.email
      state.address = action.payload.address
      state.companyName = action.payload.companyName
      state.createdAt = action.payload.createdAt
      state.description = action.payload.description
      state.facebookLink = action.payload.facebookLink
      state.image = action.payload.image
      state.instagramLink = action.payload.instagramLink
      state.linkedInLink = action.payload.linkedInLink
      state.mainLink = action.payload.mainLink
      state.twitterLink = action.payload.twitterLink
      state.userName = action.payload.userName
      state.verified = action.payload.verified
      state.verificationDate = action.payload.verificationDate
      state.role = action.payload.role
      state.likedNfts = action.payload.likedNfts
      state.cartNfts = action.payload.cartNfts
    },
  },
})

// export actions from slice
export const { updateAccountData } = accountDataSlice.actions

// export selector that allows access to actions above
export const selectAccountData = (state: RootState) => state.accountData

// export slice
export default accountDataSlice.reducer
