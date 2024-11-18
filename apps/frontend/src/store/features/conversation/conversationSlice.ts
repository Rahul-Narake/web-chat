import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConversation, IMessage, User } from '../../../types';
import axios from 'axios';
import config from '../../../config/config';
import { GroupChatType } from '@repo/common/SignupData';

type ConversationStateType = {
  conversations: IConversation[];
  currentConversation: IConversation | null;
  messages: IMessage[];
  newMembersToAdd: User[];
};

const initialState: ConversationStateType = {
  conversations: [],
  currentConversation: null,
  messages: [],
  newMembersToAdd: [],
};

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<IConversation[]>) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (state, action: PayloadAction<IConversation>) => {
      state.currentConversation = action.payload;
      state.messages = state.currentConversation.messages;
    },
    setMessages: (state, action: PayloadAction<IMessage>) => {
      state.messages = [...state.messages, action.payload];
    },
    updateConversations: (state, action: PayloadAction<IMessage>) => {
      state.conversations = state.conversations.map((c) => {
        if (c.id === action.payload.conversationId) {
          if (c.id === state.currentConversation?.id) {
            setCurrentConversation({
              ...c,
              messages: [...c.messages, action.payload],
            });
            state.messages = [...c.messages, action.payload];
          }
          return { ...c, messages: [...c.messages, action.payload] };
        } else {
          return c;
        }
      });
    },
    addNewMembersToGroup: (state, action: PayloadAction<User>) => {
      const currentMembers = state.currentConversation?.users?.map((u) => u.id);
      if (currentMembers?.includes(action.payload?.id)) {
        alert('user is already member of group');
      } else {
        state.newMembersToAdd = [...state.newMembersToAdd, action.payload];
      }
    },
    removeFromNewMembers: (state, action: PayloadAction<User>) => {
      state.newMembersToAdd = state.newMembersToAdd.filter(
        (member) => member?.id !== action.payload.id
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      if (action.payload.success) {
      }
    });
    builder.addCase(createNewGroup.fulfilled, (state, action) => {
      if (action.payload.success) {
      }
    });
    builder.addCase(addNewMembers.fulfilled, (state, action) => {
      if (action?.payload.success) {
        state.conversations = state.conversations.map((c) => {
          if (c.id === action.payload.data?.conversationId) {
            return { ...c, users: action.payload.members };
          } else {
            return c;
          }
        });
      }
      alert('users added successfully');
    });
  },
});

export const sendMessage = createAsyncThunk(
  'conversation/sendMessage',
  async (messageData: { body: string; conversationId: number }) => {
    try {
      const { data } = await axios.post(
        `${config.SERVER_URL}/conversation/send`,
        messageData,
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createNewGroup = createAsyncThunk(
  'conversation/createNewGroup',
  async (groupData: GroupChatType) => {
    try {
      const { data } = await axios.post(
        `${config.SERVER_URL}/conversation/groupchat`,
        groupData,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addNewMembers = createAsyncThunk(
  'conversation/addNewMembers',
  async ({
    membersToAdd,
    conversationId,
  }: {
    membersToAdd: number[];
    conversationId: number;
  }) => {
    try {
      const { data } = await axios.put(
        `${config.SERVER_URL}/conversation/add-members`,
        { users: membersToAdd, conversationId },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const {
  setConversations,
  setCurrentConversation,
  setMessages,
  updateConversations,
  addNewMembersToGroup,
  removeFromNewMembers,
} = conversationSlice.actions;

export default conversationSlice.reducer;
