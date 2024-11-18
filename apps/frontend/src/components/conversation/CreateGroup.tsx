import { useEffect } from 'react';
import CreateGroupInput from './CreateGroupInput';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hook';

function CreateGroup() {
  const navigate = useNavigate();
  const selectedUsersForNewGroup = useAppSelector(
    (state) => state.user.selectedUsersForNewGroup
  );
  useEffect(() => {
    if (selectedUsersForNewGroup.length === 0) navigate('/newGroup');
  }, [selectedUsersForNewGroup]);

  return (
    <div className="grid md:grid-cols-12 grid-cols-1 md:py-2 px-4 py-2">
      <div className="flex flex-col md:col-span-8 md:col-start-3">
        <CreateGroupInput />
      </div>
    </div>
  );
}

export default CreateGroup;
