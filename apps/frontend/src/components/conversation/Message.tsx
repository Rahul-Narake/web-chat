import { useAppSelector } from '../../store/hook';
import { IMessage } from '../../types';
import { getHourAndMinute } from '../../utils/getHours';

function Message({
  message,
  fromGroupChat,
}: {
  message: IMessage;
  fromGroupChat: boolean;
}) {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const fromMe = currentUser?.id === Number(message?.senderId);
  const time = getHourAndMinute(message?.createdAt.toString());
  return (
    <div className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex flex-col max-w-xs py-1 px-2 rounded-lg ${
          fromMe ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
        }`}
      >
        {fromGroupChat && (
          <span className="text-[10px] text-gray-50">
            {message?.Sender?.name}
          </span>
        )}
        <span className="">{message?.body}</span>
        <span className="text-[12px] text-end">{time}</span>
      </div>
    </div>
  );
}

export default Message;
