import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import ICollection from '../../../interfaces/schema/ICollection'

// declaring the types for account info state
export type CollectionsState = {
  collections: ICollection[]
}

export interface ICollectionUpdateData {
  name: string
  image: string | null
  description: string
  originalName: string
}

export const initialState: CollectionsState = {
  collections: new Array(),
}

export const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    updateCollections: (state, action: PayloadAction<ICollection[]>) => {
      state.collections = action.payload
    },
    updateOneCollection: (
      state,
      action: PayloadAction<ICollectionUpdateData>,
    ) => {
      for (const collection of state.collections) {
        if (collection.name === action.payload.originalName) {
          collection.name = action.payload.name
          collection.image = action.payload.image
          collection.description = action.payload.description
        }
      }
    },
  },
})

// export actions from slice
export const { updateCollections, updateOneCollection } =
  collectionsSlice.actions

// export selector that allows access to actions above
export const selectCollections = (state: RootState) => state.collections

// export slice
export default collectionsSlice.reducer
