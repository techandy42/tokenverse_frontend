// remove if not needed

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

// declaring the types for account info state
export type CollectionsState = {
  collections: any[]
}

const initialState: CollectionsState = {
  collections: new Array(),
}

export const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    updateCollections: (state, action: PayloadAction<any[]>) => {
      state.collections = action.payload
    },
  },
})

// export actions from slice
export const { updateCollections } = collectionsSlice.actions

// export selector that allows access to actions above
export const selectAccountInfo = (state: RootState) => state.collections

// export slice
export default collectionsSlice.reducer
