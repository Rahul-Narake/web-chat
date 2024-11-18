import useGetAllUsers from '../../hooks/useGetAllUsers';
import { useAppSelector } from '../../store/hook';
import UserCard from './UserCard';

// const users = [
//   {
//     id: 1,
//     name: 'Prasad Patil',
//     profile: undefined,
//     isFriend: true,
//     friendRequestSent: true,
//   },
//   {
//     id: 2,
//     name: 'Rohan Patil',
//     profile: undefined,
//     isFriend: true,
//     friendRequestSent: true,
//   },
//   {
//     id: 3,
//     name: 'Omkar Patil',
//     profile: undefined,
//     isFriend: false,
//     friendRequestSent: true,
//   },
//   {
//     id: 4,
//     name: 'Kiran Patil',
//     profile: undefined,
//     isFriend: false,
//     friendRequestSent: false,
//   },
//   {
//     id: 5,
//     name: 'Raj Patil',
//     profile: undefined,
//     isFriend: false,
//     friendRequestSent: true,
//   },
//   {
//     id: 6,
//     name: 'Shyam Patil',
//     profile: undefined,
//     isFriend: true,
//     friendRequestSent: true,
//   },
//   {
//     id: 7,
//     name: 'Deepak jeve',
//     profile: undefined,
//     isFriend: false,
//     friendRequestSent: true,
//   },
//   {
//     id: 8,
//     name: 'Sourabh Sagare',
//     profile: undefined,
//     isFriend: false,
//     friendRequestSent: false,
//   },
//   {
//     id: 9,
//     name: 'Aditya Phadatare',
//     profile: undefined,
//     isFriend: true,
//     friendRequestSent: true,
//   },
// ];

function AllUsers() {
  const { loading } = useGetAllUsers();
  const users = useAppSelector((state) => state.user.allUsers);
  return (
    <div className="container mx-auto md:px-[10%] px-2 py-2">
      {loading && (
        <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2"></div>
      )}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2 sm:px-2 px-2 py-2 overflow-auto md:h-[90vh] h-[92svh]">
          {!loading &&
            users &&
            users.map((user) => <UserCard key={user.id} user={user} />)}
        </div>
      )}
    </div>
  );
}

export default AllUsers;
