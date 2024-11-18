import { useState } from 'react';
import { useAppDispatch } from '../store/hook';
import axios from 'axios';
import config from '../config/config';
import {
  addFriend,
  removeFromReceivedRequests,
} from '../store/features/user/userSlice';

const useAcceptRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const acceptRequest = async (userId: number) => {
    try {
      const { data } = await axios.post(
        `${config.SERVER_URL}/user/accept`,
        { userId },
        { withCredentials: true }
      );

      if (data?.success) {
        const req = data?.data.friendRequest;
        dispatch(removeFromReceivedRequests(req));
        dispatch(addFriend(req?.sender));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { loading, acceptRequest };
};

export default useAcceptRequest;
