import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  user: {},
  isLoading: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = action.payload
    },

    getUser: (state, action) => {
      state.user = action.payload
    },

    getPassword: (state, action) => {
      state.savePassword = action.payload
    },
  },
})

export const authReducer = authSlice.reducer
export const authActions = authSlice.actions
export const authSelector = (state) => state.auth
