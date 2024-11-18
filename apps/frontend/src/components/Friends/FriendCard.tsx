import React, { useRef } from 'react';
import Avatar from '../UI/Avatar';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { addToSelectedUserForNewGroup } from '../../store/features/user/userSlice';
import { User } from '../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { addNewMembersToGroup } from '../../store/features/conversation/conversationSlice';

function FriendCard({ friend }: { friend: User }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const windowWidth = useRef(window.innerWidth);
  const isMobileView = windowWidth.current < 768;
  const selectedUsersForNewGroup = useAppSelector(
    (state) => state.user.selectedUsersForNewGroup
  );
  const handleCreateChat = async () => {
    try {
      const { data } = await axios.post(
        `${config.SERVER_URL}/conversation/normalchat`,
        { receiverId: friend?.id },
        { withCredentials: true }
      );

      if (data?.success) {
        if (isMobileView) {
          navigate(`/msg/${data?.data.id}`);
        } else {
          navigate(`/${data?.data.id}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="flex space-x-2 items-center bg-gray-300 shadow-sm p-2 rounded-full cursor-pointer"
      onClick={() => {
        if (path === '/newGroup') {
          if (!selectedUsersForNewGroup.includes(friend))
            dispatch(addToSelectedUserForNewGroup(friend));
        } else if (path === '/friends/my') {
          handleCreateChat();
        } else if (path === '/add-members') {
          dispatch(addNewMembersToGroup(friend));
        }
      }}
    >
      <div className="flex items-center justify-center">
        <Avatar url={friend?.profile} />
      </div>
      <h2>{friend?.name}</h2>
    </div>
  );
}

export default React.memo(FriendCard);
