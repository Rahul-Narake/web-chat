import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Pencil } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../../config/config';
import { setCurrentConversation } from '../../store/features/conversation/conversationSlice';

function ChangeName({
  open,
  handleClickOpen,
  handleClose,
}: {
  open: boolean;
  handleClickOpen: () => void;
  handleClose: () => void;
}) {
  const currentConversation = useAppSelector(
    (state) => state.conversation.currentConversation
  );
  const [name, setName] = React.useState<string>(currentConversation?.name!);
  const [loading, setLoding] = React.useState(false);
  const dispatch = useAppDispatch();
  const handleChangeName = async () => {
    try {
      setLoding(true);
      if (!name || !currentConversation || name === currentConversation?.name) {
        return;
      }

      const { data } = await axios.put(
        `${config.SERVER_URL}/conversation/changeName`,
        {
          conversationId: currentConversation?.id,
          name,
        },
        { withCredentials: true }
      );
      console.log(data);
      if (data?.success) {
        dispatch(setCurrentConversation(data?.data?.conversation));
        toast('Name chnaged successfully', {
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
        toast('Error while changing the name, try again later');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoding(false);
    }
  };
  return (
    <React.Fragment>
      <Pencil
        size={14}
        color="blue"
        onClick={handleClickOpen}
        className="cursor-pointer"
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={loading} onClick={handleChangeName}>
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default React.memo(ChangeName);
