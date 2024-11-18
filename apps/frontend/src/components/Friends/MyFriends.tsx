import React from 'react';
import { User } from '../../types';
import FriendCard from './FriendCard';

function MyFriends({ friends }: { friends?: User[] }) {
  return (
    <div className="flex flex-col space-y-2 h-full overflow-auto">
      {friends && friends?.length === 0 && (
        <h2>You don't have any friends yet</h2>
      )}
      {friends &&
        friends?.length !== 0 &&
        friends?.map((friend) => (
          <FriendCard friend={friend} key={friend.id} />
        ))}
    </div>
  );
}

export default React.memo(MyFriends);
