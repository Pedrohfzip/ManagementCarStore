import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import carsReducer from './redux/slices/carsSlice';

export const store = configureStore({
  reducer: {
    cars: carsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
