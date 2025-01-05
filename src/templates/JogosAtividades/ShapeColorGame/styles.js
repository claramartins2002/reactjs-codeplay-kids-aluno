import { green, red, blue, yellow, pink, purple, orange } from '@mui/material/colors';

export const styles = {
  colors: {
    'vermelho': red,
    'azul': blue,
    'verde': green,
    'amarelo': yellow,
    'roxo': purple,
    'rosa': pink,
    'laranja': orange,
  },

  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 1,
    background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(231,231,246,1) 35%, rgba(175,223,253,1) 100%)',
  },

  shapeStyle: (color) => ({
    backgroundColor: color,
    width: '100px',
    height: '100px',
    display: 'inline-block',
  }),

  renderShape: (color) => ({
    width: 0,
    height: 0,
    borderLeft: '50px solid transparent',
    borderRight: '50px solid transparent',
    borderBottom: `100px solid ${color}`,
    display: 'inline-block',
  }),

  card: {
    maxWidth: 400,
    backgroundColor: blue[100],
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    borderRadius: 3,
  },

  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },

  button: {
    backgroundColor: blue[400],
    '&:hover': {
      backgroundColor: blue[600],
    },
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
  }
}