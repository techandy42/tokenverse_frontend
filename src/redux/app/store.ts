import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
// import counterReducer from '../features/counterSlice'
import accountInfoReducer from '../features/accountInfoSlice'
import accountDataReducer from '../features/accountDataSlice'

export const store = configureStore({
  reducer: {
    /* counter example */
    // counter: counterReducer,
    accountInfo: accountInfoReducer,
    accountData: accountDataReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
