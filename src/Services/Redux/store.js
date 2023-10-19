import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../../Pages/Auth/authSlice'
import { cartReducer } from '../../Pages/BuyCourse/cartSlice'

const rootReducer = {
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
}

export const store = configureStore(rootReducer)
