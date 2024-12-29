import { Dialog, DialogActions, DialogContent, DialogContentText, Typography } from '@mui/material';
import './styles.css';

const RelatorioFinal = ({dialogOpen, handleEndGame, feedback, handleRestartGame, elapsedTime}) => {
  return (
    <Dialog open={dialogOpen} onClose={handleEndGame} PaperProps={{ sx: {padding: '10px', alignItems: 'center', borderRadius: '20px'}}}>
      <div class="ribbon">Parabéns! Jogo completado!</div>
      <DialogContent>
        <DialogContentText sx={{ fontFamily: 'Coming Soon' }}>
          Você encontrou todas as palavras em {elapsedTime} segundos! Deseja jogar novamente ou finalizar o jogo?
          <Typography> {feedback}</Typography>

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button onClick={handleRestartGame} className="btn-reiniciar-caca-palavras">REINICIAR</button>
        <button onClick={handleEndGame} className="btn-finalizar-caca-palavras">FINALIZAR</button>
      </DialogActions>
    </Dialog>
  )
}

export default RelatorioFinal;