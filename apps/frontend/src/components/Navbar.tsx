import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { AlignJustify, UserPlus } from 'lucide-react';
import { logout } from '../store/features/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="w-full h-[50px] flex justify-between items-center bg-gray-800 text-slate-100 px-2">
          <Link to={''}>Chatty</Link>

          {isLoggedIn && (
            <div className="flex justify-around items-center">
              <div>
                <Link to={'/users'}>
                  <UserPlus />
                </Link>
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
                  <AlignJustify />
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
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/newGroup');
                    }}
                  >
                    New Group
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/friends/my');
                    }}
                  >
                    Friends
                  </MenuItem>
                  <MenuItem onClick={handleClose}>Settings</MenuItem>
                  <MenuItem
                    onClick={async () => {
                      dispatch(logout());
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
