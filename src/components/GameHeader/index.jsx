import React from 'react';
import { Typography, Button } from '@mui/material';
import { styles } from '../../utils/styles';

const GameHeader = ({ gameStarted, onStartGame }) => {
  return (
    <>
      <Typography variant="h3" sx={styles.title}>
        Operações Matemáticas
      </Typography>
      {!gameStarted && (
        <Button
          variant="contained"
          onClick={onStartGame}
          sx={styles.startButton}
        >
          Iniciar Jogo
        </Button>
      )}
    </>
  );
};

export default GameHeader; 