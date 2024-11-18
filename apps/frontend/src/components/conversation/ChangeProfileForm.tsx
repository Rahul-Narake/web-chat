import { useRef, useState } from 'react';
import { useAppSelector } from '../../store/hook';
import axios from 'axios';
import config from '../../config/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function ChangeProfileForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<File | null>(null);
  const fileTypes = ['image/jpeg', 'image/png'];
  const { currentConversation } = useAppSelector((state) => state.conversation);
  const [profilePic, setProfilePic] = useState<string | null>(
    currentConversation?.pic || ''
  );
  const { isMobileView } = useAppSelector((state) => state.view);

  const navigate = useNavigate();
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

  const handleUploadImage = async () => {
    if (profilePic && profile !== null) {
      const formData = new FormData();
      formData.append('conversationId', String(currentConversation?.id));
      formData.append('profile', profile);
      const { data } = await axios.post(
        `${config.SERVER_URL}/conversation/change-group-profile`,
        formData,
        { withCredentials: true }
      );
      console.log(data);
      if (data?.success) {
        toast(`${data?.message} || 'Profile changed successfully`, {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          style: {
            background: 'green',
            color: 'white',
          },
        });
      } else {
        toast(`Error while uploading image, try again later`, {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          style: {
            background: 'green',
            color: 'white',
          },
        });
      }
    } else {
      return;
    }
  };
  return (
    <div className="flex flex-col  md:w-[600px] w-full bg-gray-50 rounded-md shadow-lg md:h-[400px] h-full mx-auto mt-4 p-2">
      <div>
        <span
          className="cursor-pointer"
          onClick={() => {
            if (isMobileView) {
              navigate(`/msg/${currentConversation?.id}`);
            } else {
              navigate(`/${currentConversation?.id}`);
            }
          }}
        >
          <ArrowLeft />
        </span>
        <h2 className="font-semibold text-xl text-center">Change Profile</h2>
      </div>
      <div className="flex items-center w-full justify-center">
        <div className="flex items-center justify-center flex-col w-[300px] h-[300px]">
          <div
            className="w-[200px] h-[200px] rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden relative border-2 border-gray-300"
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
        </div>
        <div>
          <div
            className="w-[200px] h-[50px] bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden relative border-2 border-gray-300"
            onClick={handleClick}
          >
            <span className="text-gray-800 text-sm">Change Profile</span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept={`image/*`}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="px-2 py-1 bg-blue-300 rounded-md"
          onClick={handleUploadImage}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default ChangeProfileForm;
