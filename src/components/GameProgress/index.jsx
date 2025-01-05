import React from 'react';
import { Typography, LinearProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import { styles } from '../../utils/styles';
import ConfettiExplosion from 'react-confetti-explosion';

const GameProgress = ({ message, questionCount, totalQuestions = 15, showConfetti }) => {
  return (
    <>
      <Typography variant="h6" sx={{ mt: 2, color: green[600], fontStyle: 'italic', margin: 'auto' }} >
        {message}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(questionCount / totalQuestions) * 100}
        sx={styles.progressBar}
      />
      {showConfetti && <ConfettiExplosion />}
    </>
  );
};

export default GameProgress; 