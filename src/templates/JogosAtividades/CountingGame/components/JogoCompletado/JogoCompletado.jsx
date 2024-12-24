import { green } from '@mui/material/colors';
import { Typography } from '@mui/material';
import './styles.css';

const JogoCompletado = ({score, errors, message}) => {
  return (
    <>
      <Typography variant="h6" sx={{ mt: 2, color: green[600] }}>
        {message}
      </Typography>
      <div className="score-board">
        <div className="score">
          <span>
            Pontos: {score}
          </span>
        </div>
        <div className="erros">
          <span>
            Erros: {errors}
          </span>
        </div>
      </div>
    </>
  )
}

export default JogoCompletado;