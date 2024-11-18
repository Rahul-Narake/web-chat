import axios from 'axios';
import { useState } from 'react';
import { useAppDispatch } from '../store/hook';
import config from '../config/config';
import { removeFromReceivedRequests } from '../store/features/user/userSlice';

const useRejectRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const rejectRequest = async (userId: number) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${config.SERVER_URL}/user/reject`,
        { userId },
        { withCredentials: true }
      );

      if (data?.success) {
        const req = data?.data.friendRequest;
        dispatch(removeFromReceivedRequests(req));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, rejectRequest };
};

export default useRejectRequest;
