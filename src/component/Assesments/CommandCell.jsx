import React, { useState } from 'react';
import { Button, Box, Typography, Popover } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const CommentCell = ({ comments }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'comment-popover' : undefined;

  const commentLines = comments.split('\n').filter(line => line.trim() !== '');
  const latestComment = commentLines[0];

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="body2" style={{ marginRight: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {latestComment}
      </Typography>
      {commentLines.length > 1 && (
        <>
          <Button
            aria-describedby={id}
            size="small"
            onClick={handleClick}
            startIcon={<HistoryIcon />}
          >
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box p={2}>
              {commentLines.map((comment, index) => (
                <Typography key={index} variant="body2" gutterBottom>
                  {comment}
                </Typography>
              ))}
            </Box>
          </Popover>
        </>
      )}
    </Box>
  );
};

export default CommentCell;