import { createContext, useEffect, useRef } from 'react';
import { isAuthenticated } from '../utils/auth';
import { useAppSelector } from '../store/hook';

interface ISocketContext {
  socket: WebSocket | null;
}

const socketURL = process.env.NEXT_PUBLIC_WEBSOCKT_URL || 'ws://localhost:5001';

const SocketContext = createContext<ISocketContext | undefined>(undefined);

const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const authenticated = isAuthenticated();
  const { isLoggedIn, currentUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (authenticated && isLoggedIn) {
    }
  }, [isLoggedIn]);
  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
