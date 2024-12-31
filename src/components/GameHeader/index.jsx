import React from 'react';
import { Typography, Button } from '@mui/material';
import { styles } from '../../utils/styles';

const GameHeader = ({ gameStarted, onStartGame, game }) => {
  return (
    <>
      <Typography variant="h3" sx={styles.title}>
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
    </>
  );
};

export default GameHeader; 