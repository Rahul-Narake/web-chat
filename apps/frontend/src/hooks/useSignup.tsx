import { SignupType } from '@repo/common/SignupData';
import { useState } from 'react';
import config from '../config/config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hook';
import { login, setToken } from '../store/features/user/userSlice';
const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const signup = async (signupData: SignupType) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${config.SERVER_URL}/user/signup`,
        signupData,
        { withCredentials: true }
      );

      if (data?.success) {
        dispatch(setToken(data?.data?.token));
        dispatch(login(true));
        navigate('/');
      }
      return data;
    } catch (error: any) {
      console.log('error::', error?.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;
