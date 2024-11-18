import { NavLink, Outlet } from 'react-router-dom';

export default function RequestLayout() {
  return (
    <div className="w-full grid md:grid-cols-12 grid-cols-1">
      <div className="flex space-x-2 justify-evenly md:col-span-8 md:col-start-3  border-gray-500 border-b-2 mb-2">
        <NavLink
          to={'/friends/my'}
          className={({ isActive }) =>
            isActive ? 'text-blue-400  border-b-2 border-blue-600' : ''
          }
        >
          Friends
        </NavLink>
        <NavLink
          to={'/friends/received'}
          className={({ isActive }) =>
            isActive ? 'text-blue-400  border-b-2 border-blue-600' : ''
          }
        >
          Received
        </NavLink>
        <NavLink
          to={'/friends/sent'}
          className={({ isActive }) =>
            isActive ? 'text-blue-400  border-b-2 border-blue-600' : ''
          }
        >
          Sent
        </NavLink>
      </div>
      <div className="md:col-span-8 md:col-start-3 overflow-auto md:h-[90vh] h-[90svh]">
        <Outlet />
      </div>
    </div>
  );
}
