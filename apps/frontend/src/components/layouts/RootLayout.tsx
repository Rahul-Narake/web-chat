import { useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import useCurrentUser from '../../hooks/useCurrentUser';
import {
  logout,
  login,
  removeToken,
} from '../../store/features/user/userSlice';
import { isAuthenticated } from '../../utils/auth';
import { setView } from '../../store/features/view/viewSlice';
function RootLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const loggedIn = isAuthenticated();
  const windowWidth = useRef(window.innerWidth);
  const isMobileView = windowWidth.current < 768;
  useCurrentUser();
  useEffect(() => {
    if (loggedIn) {
      dispatch(login(true));
    } else {
      dispatch(removeToken());
      dispatch(logout());
      navigate('/signin');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    dispatch(setView(isMobileView));
  }, [windowWidth.current]);

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <div className="relative h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
