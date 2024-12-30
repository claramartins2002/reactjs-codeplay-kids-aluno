import { blue, red, grey, green } from '@mui/material/colors';

export const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 1,
    background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(231,231,246,1) 35%, rgba(175,223,253,1) 100%)'
  },

  title: {
    mb: 2,
    color: blue[700],
    fontWeight: 'bold',
    fontFamily: 'Irish Grover'
  },

  startButton: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '1%',
    fontFamily: 'Irish Grover',
    color: '#e4f6f4',
    borderRadius: '20px',
    backgroundColor: '#91ddcf',
    '&:hover': { color: '#91ddcf', backgroundColor: '#e4f6f4' },
  },

  gameCard: {
    minWidth: 800,
    backgroundColor: '#91ddcf',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    borderRadius: 3,
    fontFamily: 'Irish Grover'
  },

  question: {
    mb: 3,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Irish Grover',
    fontSize: '5rem'
  },

  answerButton: (selectedAnswer, answer, correctAnswer) => ({
    fontSize: '4rem',
    backgroundColor:
      selectedAnswer === null
        ? grey[400]
        : answer === correctAnswer
        ? green[400]
        : selectedAnswer === answer
        ? red[400]
        : grey[400],
    '&:hover': {
      backgroundColor:
        selectedAnswer === null
          ? grey[600]
          : answer === correctAnswer
          ? green[600]
          : selectedAnswer === answer
          ? red[600]
          : grey[600]
    },
    fontWeight: 'bold',
    color: 'white',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    fontFamily: 'Irish Grover'
  }),

  progressBar: {
    mt: 2,
    height: 50,
    borderRadius: 5,
    backgroundColor: grey[300],
    '& .MuiLinearProgress-bar': {
      backgroundColor: blue[500]
    }
  },

  scoreBoard: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '50%',
    mt: 2,
    px: 2
  },

  score: {
    color: '#FFF',
    fontFamily: 'Irish Grover',
    padding: '10px 15px',
    backgroundColor: '#3bbf54',
    borderRadius: '25px'
  },

  errors: {
    color: '#FFF',
    fontFamily: 'Irish Grover',
    padding: '10px 15px',
    backgroundColor: red[600],
    borderRadius: '25px'
  },

  questionCounter: {
    color: '#FFF',
    fontFamily: 'Irish Grover',
    padding: '10px 15px',
    borderRadius: '25px',
    backgroundColor: blue[900],
  },

  gameOverContainer: {
    padding: '20px 15px',
    borderRadius: '15px',
    textAlign: 'center',
    fontFamily: 'Irish Grover',
    backgroundColor: '#FFF',
    border: '1rem solid #91ddcf',
    boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px',
  },

  gameOverTitle: {
    mb: 2,
    color: blue[700],
    fontWeight: 'bold',
    fontFamily: 'Irish Grover'
  },

  restartButton: {
    mt: 3,
    margin: '5px',
    padding: '20px 20px',
    borderRadius: '50%',
    backgroundColor: '#91ddcf',
    '&:hover': { color: '#91ddcf', backgroundColor: '#e4f6f4' },
    fontSize: '1rem',
    color: 'white',
    fontFamily: 'Irish Grover'
  }
}; 