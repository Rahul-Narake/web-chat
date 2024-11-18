import useConversations from '../../hooks/useConversations';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import Conversation from './Conversation';
import ConversationSkeleton from '../skeletons/ConversationSkeleton';
import { useEffect } from 'react';
import { SignalingManager } from '../../utils/SinglingManager';
import { IMessage } from '../../types';
import { updateConversations } from '../../store/features/conversation/conversationSlice';

function Conversations({ path }: { path: string }) {
  const { loading } = useConversations();
  const { conversations, currentConversation } = useAppSelector(
    (state) => state.conversation
  );
  const currentUser = useAppSelector((state) => state.user.currentUser);
  let subscriptions: string[] = [];
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (conversations.length > 0 && currentUser) {
      subscriptions = conversations.map((c) => String(c.id));
      SignalingManager.getInstance(String(currentUser?.id)).registerCallback(
        'newMessage',
        (data: IMessage) => {
          alert(JSON.stringify(data));
          dispatch(updateConversations(data));
        },
        `Message-${currentConversation?.id}`
      );
      SignalingManager.getInstance(String(currentUser?.id)).sendMessage({
        method: 'SUBSCRIBE',
        params: subscriptions,
      });
      return () => {
        SignalingManager.getInstance(
          String(currentUser?.id)
        ).deRegisterCallback(
          'newMessage',
          `Message-${currentConversation?.id}`
        );
        SignalingManager.getInstance(String(currentUser?.id)).sendMessage({
          method: 'UNSUBSCRIBE',
          params: subscriptions,
        });
      };
    }
  }, [conversations]);

  return (
    <div className="w-full md:p-2 overflow-auto flex flex-col space-y-2">
      {loading ? (
        <>
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
        </>
      ) : (
        conversations.map((c) => {
          return <Conversation key={c?.id} conversation={c} path={path} />;
        })
      )}
    </div>
  );
}

export default Conversations;
