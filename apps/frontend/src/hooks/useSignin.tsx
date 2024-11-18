import { useState } from 'react';
import { ISigninData } from '../components/auth/Signin';
import axios from 'axios';
import config from '../config/config';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hook';
import { login, setToken } from '../store/features/user/userSlice';

import { toast } from 'react-toastify';

const useSignin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const signin = async (signinData: ISigninData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${config.SERVER_URL}/user/signin`,
        signinData,
        { withCredentials: true }
      );

      if (data?.success) {
        toast('Signin successfull', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          style: {
            background: 'green',
            color: 'white',
          },
        });
        dispatch(setToken(data?.data?.token));
        dispatch(login(true));
        navigate('/');
      }
      return data;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, signin };
};

export default useSignin;
