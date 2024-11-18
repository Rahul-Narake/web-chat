import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import conversationSlice from './features/conversation/conversationSlice';
import viewSlice from './features/view/viewSlice';
import searchSlice from './features/search/searchSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    conversation: conversationSlice,
    view: viewSlice,
    search: searchSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
