import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ArrowLeft, EllipsisVertical, Pencil } from 'lucide-react';
import { useAppSelector } from '../../store/hook';
import { useNavigate } from 'react-router-dom';
import GroupMembers from './GroupMembers';
import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { IconButton } from '@mui/material';
import ChangeName from './ChangeName';

function ConversationCard() {
  const { currentConversation } = useAppSelector((state) => state.conversation);
  const { currentUser } = useAppSelector((state) => state.user);
  const { isMobileView } = useAppSelector((state) => state.view);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isAdmin = currentConversation?.admins?.find(
    (u) => u.id === currentUser?.id
  );

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseForm = () => {
    setOpen(false);
  };

  return (
    <Card className="md:w-[600px] w-full h-full">
      <div className="flex flex-row justify-between border-slate-600 border-b-[1px] p-2">
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
        {currentConversation?.isGroupChat ? (
          <div className="flex flex-col justify-center items-center ">
            <img
              src={
                currentConversation?.pic ||
                'https://tse2.mm.bing.net/th?id=OIP.7ESN_JtDRNjDIiVA5LYXmwHaHa&pid=Api&P=0&h=180'
              }
              alt={currentConversation?.name}
              className="w-36 h-36 rounded-full"
            />

            <div className="flex flex-col w-full justify-center">
              <div className="flex items-center space-x-2 justify-center">
                <h2 className="font-semibold">{currentConversation?.name}</h2>
                <span
                  onClick={() => {
                    open ? handleCloseForm() : handleClickOpen();
                  }}
                >
                  <ChangeName
                    open={open}
                    handleClickOpen={handleClickOpen}
                    handleClose={handleCloseForm}
                  />
                </span>
              </div>
              <span className="text-sm text-gray-600">
                Group: {currentConversation?.users?.length} Members
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center">
            <img
              src={
                currentConversation?.pic ||
                'https://tse2.mm.bing.net/th?id=OIP.qOSjSxoUNci9aPL9spX_eQHaHa&pid=Api&P=0&h=180'
              }
              alt={currentConversation?.name}
              className="w-36 h-36 rounded-full"
            />

            <h2 className="font-semibold text-center">
              {currentConversation?.name}
            </h2>
          </div>
        )}
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
            {currentConversation?.isGroupChat && isAdmin && (
              <MenuItem
                onClick={() => {
                  navigate('/add-members');
                  handleClose();
                }}
              >
                Add Members
              </MenuItem>
            )}
            {currentConversation?.isGroupChat && (
              <MenuItem
                onClick={() => {
                  navigate(
                    `/conversation/${currentConversation?.id}/change-profile`
                  );
                  handleClose();
                }}
              >
                Change Profile
              </MenuItem>
            )}
            {!currentConversation?.isGroupChat && (
              <MenuItem
                onClick={() => {
                  navigate(
                    `/conversation/${currentConversation?.id}/change-profile`
                  );
                  handleClose();
                }}
              >
                Update Profile
              </MenuItem>
            )}
          </Menu>
        </div>
      </div>
      <CardContent className="w-full h-full overflow-scroll">
        {isAdmin && currentConversation?.isGroupChat && (
          <div
            className="flex flex-row items-center space-x-2 cursor-pointer"
            onClick={() => {
              navigate('/add-members');
              handleClose();
            }}
          >
            <img
              src={
                'https://tse2.mm.bing.net/th?id=OIP.z6dQ-c2XvIzUZYnfEVKK5AHaHa&pid=Api&P=0&h=180'
              }
              className="w-10 h-10 rounded-full"
            />
            <h3>Add members</h3>
          </div>
        )}
        {currentConversation?.isGroupChat && currentConversation?.users && (
          <GroupMembers members={currentConversation?.users} />
        )}
      </CardContent>
    </Card>
  );
}

export default ConversationCard;
