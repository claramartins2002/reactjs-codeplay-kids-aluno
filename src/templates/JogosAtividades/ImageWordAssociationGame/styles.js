export const styles = {
  box: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 3,
  },
  
  card: {
    maxWidth: '50%',
    backgroundColor: '#6fa3df',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    borderRadius: 3,
    flexDirection: 'column',
  },

  img: {
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '16px',
    display: 'flex',
    padding: 0,
    margin: 'auto auto 15px auto',
  },

  lettersBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mb: 2,
    gap: 1,
  },

  boxContent: (selectedLetters, index) => ({
    width: '60px',
    height: '60px',
    backgroundColor: selectedLetters[index] ? '#F2C572' : '#F2E8B3',
    borderBottom: selectedLetters[index] ? '0.6rem solid #F28705' : '0.6rem solid #F2C84B',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '15px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: 'Irish Grover',
  }),

  button: {
    backgroundColor: '#ab77db',
    '&:hover': {
        backgroundColor: '#9952db',
    },
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: 'Irish Grover',
    color: '#FFF',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    border: '2px dashed #FFF',
    padding: '8px 16px',
    borderRadius: '10px',
    width: '60px',
    height: '60px',
  },

  scoreboardBox: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '80%',
    width: '50%',
  }
}