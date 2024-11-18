import { useAppSelector } from '../../store/hook';
import RequestCard from './RequestCard';

function RequestReceived() {
  const requests = useAppSelector((state) => state.user.requestsReceived);

  return (
    <div className="container mx-auto p-2">
      {requests && requests?.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2 px-2 py-2 overflow-auto md:h-[90vh] h-[92svh]">
          {requests?.map((req) => (
            <RequestCard type="received" user={req.sender} key={req.id} />
          ))}
        </div>
      ) : (
        <div>No request found</div>
      )}
    </div>
  );
}

export default RequestReceived;
