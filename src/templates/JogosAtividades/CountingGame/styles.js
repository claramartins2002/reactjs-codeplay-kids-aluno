export const styles = {
  box: {
    minHeight: '50vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 3,
  }, 

  typography: { 
    mb: 2, 
    color: '#3c9fff', 
    fontWeight: 'bold', 
    fontFamily: 'Gorditas',
  },

  card: {
    width: '50%',
    maxHeight: '60%',
    backgroundColor: '#e3f1ff',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    borderRadius: 3,
  },

  fruitsBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    margin: '10px',
    fontFamily: 'Irish Grover'
  },

  button: {
    background: '#4CAF50',
    boxShadow: '0 5px #2e7d32',
    transition: 'transform 0.3s, box-shadow 0.3s',
    color: 'white',
    width: '75%',
    fontFamily: 'Gorditas',
    mt: 2,
    '&:hover': { background: '#4CAF50', boxShadow: '0 5px #2e7d32' },
    '&:active': { transform: 'translateY(6px)', boxShadow: '0' }
  }
}