import axios from 'axios';
import { useEffect, useState } from 'react';
import config from '../config/config';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { isAuthenticated } from '../utils/auth';
import {
  setCurrentUser,
  setFriends,
  setReceivedRequest,
  setSentRequest,
} from '../store/features/user/userSlice';

const useCurrentUser = () => {
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const token = isAuthenticated();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${config.SERVER_URL}/user/current_user`,
          { withCredentials: true }
        );
        return data?.data;
      } catch (error) {
        console.log(error);
        return null;
      } finally {
        setLoading(false);
      }
    };
    if (token && isLoggedIn) {
      getCurrentUser()
        .then((data) => {
          if (data) {
            dispatch(setCurrentUser(data));
            dispatch(setSentRequest(data?.friendRequestsSent));
            dispatch(setReceivedRequest(data?.friendRequestsReceived));
            dispatch(setFriends(data?.friends));
          }
        })
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn]);
  return { loading };
};

export default useCurrentUser;
