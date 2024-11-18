import useChatScroll from '../../hooks/useChatScroll';
import { useAppSelector } from '../../store/hook';
import { IMessage } from '../../types';
import Message from './Message';

function MessageContainer() {
  const { currentConversation, messages } = useAppSelector(
    (state) => state.conversation
  );
  const ref = useChatScroll(
    currentConversation?.messages
  ) as React.MutableRefObject<HTMLDivElement>;

  return (
    <div
      className="absolute w-full top-[50px] h-[82vh] flex flex-col space-y-4 p-2 overflow-y-auto"
      ref={ref}
    >
      {currentConversation &&
        messages.map((msg: IMessage) => {
          return msg ? (
            <Message
              message={msg}
              key={msg?.id}
              fromGroupChat={currentConversation?.isGroupChat}
            />
          ) : (
            <></>
          );
        })}
    </div>
  );
}

export default MessageContainer;
