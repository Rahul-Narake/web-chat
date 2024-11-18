import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import FriendsSearchbar from '../Friends/FriendsSearchbar';
import MyFriends from '../Friends/MyFriends';
import SelectedUsers from './SelectedUsers';
import { addNewMembers } from '../../store/features/conversation/conversationSlice';

function AddMembers() {
  const { isSearching, searchedFriends } = useAppSelector(
    (state) => state.search
  );
  const { newMembersToAdd, currentConversation } = useAppSelector(
    (state) => state.conversation
  );
  const { friends } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleAddMembers = async () => {
    try {
      setLoading(true);
      const users = newMembersToAdd.map((m) => m.id);
      console.log(users);
      if (users.length === 0 || !currentConversation) {
        return;
      }
      await dispatch(
        addNewMembers({
          membersToAdd: users,
          conversationId: currentConversation.id,
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-12 grid-cols-1 md:py-2 px-4 py-2 relative">
      <div className="flex flex-col md:col-span-8 md:col-start-3 col-span-1 col-start-1 space-y-2 mb-2">
        <FriendsSearchbar />
      </div>
      {newMembersToAdd && newMembersToAdd.length > 0 && (
        <SelectedUsers name="" users={newMembersToAdd} />
      )}
      {isSearching && (
        <div className="flex flex-col md:col-span-8 md:col-start-3 col-span-1 col-start-1 space-y-2 md:h-[70vh] h-[80svh]">
          <MyFriends friends={searchedFriends || []} />
        </div>
      )}
      {!isSearching && (
        <div className="flex flex-col md:col-span-8 md:col-start-3 col-span-1 col-start-1 space-y-2 md:h-[70vh] h-[80svh]">
          <h2>Friends</h2>
          <MyFriends friends={friends || []} />
        </div>
      )}
      <div className="flex flex-col md:col-span-8 md:col-start-3 col-span-1 col-start-1 space-y-2 mt-4">
        <button
          className="bg-blue-500 p-2 rounded-full"
          onClick={handleAddMembers}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default AddMembers;
