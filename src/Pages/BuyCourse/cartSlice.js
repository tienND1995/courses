import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  product: {},
}

const cartSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    productName: (state, action) => {
      state.product = action.payload
    },
  },
})

export const cartReducer = cartSlice.reducer
export const cartActions = cartSlice.actions
export const cartSelector = (state) => state.cart
