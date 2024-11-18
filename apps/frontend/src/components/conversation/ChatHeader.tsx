import { ArrowLeft, EllipsisVertical } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import Avatar from '../UI/Avatar';
import { useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';

function ChatHeader() {
  const navigate = useNavigate();
  const currentConversation = useAppSelector(
    (state) => state.conversation.currentConversation
  );
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="absolute top-0 h-[50px] border border-b-1 border-slate-500 w-full flex justify-between items-center px-2">
      <div className="flex justify-start items-center space-x-2">
        <span
          className="md:hidden flex"
          onClick={() => {
            navigate('/');
          }}
        >
          <ArrowLeft />
        </span>
        <div
          className="flex flex-row items-center space-x-4 cursor-pointer"
          onClick={() => {
            navigate(`/conversation/${currentConversation?.id}`);
          }}
        >
          <Avatar url={currentConversation?.pic} />
          <h2 className="text-xl font-normal ">{currentConversation?.name}</h2>
        </div>
      </div>
      <div>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <EllipsisVertical />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {currentConversation && currentConversation?.isGroupChat ? (
            <div>
              <MenuItem
                onClick={() => {
                  navigate(`/conversation/${currentConversation?.id}`);
                }}
              >
                Group info
              </MenuItem>
              <MenuItem onClick={handleClose}>Exit group</MenuItem>
            </div>
          ) : (
            <div>
              <MenuItem
                onClick={() => {
                  navigate(`/conversation/${currentConversation?.id}`);
                }}
              >
                View contact
              </MenuItem>
            </div>
          )}
        </Menu>
      </div>
    </div>
  );
}

export default ChatHeader;
