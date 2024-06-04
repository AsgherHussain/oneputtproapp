import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: '',
  character: '',
  decodeData: null,
  macAddress: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    setCharacteristcs: (state, action) => {
      state.isAuthenticated = false;
      state.character = action.payload;
    },
   
    setDecodeData: (state, action) => {
      state.isAuthenticated = false;
      state.decodeData = action.payload;
    },
    setMacAddress: (state, action) => {
      state.isAuthenticated = false;
   
      state.macAddress = action.payload;
    }
  },
});

export const {setUser, setCharacteristcs, setDecodeData,setMacAddress} = authSlice.actions;
export const selectUser = state => state.auth.user;
export const selectDecodedData = state => state.auth.decodeData;
export const selectCharacter = state => state.auth.character;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectMacAddress = state => state.auth.macAddress;

export default authSlice.reducer;
