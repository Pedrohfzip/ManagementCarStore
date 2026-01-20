import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  loading: false,
  imageList: [],
  newPhotos: [], // novas imagens (Files)
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
      state.imageList = Array.isArray(action.payload) ? action.payload : [];
    },
    setNewPhotos(state, action) {
      state.newPhotos = Array.isArray(action.payload) ? action.payload : [];
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setCars, setLoading, setImageList, setNewPhotos, setError } = carsSlice.actions;
export default carsSlice.reducer;
