import * as React from 'react';
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import OptionsDialog from './OptionsDialog';

export default function Options() {
  const emails = ['username@gmail.com', 'user02@gmail.com'];
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Typography variant="subtitle1" component="div">
        Selected: {selectedValue}
      </Typography>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        profile
      </Button>
      <OptionsDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
