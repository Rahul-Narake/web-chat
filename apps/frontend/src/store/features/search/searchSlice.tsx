import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types';

// Define a type for the slice state
interface SearchState {
  isSearching: boolean;
  searchedFriends: User[];
}

// Define the initial state using that type
const initialState: SearchState = {
  isSearching: false,
  searchedFriends: [],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setSearchedFriends: (state, action: PayloadAction<User[]>) => {
      state.searchedFriends = action.payload;
    },
  },
});

export const { setSearching, setSearchedFriends } = searchSlice.actions;

export default searchSlice.reducer;
