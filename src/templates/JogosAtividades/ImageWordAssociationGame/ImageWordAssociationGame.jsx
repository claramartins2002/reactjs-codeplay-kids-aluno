import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardContent, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import trilha from '../../../sound/trilha.mp3';
import acerto from '../../../sound/acerto.mp3';
import erro from '../../../sound/erro.mp3';
import AudioManager from '../../../utils/audioManager';
import GameOver from '../../../components/GameOver';
import GameHeader from '../../../components/GameHeader';
import { styles } from './styles';
import ScoreBoard from '../../../components/ScoreBoard';
import GameProgress from '../../../components/GameProgress';

// Conjunto de imagens e palavras para associação
const imageWordPairs = [
  { image: 'https://cdn-icons-png.freepik.com/256/8466/8466905.png', correctWord: 'GATO' },
  { image: 'https://cdn-icons-png.freepik.com/128/1660/1660685.png', correctWord: 'GIRAFA' },
  { image: 'https://cdn-icons-png.freepik.com/128/8493/8493134.png', correctWord: 'SAPO' },
  { image: 'https://cdn-icons-png.freepik.com/128/12262/12262953.png', correctWord: 'BALEIA' },
  { image: 'https://cdn-icons-png.freepik.com/128/7432/7432707.png', correctWord: 'BORBOLETA' },
  { image: 'https://cdn-icons-png.freepik.com/128/5880/5880292.png', correctWord: 'ABELHA' },
];

// Função para gerar letras aleatórias, incluindo as letras da palavra correta
const getShuffledLetters = (correctWord) => {
  const letters = correctWord.split('');
  const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  while (letters.length < correctWord.length + 3) {
    const randomLetter = extraLetters[Math.floor(Math.random() * extraLetters.length)];
    if (!letters.includes(randomLetter)) {
      letters.push(randomLetter);
    }
  }
  return letters.sort(() => Math.random() - 0.5);
};

const ImageWordAssociationGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPair, setCurrentPair] = useState(imageWordPairs[0]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [shuffledLetters, setShuffledLetters] = useState(getShuffledLetters(currentPair.correctWord));
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [message, setMessage] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0); // Cronômetro
  const [gameOver, setGameOver] = useState(false); // Estado para finalizar o jogo
  const [gameStarted, setGameStarted] = useState(false);
  const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
  const { studentId} = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id'); // Captura o 'id' da atividade
  const [feedback, setFeedback] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Inicialização dos sons
  const [ambientSound] = useState(new AudioManager(trilha, { loop: true, volume: 0.3 }));
  const [correctSound] = useState(new AudioManager(acerto, { allowMultiplePlays: true }));
  const [wrongSound] = useState(new AudioManager(erro, { allowMultiplePlays: true }));

  // Limpeza do áudio quando o componente for desmontado
  useEffect(() => {
    return () => {
      ambientSound.stop();
      correctSound.stop();
      wrongSound.stop();
    };
  }, []);

  useEffect(() => {
    setShuffledLetters(getShuffledLetters(currentPair.correctWord));
    setSelectedLetters([]);
  }, [currentPair]);

  // Controle do cronômetro
  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver) {
        setElapsedTime((prevTime) => prevTime + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    // Verifica automaticamente a palavra quando todos os espaços estão preenchidos
    if (selectedLetters.length === currentPair.correctWord.length) {
      checkAnswer();
    }
  }, [selectedLetters]);

  const handleLetterClick = (letter) => {
    if (selectedLetters.length < currentPair.correctWord.length) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  const checkAnswer = () => {
    const userWord = selectedLetters.join('');
    if (userWord === currentPair.correctWord) {
      correctSound.play();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setScore(score + 1);
      setMessage('Acertou! 🎉');
      setTimeout(() => {
        setMessage('');
        goToNextPair();
      }, 1500);
    } else {
      wrongSound.play();
      setErrors(errors + 1);
      setMessage('Errou! 😞');
      setTimeout(() => {
        setMessage('');
        resetSelection();
      }, 1500);
    }
  };

  const resetSelection = () => {
    setSelectedLetters([]);
    setShuffledLetters(getShuffledLetters(currentPair.correctWord));
  };

  const clearLastLetter = () => {
    if (selectedLetters.length > 0) {
      const updatedSelected = [...selectedLetters];
      updatedSelected.pop(); // Remove a última letra
      setSelectedLetters(updatedSelected);
    }
  };

  const goToNextPair = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < imageWordPairs.length) {
      setCurrentIndex(nextIndex);
      setCurrentPair(imageWordPairs[nextIndex]);
    } else {
      setGameOver(true); // Jogo termina quando todos os pares são usados
    }
  };

  const startGame = () => {
    setGameStarted(true);
    ambientSound.play();
  };

  const restartGame = () => {
    setScore(0);
    setErrors(0);
    setGameOver(false);
    setMessage('');
    setSelectedLetters([]);
    setCurrentPair(imageWordPairs[0])
    setCurrentIndex(0)
    setElapsedTime(0);
  }; 

  // Função para enviar os dados para o backend
  const saveGameReport = async () => {
  const relatorio = {
    aluno: {id: studentId}, // ID do aluno
    tipoAtividade: 'Operações Matemáticas', // Tipo da atividade
    pontuacao: score,
    erros: errors,
    acertos: score,
    tempoGasto: elapsedTime,
    atividade: { id: activityId}
  };

  try {
    const response = await axios.post(API_URL, relatorio);
    console.log('Relatório salvo com sucesso:', response.data);
    setFeedback(response.data);
  } catch (error) {
    console.error('Erro ao salvar o relatório:', error);
  }
};

  // Salvar o relatório quando o jogo terminar
  useEffect(() => {
    if (gameOver) {
      saveGameReport();
    }
  }, [gameOver]);

  return (
    <Box sx={styles.box} >
      {!gameStarted ? (
        <GameHeader 
          gameStarted={gameStarted} 
          onStartGame={startGame}
          game="Que animal é esse ?"
        />
      ) : (
      gameStarted && (
        gameOver ? (
        <GameOver 
          score={score}
          errors={errors}
          elapsedTime={elapsedTime}
          feedback={feedback}
          onRestart={restartGame}
          gameType="Que animal é esse ?"
        />
      ) : (
        <>
          <Card sx={styles.card}>
            <CardContent>
              <img
                src={currentPair.image}
                alt="Imagem para associar"
                width="100px"
                height="100px"
                style={styles.img}
              />
              {/* Espaços para as letras */}
              <Box sx={styles.lettersBox} >
                {Array.from(currentPair.correctWord).map((_, index) => (
                  <Box key={index} sx={styles.boxContent(selectedLetters, index)} >
                    {selectedLetters[index] || '_'}
                  </Box>
                ))}
              </Box>
              {/* Letras disponíveis para clicar */}
              <Grid container spacing={2}>
                {shuffledLetters.map((letter, index) => (
                  <Grid item xs={3} key={index}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleLetterClick(letter)}
                      sx={styles.button}
                    >
                      {letter}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              {/* Botão de limpar última letra */}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  fontFamily="Irish Grover"
                  color="secondary"
                  onClick={clearLastLetter}
                  disabled={selectedLetters.length === 0}
                >
                  Limpar Última Letra
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Box sx={styles.scoreboardBox}>
            <GameProgress 
              message={message}
              questionCount={currentIndex + 1}
              totalQuestions={imageWordPairs.length}
              showConfetti={showConfetti}
            />

            <ScoreBoard 
              score={score}
              errors={errors}
              questionCount={currentIndex + 1}
              totalQuestions={imageWordPairs.length}
            />
          </Box>
      </>
      )
      )
    )}
    </Box>
  );
};

export default ImageWordAssociationGame;
