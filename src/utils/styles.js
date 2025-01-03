import { blue } from '@mui/material/colors';

// Configuração de cores para cada tipo de jogo
const gameColors = {
  'Quantas frutas têm ?': {
    text: '#e4f3ff',
    background: '#3c9fff',
    hoverText: '#3c9fff',
    hoverBackground: '#e4f3ff',
    border: '#3c9fff',
  },
  'Caça Palavras': {
    text: '#e0f9ec',
    background: '#00da91',
    hoverText: '#00da91',
    hoverBackground: '#e0f9ec',
    border: '#00da91',
  },
  'Que horas são ?': {
    text: '#fef7df',
    background: '#f8ce45',
    hoverText: '#f8ce45',
    hoverBackground: '#fef7df',
    border: '#f8ce45',
  },
  'memory': {
    text: '#e8ebfe',
    background: '#456ff8',
    hoverText: '#456ff8',
    hoverBackground: '#e8ebfe',
    border: '#456ff8',
  },
  'Palavras Cruzadas': {
    text: '#FFF',
    background: '#A5D6A7',
    hoverText: '#A5D6A7',
    hoverBackground: '#FFF',
    border: '#A5D6A7',
  },
  default: {
    text: '#e4f6f4',
    background: '#91ddcf',
    hoverText: '#91ddcf',
    hoverBackground: '#e4f6f4',
    border: '#91ddcf',
  },
};

export const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 1,
    background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(231,231,246,1) 35%, rgba(175,223,253,1) 100%)',
  },

  title: (gameType) => ({
    mb: 2,
    color: gameType === 'Palavras Cruzadas' ? '#FFF' : blue[700],
    fontWeight: 'bold',
    fontFamily: 'Irish Grover',
  }),

  startButton: (gameType) => {
    const colors = gameColors[gameType] || gameColors.default;
    return {
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
    };
  },

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
};
