import { UsersType } from '@repo/common/SignupData';
import { useAppDispatch } from '../../store/hook';
import {
  addFriendRequest,
  cancelFriendRequest,
  removeFriend,
} from '../../store/features/user/userSlice';

function UserCard({ user }: { user: UsersType }) {
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col space-y-2 shadow-md border border-sky-100 p-2 h-[300px]">
      <div className="w-full flex justify-center items-center">
        <img
          src={
            user?.profile ||
            'https://tse4.mm.bing.net/th?id=OIP.L_582n1UWZbdP084YM1NHAHaHa&pid=Api&P=0&h=180'
          }
          alt={`${user.name}`}
          className="mix-blend-color-blur"
        />
      </div>
      <h2 className="font-semibold">{user.name}</h2>
      <div>
        {user?.isFriend && user.friendRequestSent && (
          <button
            className="w-full rounded-full bg-blue-500 p-2"
            onClick={async () => {
              dispatch(removeFriend(user?.id));
            }}
          >
            Remove Friend
          </button>
        )}
        {!user?.isFriend && !user.friendRequestSent && (
          <button
            className="w-full rounded-full bg-blue-500 p-2"
            onClick={async () => {
              dispatch(addFriendRequest(user?.id));
            }}
          >
            Add Friend
          </button>
        )}
        {!user?.isFriend && user.friendRequestSent && (
          <button
            className="w-full rounded-full bg-blue-500 p-2"
            onClick={async () => {
              dispatch(cancelFriendRequest(user?.id));
            }}
          >
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
