import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { sendMessage } from '../../store/features/conversation/conversationSlice';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector(
    (state) => state.conversation.currentConversation
  );
  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (currentConversation)
      dispatch(
        sendMessage({ body: message, conversationId: currentConversation?.id })
      );

    setMessage('');
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center pb-2">
      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        placeholder="Type a message"
        className="flex-grow p-2 border rounded-lg border-gray-300 focus:outline-none"
      />
      <div className="relative ml-2">
        <label className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
