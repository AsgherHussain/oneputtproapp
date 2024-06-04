import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  sessionId: 0,
  topbuttonvalue: 0,
  selectedbutton: 0,
};

const TopbuttonSlice = createSlice({
  name: 'topbutton',
  initialState,
  reducers: {
    setSessionid: (state, action) => {
      state.sessionId = action.payload;
    },
    setTopbuttonValue: (state, action) => {
      state.topbuttonvalue = action.payload;
    },
    setSelectedButton:(state,action)=>{
      state.selectedbutton = action.payload
    },
    cleartopbuttons: (state) => {
      state.sessionId = initialState.sessionId;
      state.topbuttonvalue = initialState.topbuttonvalue;
      state.selectedbutton = initialState.selectedbutton;
    },
  },
});

export const {setSessionid, setTopbuttonValue,setSelectedButton, cleartopbuttons} =
  TopbuttonSlice.actions;
export const getsessionId = state => state.topbutton.sessionId;
export const gettopbuttonvalue = state => state.topbutton.topbuttonvalue;

export default TopbuttonSlice.reducer;
