import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { green, red, blue, yellow, pink, purple, orange } from '@mui/material/colors';
import { AuthContext } from '../../../AuthContext';
import trilha from '../../../sound/trilha.mp3';
import acerto from '../../../sound/acerto.mp3';
import erro from '../../../sound/erro.mp3';
import AudioManager from '../../../utils/audioManager';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import GameHeader from '../../../components/GameHeader';
import GameOver from '../../../components/GameOver';
import ScoreBoard from '../../../components/ScoreBoard';
import { styles } from './styles';
import GameProgress from '../../../components/GameProgress';

// Conjunto de formas e cores para reconhecimento
const shapes = ['círculo', 'quadrado', 'triângulo'];
const colors = {
  'vermelho': red,
  'azul': blue,
  'verde': green,
  'amarelo': yellow,
  'roxo': purple,
  'rosa': pink,
  'laranja': orange,
};

// Função para gerar uma forma e cor aleatória
const getRandomShapeColor = () => {
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  const colorKeys = Object.keys(colors);
  const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
  const randomColor = colors[randomColorKey];
  const correctLabel = `${capitalize(randomShape)} ${randomColorKey}`;

  // Gerar opções de respostas (incluindo a correta)
  const options = [correctLabel];
  while (options.length < 3) {
    const randomShapeOption = shapes[Math.floor(Math.random() * shapes.length)];
    const randomColorOptionKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    const option = `${capitalize(randomShapeOption)} ${randomColorOptionKey}`;

    if (!options.includes(option)) {
      options.push(option);
    }
  }

  // Embaralhar as opções
  const shuffledOptions = options.sort(() => Math.random() - 0.5);

  return { shape: randomShape, color: randomColor[500], correctLabel, options: shuffledOptions };
};

// Função auxiliar para capitalizar a primeira letra
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Função para renderizar a forma
const renderShape = (shape, color) => {

  switch (shape) {
    case 'círculo':
      return <div style={{ ...styles.shapeStyle(color), borderRadius: '50%' }}></div>;
    case 'quadrado':
      return <div style={{ ...styles.shapeStyle(color) }}></div>;
    case 'triângulo':
      return ( <Box sx={styles.renderShape(color)}></Box> );
    default:
      return null;
  }
};

const ShapeColorGame = () => {
  const [currentShapeColor, setCurrentShapeColor] = useState(getRandomShapeColor());
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [message, setMessage] = useState('');
  const [questionCount, setQuestionCount] = useState(1);
  const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
  const { studentId } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id'); // Captura o 'id' da atividade
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0); // Cronômetro
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Inicialização dos sons
  const [ambientSound] = useState(new AudioManager(trilha, { loop: true, volume: 0.3 }));
  const [correctSound] = useState(new AudioManager(acerto, { allowMultiplePlays: true }));
  const [wrongSound] = useState(new AudioManager(erro, { allowMultiplePlays: true }));

  // Limpeza do áudio quando o componente for desmontado
  useEffect(() => {
    return () => {
      document.title = "Formas e Cores";
      ambientSound.stop();
      correctSound.stop();
      wrongSound.stop();
    };
  }, []);

  // Controle do cronômetro
  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver) {
        setElapsedTime((prevTime) => prevTime + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  const startGame = () => {
    setGameStarted(true);
    ambientSound.play();
  };

  const restartGame = () => {
    setScore(0);
    setErrors(0);
    setQuestionCount(1);
    setGameOver(false);
    setMessage('');
  };

  const handleAnswer = (answer) => {
    if (gameOver) return;

    if (answer === currentShapeColor.correctLabel) {
      setScore(score + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setMessage('Acertou! 🎉');
      correctSound.play();
    } else {
      wrongSound.play();
      setErrors(errors + 1);
      setMessage('Errou! 😞');
      
    }

    if (questionCount < 15) {
      setTimeout(() => {
        setMessage('');
        setCurrentShapeColor(getRandomShapeColor());
        setQuestionCount(questionCount + 1);
      }, 1000);
    } else {
      // Finaliza o jogo na última questão
      setGameOver(true);
    }
  };

 // Função para enviar os dados para o backend
 const saveGameReport = async () => {
  const relatorio = {
      aluno: {id: studentId}, // ID do aluno
      tipoAtividade: 'Formas e Cores', // Tipo da atividade
      pontuacao: score,
      erros: errors,
      acertos: score,
      tentativas: questionCount,
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
    <Box sx={styles.container}>
      {!gameStarted ? (
        <GameHeader 
          gameStarted={gameStarted} 
          onStartGame={startGame}
          game="Formas e Cores"
        />
      ) : (
        gameStarted && (
          gameOver ? (
            <>
              <GameOver 
                score={score}
                errors={errors}
                elapsedTime={elapsedTime}
                feedback={feedback}
                onRestart={restartGame}
              />
            </>
          ) : (
            <>
              <Box sx={styles.titleBox}>
                <Typography sx ={{fontFamily: 'Irish Grover', fontSize: '38px'}}>
                  Formas e Cores
                </Typography>
                <Typography sx ={{fontFamily: 'Coming Soon'}}>
                  Responda qual e a forma geométrica e sua cor
                </Typography>
              </Box>
              <Card sx={styles.card}>
                <CardContent>
                  <Box sx={styles.box}>
                    {renderShape(currentShapeColor.shape, currentShapeColor.color)}
                  </Box>
                  <Grid container spacing={2}>
                    {currentShapeColor.options.map((option, index) => (
                      <Grid item xs={4} key={index}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleAnswer(option)}
                          sx={styles.button}
                        >
                          {option}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
              <div className="score-board-container">
                <GameProgress 
                  message={message}
                  questionCount={questionCount}
                  showConfetti={showConfetti}
                />
                <ScoreBoard 
                  score={score}
                  errors={errors}
                  questionCount={questionCount}
                />
              </div>
              
            </>
          )
        )
      )}
    </Box>
  );
};

export default ShapeColorGame;
