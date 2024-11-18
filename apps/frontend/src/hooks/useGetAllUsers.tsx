import { UsersType } from '@repo/common/SignupData';
import axios from 'axios';
import { useEffect, useState } from 'react';
import config from '../config/config';
import { useAppDispatch } from '../store/hook';
import { setAllUsers } from '../store/features/user/userSlice';

const useGetAllUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, SetUsers] = useState<UsersType[] | []>([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axios.get(`${config.SERVER_URL}/user/`, {
          withCredentials: true,
        });
        if (data?.success) {
          SetUsers(data?.data?.users);
          dispatch(setAllUsers(data?.data?.users));
        }
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  return { loading, users };
};

export default useGetAllUsers;
