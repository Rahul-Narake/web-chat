import { useEffect, useState } from 'react';
import { IConversation } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import config from '../config/config';
import { setConversations } from '../store/features/conversation/conversationSlice';

const useConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversation] = useState<IConversation[]>([]);
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const getConversations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${config.SERVER_URL}/conversation`, {
        withCredentials: true,
      });
      if (data?.success) {
        dispatch(setConversations(data?.data));
        setConversation(data?.data);
      }
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getConversations();
    }
  }, []);
  return { loading, conversations };
};

export default useConversations;
