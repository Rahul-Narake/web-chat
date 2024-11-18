import { useEffect, useState } from 'react';
const useSession = () => {
  const [status, setStatus] = useState('UNAUTHENTICATED');
  useEffect(() => {}, []);
  return { status };
};

export default useSession;
