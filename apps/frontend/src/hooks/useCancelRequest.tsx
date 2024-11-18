import { useState } from 'react';
import { useAppDispatch } from '../store/hook';
import axios from 'axios';
import config from '../config/config';
import { removeFromSentRequests } from '../store/features/user/userSlice';

const useCancelRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const cancelRequest = async (userId: number) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${config.SERVER_URL}/user/cancel`,
        { userId },
        { withCredentials: true }
      );

      if (data?.success) {
        const req = data?.data.friendRequest;
        dispatch(removeFromSentRequests(req));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, cancelRequest };
};

export default useCancelRequest;
