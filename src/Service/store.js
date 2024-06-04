import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice';
import TopbuttonsSlice from './TopbuttonsSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    topbutton :TopbuttonsSlice
  },
});

export default store;
