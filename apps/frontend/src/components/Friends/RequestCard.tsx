import useAcceptRequest from '../../hooks/useAcceptRequest';
import useCancelRequest from '../../hooks/useCancelRequest';
import useRejectRequest from '../../hooks/useRejectRequest';
import { User } from '../../types';

function RequestCard({ type, user }: { type: string; user: User }) {
  const { cancelRequest } = useCancelRequest();
  const { acceptRequest } = useAcceptRequest();
  const { rejectRequest, loading } = useRejectRequest();
  return (
    <div className="flex flex-col p-2 rounded-lg shadow-xl h-[150px] relative space-y-2">
      <div className="flex md:flex-row flex-col md:space-x-2 items-center">
        <img
          src={
            user?.profile ||
            'https://tse2.mm.bing.net/th?id=OIP.Gfp0lwE6h7139625a-r3aAHaHa&pid=Api&P=0&h=180'
          }
          alt={user.name}
          className="w-[50px] h-[50px] rounded-full"
        />
        <h2>{user?.name}</h2>
      </div>

      {type === 'received' && (
        <div className="flex flex-col space-y-2">
          <button
            className="p-2 w-full bg-blue-500 text-gray-50 rounded-md"
            onClick={() => {
              acceptRequest(user?.id);
            }}
          >
            Accept
          </button>
          <button
            className="p-2 w-full bg-gray-500 text-gray-50 rounded-md"
            onClick={() => {
              rejectRequest(user?.id);
            }}
            disabled={loading}
          >
            Reject
          </button>
        </div>
      )}
      {type === 'sent' && (
        <div className="flex flex-col space-y-2 ">
          <button
            className="p-2 w-full bg-blue-500 text-gray-50 rounded-md"
            onClick={() => {
              cancelRequest(user?.id);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default RequestCard;
