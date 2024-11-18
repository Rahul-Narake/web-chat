import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { useEffect, useState } from 'react';
import {
  setSearchedFriends,
  setSearching,
} from '../../store/features/search/searchSlice';
import { User } from '../../types';

function FriendsSearchbar() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [value, setValue] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (value) {
      dispatch(setSearching(true));
      const data = searchUsers(value);
      if (data) {
        dispatch(setSearchedFriends(data));
      }
    } else {
      dispatch(setSearching(false));
    }
  }, [value]);

  function searchUsers(searchValue: string): User[] | undefined {
    // Normalize the search value to lower case
    const lowerCaseSearchValue = searchValue.toLowerCase();

    return currentUser?.friends.filter((user) => {
      return (
        user.name.toLowerCase().includes(lowerCaseSearchValue) ||
        (user.username &&
          user.username.toLowerCase().includes(lowerCaseSearchValue))
      );
    });
  }

  return (
    <div className="flex w-full h-[50px] border border-slate-600 rounded-full py-2 px-4 items-center">
      <span>
        <ArrowLeft />
      </span>
      <input
        type="text"
        className="w-full h-full p-2 border rounded border-none outline-none"
        placeholder="search by name or username..."
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}

export default FriendsSearchbar;
