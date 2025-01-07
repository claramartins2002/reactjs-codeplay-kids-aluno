
export const styles = {
  cardJogo: {
    position: 'relative',
    width: '400px',
    height: '200px',
    backgroundColor: '#77c6d0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '20px',
    margin: '20px',
    transition: 'all 0.5s',
  },

  cloudShape: {
    position: 'absolute',
    bottom: '0',
    right: '40%',
    width: '200px',
    height: '150px',
    backgroundColor: '#bfe9ed',
    borderRadius: '50% 50% 0 0',
    transform: 'translate(50%, 50%)',
    transition: 'all 0.5s',
    '&:hover':{
      bottom: '50%',
      right: '50%',
      width: '500px',
      height: '500px',
    }
  },

  cloudShapeSecond: {
    position: 'absolute',
    bottom: '30%',
    right: '0',
    width: '300px',
    height: '200px',
    backgroundColor: '#bfe9ed',
    borderRadius: '50% 50% 0 0',
    transform: 'translate(50%, 50%)',
    transition: 'all 0.5s',
  }
};