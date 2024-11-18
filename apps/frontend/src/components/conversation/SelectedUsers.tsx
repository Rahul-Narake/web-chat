import { X } from 'lucide-react';
import { removeFromSelectedUserForNewGroup } from '../../store/features/user/userSlice';
import { useAppDispatch } from '../../store/hook';
import { User } from '../../types';
import Avatar from '../UI/Avatar';
import { removeFromNewMembers } from '../../store/features/conversation/conversationSlice';

function SelectedUsers({ name, users }: { name: string; users?: User[] }) {
  const dispatch = useAppDispatch();
  const path = window.location.pathname;

  return (
    <div className="flex flex-col md:col-span-8 md:col-start-3 w-full">
      {name && <h3>{name}</h3>}
      {users && users.length > 0 && (
        <div
          className={`flex flex-row md:col-span-8 md:col-start-3 col-span-1 col-start-1 w-full overflow-auto space-x-2 mb-2`}
        >
          {users.map((friend: User) => (
            <div
              key={friend?.id}
              className="flex flex-col p-1 border border-slate-300 rounded-md relative"
            >
              <div className="flex justify-center items-center ">
                <Avatar url={friend?.profile} />
              </div>
              <h3>{friend.name}</h3>

              <X
                className="absolute top-0 right-0 cursor-pointer"
                size={20}
                onClick={() => {
                  if (path === '/newGroup') {
                    if (users.includes(friend))
                      dispatch(removeFromSelectedUserForNewGroup(friend));
                  } else if (path === '/add-members') {
                    dispatch(removeFromNewMembers(friend));
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectedUsers;
