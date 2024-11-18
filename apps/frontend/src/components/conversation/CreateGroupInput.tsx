import { useRef, useState } from 'react';
import SelectedUsers from './SelectedUsers';
import { GroupChatType } from '@repo/common/SignupData';
import { useAppSelector } from '../../store/hook';
import useCreateGroup from '../../hooks/useCreateGroup';

function CreateGroupInput() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [groupName, setGroupName] = useState('');
  const [profile, setProfile] = useState<File | null>(null);
  const selectedUsersForNewGroup = useAppSelector(
    (state) => state.user.selectedUsersForNewGroup
  );
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const users: string[] = selectedUsersForNewGroup.map((u) => String(u.id));
  const { loading, createGroup, createGroupWithPic } = useCreateGroup();
  const fileTypes = ['image/jpeg', 'image/png'];
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && fileTypes.includes(file.type) && file.size <= 1000000) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProfile(file);
    } else {
      alert(
        'File format not supported, should be JPEG/PNG and size shoUld be less than 1 MB'
      );
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreateGroup = async () => {
    if (!selectedUsersForNewGroup && !groupName) {
      return;
    }

    const groupData: GroupChatType = {
      name: groupName,
      users: [...users, String(currentUser?.id)],
      admins: [String(currentUser?.id)],
      isGroupChat: true,
    };

    if (profilePic && profile !== null) {
      const formData = new FormData();
      formData.append('name', groupName);
      formData.append('isGroupChat', 'true');
      formData.append(
        'users',
        JSON.stringify([...users, String(currentUser?.id)])
      );
      formData.append('admins', JSON.stringify([String(currentUser?.id)]));
      formData.append('profile', profile);
      createGroupWithPic(formData);
    } else {
      createGroup(false, groupData);
    }
  };

  return (
    <>
      <div className="flex items-center w-full">
        <div className="flex items-center justify-center flex-col w-40 h-40">
          <div
            className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden relative border-2 border-gray-300"
            onClick={handleClick}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm">Upload</span>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={`image/*`}
            onChange={handleFileChange}
          />
        </div>
        <div className="w-full border border-gray-400 rounded-lg">
          <input
            type="text"
            placeholder="Group Name"
            className="w-full h-[50px] p-2 rounded-lg"
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
        </div>
      </div>
      <SelectedUsers name="Members" users={selectedUsersForNewGroup} />
      <div className="relative w-full border border-t border-slate-300 mt-4">
        <button
          className="bg-blue-500 text-slate-50 p-2 rounded-full absolute right-0 mt-2"
          onClick={handleCreateGroup}
          disabled={loading}
        >
          Create
        </button>
      </div>
    </>
  );
}

export default CreateGroupInput;
