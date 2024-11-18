import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  ICurrentUser,
  RequestReceived,
  RequestSent,
  User,
} from '../../../types';
import axios from 'axios';
import config from '../../../config/config';
import { UsersType } from '@repo/common/SignupData';

// Define a type for the slice state
interface UserState {
  isLoggedIn: boolean;
  currentUser: ICurrentUser | null;
  allUsers: UsersType[];
  selectedUsersForNewGroup: User[];
  requestsSent: RequestSent[];
  requestsReceived: RequestReceived[];
  friends: User[];
}

// Define the initial state using that type
const initialState: UserState = {
  isLoggedIn: false,
  currentUser: null,
  allUsers: [],
  selectedUsersForNewGroup: [],
  requestsReceived: [],
  requestsSent: [],
  friends: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      localStorage.setItem('token', action.payload);
    },
    removeToken: () => {
      localStorage.removeItem('token');
    },
    setCurrentUser: (state, action: PayloadAction<ICurrentUser | null>) => {
      state.currentUser = action.payload;
    },
    setAllUsers: (state, action: PayloadAction<UsersType[] | []>) => {
      if (action.payload) {
        state.allUsers = action.payload;
      }
    },
    addToSelectedUserForNewGroup: (state, action: PayloadAction<User>) => {
      state.selectedUsersForNewGroup = [
        ...state.selectedUsersForNewGroup,
        action.payload,
      ];
    },
    removeFromSelectedUserForNewGroup: (state, action: PayloadAction<User>) => {
      const users = state.selectedUsersForNewGroup;
      state.selectedUsersForNewGroup = users.filter(
        (u) => u.id !== action.payload.id
      );
    },

    addToSentRequests: (state, action: PayloadAction<RequestSent>) => {
      state.requestsSent = [...state.requestsSent, action.payload];
    },
    removeFromSentRequests: (state, action: PayloadAction<RequestSent>) => {
      state.requestsSent = state.requestsSent.filter(
        (req) => req.id !== action.payload.id
      );
    },
    addToReceivedRequests: (state, action: PayloadAction<RequestReceived>) => {
      state.requestsReceived = [...state.requestsReceived, action.payload];
    },
    removeFromReceivedRequests: (
      state,
      action: PayloadAction<RequestReceived>
    ) => {
      state.requestsReceived = state.requestsReceived.filter(
        (req) => req.id !== action.payload.id
      );
    },
    setSentRequest: (state, action: PayloadAction<RequestSent[]>) => {
      state.requestsSent = action.payload;
    },
    setReceivedRequest: (state, action: PayloadAction<RequestReceived[]>) => {
      state.requestsReceived = action.payload;
    },
    setFriends: (state, action: PayloadAction<User[]>) => {
      state.friends = action.payload;
    },
    removeFromFriend: (state, action: PayloadAction<User>) => {
      state.friends = state.friends.filter(
        (friend) => friend.id !== action.payload.id
      );
    },
    addFriend: (state, action: PayloadAction<User>) => {
      state.friends = [...state.friends, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state, action) => {
      if (action.payload.success) {
        localStorage.removeItem('token');
        state.isLoggedIn = false;
      }
    });
    builder.addCase(addFriendRequest.fulfilled, (state, action) => {
      const data = action.payload;
      if (data?.success) {
        const id = action.payload.data.userId as number;
        const request = action.payload.data.friendRequest;

        const users = state.allUsers;
        state.allUsers = users.map((u) => {
          if (u.id === id) {
            return { ...u, friendRequestSent: true };
          }
          return u;
        });
        state.requestsSent = [...state.requestsSent, request];
      }
    });
    builder.addCase(cancelFriendRequest.fulfilled, (state, action) => {
      const data = action.payload;
      if (data?.success) {
        const id = action.payload.data.userId as number;
        const request = action.payload.data?.friendRequest;
        const users = state.allUsers;
        state.allUsers = users.map((u) => {
          if (u.id === id) {
            return { ...u, friendRequestSent: false };
          }
          return u;
        });
        removeFromSentRequests(request);
      }
    });
    builder.addCase(removeFriend.fulfilled, (state, action) => {
      const data = action.payload;
      if (data?.success) {
        const id = action.payload.data.userId as number;
        const users = state.allUsers;
        state.allUsers = users.map((u) => {
          if (u.id === id) {
            return { ...u, friendRequestSent: false, isFriend: false };
          }
          return u;
        });
        state.friends = state.friends.filter((friend) => friend.id !== id);
      }
    });
  },
});

export const logout = createAsyncThunk('user/logout', async () => {
  try {
    const { data } = await axios.get(`${config.SERVER_URL}/user/logout`);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
});

export const addFriendRequest = createAsyncThunk(
  'user/addFriendRequest',
  async (receiverId: number) => {
    try {
      const { data } = await axios.post(
        `${config.SERVER_URL}/user/add`,
        { receiverId },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
);
export const cancelFriendRequest = createAsyncThunk(
  'user/cancelFriendRequest',
  async (receiverId: number) => {
    try {
      const { data } = await axios.post(
        `${config.SERVER_URL}/user/cancel`,
        { userId: receiverId },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
);
export const removeFriend = createAsyncThunk(
  'user/removeFriend',
  async (receiverId: number) => {
    try {
      const { data } = await axios.post(
        `${config.SERVER_URL}/user/remove`,
        { userId: receiverId },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
);

export const {
  login,
  setToken,
  removeToken,
  setCurrentUser,
  setAllUsers,
  addToSelectedUserForNewGroup,
  removeFromSelectedUserForNewGroup,
  addToReceivedRequests,
  addToSentRequests,
  removeFromReceivedRequests,
  removeFromSentRequests,
  setReceivedRequest,
  setSentRequest,
  setFriends,
  addFriend,
  removeFromFriend,
} = userSlice.actions;

export default userSlice.reducer;
