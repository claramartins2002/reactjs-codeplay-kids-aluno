import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { styles } from '../../utils/styles';

const GameHeader = ({ gameStarted, onStartGame, game }) => {
  return (
    <Box sx={styles.boxGameHeader}>
      <Typography variant="h3" sx={styles.title(game)}>
        {game}
      </Typography>
      {!gameStarted && (
        <Button
          variant="contained"
          onClick={onStartGame}
          sx={styles.startButton(game)}
        >
          Iniciar Jogo
        </Button>
      )}
    </Box>
  );
};

export default GameHeader; 