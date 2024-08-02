import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  List, 
  ListItem, 
  ListItemText, 
  Tooltip 
} from '@mui/material';

export const HistoryDialog = ({ history, title, parseLogEntry }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Click to view full history">
        <Button onClick={handleOpen} size="small">
          View History
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <List>
            {history.map((entry, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={new Date(entry.timestamp).toLocaleString()}
                  secondary={
                    <>
                      <div>User: {entry.userName}</div>
                      {parseLogEntry(entry.logEntry)}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};