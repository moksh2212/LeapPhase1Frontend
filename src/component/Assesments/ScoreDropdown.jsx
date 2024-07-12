import React, { useState } from 'react';
import { Button, Box, Typography, Popover } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HistoryIcon from '@mui/icons-material/History';

const ScoreDropdown = ({ scores }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const latestScore = scores[scores.length - 1];
  const previousScore = scores[scores.length - 2];
  const isImproved = previousScore !== undefined && latestScore > previousScore;

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="body2" style={{ marginRight: '8px' }}>
        {latestScore.toFixed(2)}
      </Typography>
      {scores.length > 1 && (
        isImproved ? 
          <ArrowUpwardIcon style={{ color: 'green', marginRight: '8px' }} /> :
          <ArrowDownwardIcon style={{ color: 'red', marginRight: '8px' }} />
      )}
      {scores.length > 1 && (
        <>
          <Button
            aria-describedby={id}
            size="small"
            onClick={handleClick}
            startIcon={<HistoryIcon />}
          />
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
              {scores.map((score, index) => (
                <Typography key={index} variant="body2">
                  Attempt {index + 1}: {score.toFixed(2)}
                </Typography>
              ))}
            </Box>
          </Popover>
        </>
      )}
    </Box>
  );
};

export default ScoreDropdown;