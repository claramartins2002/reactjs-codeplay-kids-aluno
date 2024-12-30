import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { green, red, blue } from '@mui/material/colors';
import { styles } from '../../utils/styles';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const GameOver = ({ score, errors, elapsedTime, feedback, onRestart }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Box sx={styles.gameOverContainer}>
      <div className="ribbon">Parabéns! Jogo completado!</div>
      <div className="resultado-final-jogo">
        <Typography variant="h5" sx={{fontFamily: 'Irish Grover'}}>
            Tempo: {elapsedTime}s
        </Typography>
        <Typography variant="h5" sx={{ color: green[600], fontFamily: 'Irish Grover' }}>
            Pontuação: {score}
        </Typography>
        <Typography variant="h5" sx={{ color: red[700], fontFamily: 'Irish Grover' }}>
            Erros: {errors}
        </Typography>
        <Typography variant="h5" sx={{fontFamily: 'Irish Grover', color: blue[700]}} >
            {feedback}
        </Typography>
      </div>
      <Button
        variant="contained"
        onClick={handleHomeClick}
        sx={styles.restartButton}
      >
        <HomeOutlinedIcon sx={{ fontSize: 40 }}/>
      </Button>
      <Button
        variant="contained"
        onClick={onRestart}
        sx={styles.restartButton}
      >
        <RestartAltIcon sx={{ fontSize: 40 }}/>
      </Button>
    </Box>
  );
};

export default GameOver; 