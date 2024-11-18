import { Outlet } from 'react-router-dom';
import Conversations from './Conversations';
import { useEffect, useState } from 'react';
import { setView } from '../../store/features/view/viewSlice';

function Messanger() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    setView(isMobile);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full grid md:grid-cols-12 grid-cols-1">
      <div className="md:flex hidden h-full md:col-span-3 col-span-1 overflow-auto md:border md:border-r-1 md:border-slate-600 ">
        <Conversations path="" />
      </div>
      <div className=" md:flex md:col-span-9 col-span-1 md:h-[100vh] h-svh overflow-auto w-full hidden ">
        <Outlet />
      </div>

      <div className="md:hidden h-full flex flex-col col-span-1 overflow-auto">
        <Conversations path="/msg" />
      </div>
    </div>
  );
}

export default Messanger;
