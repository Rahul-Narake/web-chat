import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface ViewState {
  isMobileView: boolean;
}

// Define the initial state using that type
const initialState: ViewState = {
  isMobileView: false,
};

export const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<boolean>) => {
      state.isMobileView = action.payload;
    },
  },
});

export const { setView } = viewSlice.actions;

export default viewSlice.reducer;
