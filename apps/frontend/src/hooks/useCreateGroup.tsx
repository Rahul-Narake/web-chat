import { GroupChatType } from '@repo/common/SignupData';
import axios from 'axios';
import { useState } from 'react';
import config from '../config/config';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { setCurrentConversation } from '../store/features/conversation/conversationSlice';

const useCreateGroup = () => {
  const [loading, setLoading] = useState(false);
  const isMobileView = useAppSelector((state) => state.view.isMobileView);
  const {} = useAppSelector((state) => state.conversation);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const createGroup = async (withPic: boolean, groupData: GroupChatType) => {
    try {
      setLoading(true);
      if (withPic) {
      } else {
        const { data } = await axios.post(
          `${config.SERVER_URL}/conversation/groupchat`,
          groupData,
          { withCredentials: true }
        );
        if (data?.success) {
          dispatch(setCurrentConversation(data?.data));
          if (isMobileView) {
            navigate(`/msg/${data?.data?.id}`);
          } else {
            navigate(`/${data?.data?.id}`);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const createGroupWithPic = async (formData: FormData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${config.SERVER_URL}/conversation/groupwithpic`,
        formData,
        { withCredentials: true }
      );
      console.log(data);
      if (data?.success) {
        dispatch(setCurrentConversation(data?.data));
        if (isMobileView) {
          navigate(`/msg/${data?.data?.id}`);
        } else {
          navigate(`/${data?.data?.id}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return { loading, createGroup, createGroupWithPic };
};

export default useCreateGroup;
