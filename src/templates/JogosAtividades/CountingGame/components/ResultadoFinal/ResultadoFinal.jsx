import { red, blue } from '@mui/material/colors';
import { Typography } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import './styles.css';

const ResultadoFinal = ({score, errors, elapsedTime, feedback}) => {
  return (
    <div className="relatorio-final-jogo">
      <div class="ribbon">Parabéns! Jogo completado!</div>

      <Typography variant="h6" sx={{ color: blue[900], mt: 2, textAlign: 'center', fontFamily: 'Gorditas' }}>
        Pontuação: {score}
      </Typography>
      <Typography> {feedback}</Typography>
      <Typography variant="h6" sx={{ color: red[700], mt: 1, textAlign: 'center', fontFamily: 'Gorditas' }}>
        Erros: {errors}
      </Typography>
      <div className="resultado-final-tempo">
        <AccessAlarmIcon/> Tempo total: {elapsedTime} segundos
      </div>
    </div>
  )
}

export default ResultadoFinal;