import { blue, red, grey, green } from '@mui/material/colors';

// Configuração de cores para cada tipo de jogo
const gameColors = {
  'Quantas frutas têm ?': {
    text: '#e4f3ff',
    background: '#3c9fff',
    hoverText: '#3c9fff',
    hoverBackground: '#e4f3ff',
    border: '#3c9fff',
    backgroundContainer: '#ffab4a'
  },
  'Caça Palavras': {
    text: '#e0f9ec',
    background: '#00da91',
    hoverText: '#00da91',
    hoverBackground: '#e0f9ec',
    border: '#00da91',
    backgroundContainer: '#f45b7e'
  },
  'Que horas são ?': {
    text: '#fef7df',
    background: '#f8ce45',
    hoverText: '#f8ce45',
    hoverBackground: '#fef7df',
    border: '#f8ce45',
    backgroundContainer: '#6f8afa'
  },
  'Jogo da memória': {
    text: '#e8ebfe',
    background: '#456ff8',
    hoverText: '#456ff8',
    hoverBackground: '#e8ebfe',
    border: '#456ff8',
    backgroundContainer: '#f8ce45'
  },
  'Palavras Cruzadas': {
    text: '#FFF',
    background: '#8BC34A',
    hoverText: '#8BC34A',
    hoverBackground: '#FFF',
    border: '#8BC34A',
    backgroundContainer: '#d6a5d4'
  },
  'Arrasta e Solta': {
    text: '#eee5f6',
    background: '#6c27b8',
    hoverText: '#6c27b8',
    hoverBackground: '#eee5f6',
    border: '#6c27b8',
    backgroundContainer: '#81c82f'
  },
  'Que animal é esse ?': {
    text: '#F2E8B3',
    background: '#6fa3df',
    hoverText: '#6fa3df',
    hoverBackground: '#F2E8B3',
    border: '#6fa3df',
    backgroundContainer: '#dfab6f'
  },
  'Quebra Cabeça': {
    text: '#fbdeb2',
    background: '#f4a428',
    hoverText: '#f4a428',
    hoverBackground: '#fbdeb2',
    border: '#f4a428',
    backgroundContainer: '#3babff'
  },
  'Formas e Cores': {
    text: '#fae8f9',
    background: '#e274dd',
    hoverText: '#e274dd',
    hoverBackground: '#fae8f9',
    border: '#e274dd',
    backgroundContainer: '#a1eaa2'
  },
  default: {
    text: '#e4f6f4',
    background: '#91ddcf',
    hoverText: '#91ddcf',
    hoverBackground: '#e4f6f4',
    border: '#91ddcf',
    backgroundContainer: '#dd919f'
  },
};

export const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 1,
    background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(231,231,246,1) 35%, rgba(175,223,253,1) 100%)',
  },

  boxGameHeader: (gameType) => {
    const colors = gameColors[gameType] || gameColors.default;
    return {
      display: 'flex',
      flexDirection: 'column',
      margin: '20px auto',
      background: colors.backgroundContainer,
      padding: '50px 30px',
      borderRadius: '20px',
    }
  },

  title: (gameType) => {
    const colors = gameColors[gameType] || gameColors.default;
    return {
      mb: 2,
      color: colors.text,
      fontWeight: 'bold',
      fontFamily: 'Irish Grover',
      width: '400px',
      textAlign: 'center',
    }
  },

  startButton: (gameType) => {
    const colors = gameColors[gameType] || gameColors.default;
    return {
      width: '50%',
      height: '60px',
      margin: 'auto',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      padding: '1%',
      fontFamily: 'Irish Grover',
      borderRadius: '20px',
      color: colors.text,
      backgroundColor: colors.background,
      '&:hover': {
        color: colors.hoverText,
        backgroundColor: colors.hoverBackground,
      },
    };
  },

  gameCard: {
    top: '60%',
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

  gameOverContainer: (gameType) => {
    const colors = gameColors[gameType] || gameColors.default;
    return {
      padding: '20px 15px',
      borderRadius: '15px',
      textAlign: 'center',
      fontFamily: 'Irish Grover',
      backgroundColor: '#FFF',
      border: `1rem solid ${colors.border}`,
      boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px',
      maxWidth: '50%',
      margin: '10% auto',
    };
  },

  gameOverResults: (gameType) => {
    const colors = gameColors[gameType] || gameColors.default;
    return {
      padding: '10px',
      borderRadius: '15px',
      width: '40%',
      margin: 'auto',
      background: colors.hoverBackground
    };
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

  restartButton: (gameType) => {
    const colors = gameColors[gameType] || gameColors.default;
    return {
      mt: 3,
      margin: '5px',
      padding: '20px 20px',
      borderRadius: '50%',
      fontSize: '1rem',
      color: 'white',
      fontFamily: 'Irish Grover',
      backgroundColor: colors.background,
      '&:hover': {
        color: colors.hoverText,
        backgroundColor: colors.hoverBackground,
      },
    };
  },

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
    width: '100%',
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
};
