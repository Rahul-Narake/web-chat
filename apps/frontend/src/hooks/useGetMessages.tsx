import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import config from '../config/config';
import { setMessages } from '../store/features/conversation/conversationSlice';

const useMessages = () => {
  const [loading, setLoading] = useState(false);
  const currentConversation = useAppSelector(
    (state) => state.conversation.currentConversation
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${config.SERVER_URL}/conversation/messages/${currentConversation?.id}`,
          { withCredentials: true }
        );
        if (data?.success) dispatch(setMessages(data.data?.messages));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentConversation) getMessages();
  }, [currentConversation?.id]);

  return { loading };
};

export default useMessages;
