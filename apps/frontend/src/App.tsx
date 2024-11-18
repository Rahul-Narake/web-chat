import { Route, Navigate, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import RootLayout from './components/layouts/RootLayout';
import { isAuthenticated } from './utils/auth';
import { useAppDispatch, useAppSelector } from './store/hook';
import { useEffect, useRef } from 'react';
import { login, logout } from './store/features/user/userSlice';
import Messanger from './components/conversation/Messanger';
import ChatContainer from './components/conversation/ChatContainer';
import { setView } from './store/features/view/viewSlice';
import AllUsers from './components/Friends/AllUsers';
import NewGroup from './components/conversation/NewGroup';
import CreateGroup from './components/conversation/CreateGroup';
import RequestLayout from './components/layouts/RequestLayout';
import MyFriends from './components/Friends/MyFriends';
import RequestReceived from './components/Friends/RequestReceived';
import RequestSent from './components/Friends/RequestSent';
import ViewConversation from './components/conversation/ViewConversation';
import AddMembers from './components/conversation/AddMembers';
import ChangeProfileForm from './components/conversation/ChangeProfileForm';

function App() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const dispatch = useAppDispatch();
  const token = isAuthenticated();
  const windowWidth = useRef(window.innerWidth);
  const isMobileView = windowWidth.current < 768;
  const friends = useAppSelector((state) => state.user.friends);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      dispatch(login(true));
    } else {
      dispatch(logout());
      navigate('/signin');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    dispatch(setView(isMobileView));
  }, [windowWidth.current]);
  return (
    <Routes>
      <Route
        path="/signup"
        element={!isLoggedIn ? <Signup /> : <Navigate to={'/'} />}
      />
      <Route
        path="/signin"
        element={!isLoggedIn ? <Signin /> : <Navigate to={'/'} />}
      />
      <Route path="/" element={<RootLayout />}>
        <Route path="" element={<Messanger />}>
          <Route path=":conversationId" element={<ChatContainer />} />
        </Route>
        <Route path="msg/:conversationId" element={<ChatContainer />} />
        <Route path="users" element={<AllUsers />} />
        <Route path="newGroup" element={<NewGroup />} />
        <Route path="create-group" element={<CreateGroup />} />
        <Route path="friends" element={<RequestLayout />}>
          <Route path="my" element={<MyFriends friends={friends} />} />
          <Route path="sent" element={<RequestSent />} />
          <Route path="received" element={<RequestReceived />} />
        </Route>
        <Route
          path="conversation/:conversationId"
          element={<ViewConversation />}
        />
        <Route
          path="conversation/:conversationId/change-profile"
          element={<ChangeProfileForm />}
        />
        <Route path="add-members" element={<AddMembers />} />
      </Route>
    </Routes>
  );
}

export default App;
