import { useAppSelector } from '../../store/hook';
import FriendsSearchbar from '../Friends/FriendsSearchbar';
import MyFriends from '../Friends/MyFriends';
import { useNavigate } from 'react-router-dom';
import SelectedUsers from './SelectedUsers';

function NewGroup() {
  const { isSearching, searchedFriends } = useAppSelector(
    (state) => state.search
  );
  const { selectedUsersForNewGroup } = useAppSelector((state) => state.user);
  const { friends } = useAppSelector((state) => state.user);

  const navigate = useNavigate();
  return (
    <div className="grid md:grid-cols-12 grid-cols-1 md:py-2 px-4 py-2 relative">
      <div className="flex flex-col md:col-span-8 md:col-start-3 col-span-1 col-start-1 space-y-2 mb-2">
        <FriendsSearchbar />
      </div>
      {selectedUsersForNewGroup && selectedUsersForNewGroup.length > 0 && (
        <SelectedUsers name="" users={selectedUsersForNewGroup} />
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
          onClick={() => {
            if (selectedUsersForNewGroup.length > 0) navigate('/create-group');
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default NewGroup;
