import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import MessageContainer from './MessageContainer';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { SignalingManager } from '../../utils/SinglingManager';
import { IMessage } from '../../types';
import { setMessages } from '../../store/features/conversation/conversationSlice';
import useChatScroll from '../../hooks/useChatScroll';

function ChatContainer() {
  const { currentConversation } = useAppSelector((state) => state.conversation);
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUser && currentConversation) {
      // SignalingManager.getInstance(String(currentUser?.id)).registerCallback(
      //   'newMessage',
      //   (data: IMessage) => {
      //     dispatch(setMessages(data));
      //   },
      //   `Message-${currentConversation?.id}`
      // );
      // SignalingManager.getInstance(String(currentUser?.id)).sendMessage({
      //   method: 'SUBSCRIBE',
      //   params: [`${currentConversation?.id}`],
      // });
      // return () => {
      //   SignalingManager.getInstance(
      //     String(currentUser?.id)
      //   ).deRegisterCallback(
      //     'newMessage',
      //     `Message-${currentConversation?.id}`
      //   );
      //   SignalingManager.getInstance(String(currentUser?.id)).sendMessage({
      //     method: 'UNSUBSCRIBE',
      //     params: [`${currentConversation?.id}`],
      //   });
      // };
    }
  }, [currentConversation?.id, currentUser]);

  return (
    <div className="relative w-full md:h-[97vh] h-full">
      <ChatHeader />
      <MessageContainer />
      <ChatFooter />
    </div>
  );
}

export default ChatContainer;
