import { Dialog, DialogActions, DialogContent, DialogContentText, Typography, Button, Tooltip } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const RelatorioFinal = ({dialogOpen, handleEndGame, feedback, handleRestartGame, elapsedTime}) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const buttonStyle = {
    mt: 3,
    margin: '5px',
    padding: '20px 20px',
    borderRadius: '50%',
    fontSize: '1rem',
    color: 'white',
    fontFamily: 'Irish Grover',
    backgroundColor: '#00da91',
    color: '#e0f9ec',
    '&:hover': { 
      color: '#00da91', 
      backgroundColor: '#e0f9ec',
    }
  }

  return (
    <Dialog open={dialogOpen} onClose={handleEndGame} PaperProps={{ sx: {padding: '10px', alignItems: 'center', borderRadius: '20px', border: '1rem solid #00da91'}}}>
      <div class="ribbon">Parabéns! Jogo completado!</div>
      <DialogContent>
        <DialogContentText sx={{ fontFamily: 'Coming Soon' }}>
          Você encontrou todas as palavras em {elapsedTime} segundos! Deseja jogar novamente ou finalizar o jogo?
          <Typography> {feedback}</Typography>

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Tooltip title="Voltar ao início">
          <Button
            variant="contained"
            onClick={handleHomeClick}
            sx={buttonStyle}
          >
            <HomeOutlinedIcon sx={{ fontSize: 40 }}/>
          </Button>
        </Tooltip>
        <Tooltip title="Reiniciar">
          <Button
            variant="contained"
            onClick={handleRestartGame}
            sx={buttonStyle}
          >
            <RestartAltIcon sx={{ fontSize: 40 }}/>
          </Button>
        </Tooltip>
        
      </DialogActions>
    </Dialog>
  )
}

export default RelatorioFinal;