import { NavLink, useNavigate } from 'react-router-dom';
import { IConversation } from '../../types';
import Avatar from '../UI/Avatar';
import { useAppDispatch } from '../../store/hook';
import { setCurrentConversation } from '../../store/features/conversation/conversationSlice';

function Conversation({
  conversation,
  path,
}: {
  conversation: IConversation;
  path?: string;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <NavLink
      to={`${path}/${conversation?.id}`}
      className={({ isActive }) =>
        isActive
          ? 'w-full flex items-center space-x-2 cursor-pointer hover:bg-gray-500 hover:rounded-full bg-gray-600 px-2 py-1 rounded-full text-slate-200'
          : 'w-full flex items-center space-x-2 cursor-pointer hover:bg-gray-500 hover:rounded-full hover:text-slate-200 px-2 py-1'
      }
      onClick={() => {
        dispatch(setCurrentConversation(conversation));
        navigate(`${path}/${conversation?.id}`);
      }}
    >
      <Avatar url={conversation?.pic} />
      <h3 className="text-lg font-normal">{conversation?.name}</h3>
    </NavLink>
  );
}

export default Conversation;
