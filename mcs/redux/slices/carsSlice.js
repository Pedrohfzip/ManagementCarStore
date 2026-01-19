import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  loading: false,
  imageList: [],
  error: null,
};

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCars(state, action) {
      state.list = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setImageList(state, action) {
      // Acumula as fotos no array
      state.imageList = [...state.imageList, ...action.payload];
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setCars, setLoading, setImageList, setError } = carsSlice.actions;
export default carsSlice.reducer;
