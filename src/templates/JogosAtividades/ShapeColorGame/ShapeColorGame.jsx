import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { green, red, blue, yellow, pink, purple, orange } from '@mui/material/colors';
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

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
  const shapeStyle = {
    backgroundColor: color,
    width: '100px',
    height: '100px',
    display: 'inline-block',
  };

  switch (shape) {
    case 'círculo':
      return <div style={{ ...shapeStyle, borderRadius: '50%' }}></div>;
    case 'quadrado':
      return <div style={{ ...shapeStyle }}></div>;
    case 'triângulo':
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '50px solid transparent',
            borderRight: '50px solid transparent',
            borderBottom: `100px solid ${color}`,
            display: 'inline-block',
          }}
        ></div>
      );
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
// Controle do cronômetro
useEffect(() => {
  const timer = setInterval(() => {
      if (!gameOver) {
          setElapsedTime((prevTime) => prevTime + 1);
      }
  }, 1000);
  return () => clearInterval(timer);
}, [gameOver]);

  const handleAnswer = (answer) => {
    if (gameOver) return;

    if (answer === currentShapeColor.correctLabel) {
      setScore(score + 1);
      setMessage('Acertou! 🎉');
    } else {
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
      tipoAtividade: 'Operações Matemáticas', // Tipo da atividade
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 3,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, color: blue[700], fontWeight: 'bold' }}>
        Jogo de Formas e Cores 🎨🔵
      </Typography>
      {!gameOver ? (
        <>
          <Card
            sx={{
              maxWidth: 400,
              backgroundColor: blue[100],
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 2,
                }}
              >
                {renderShape(currentShapeColor.shape, currentShapeColor.color)}
              </Box>
              <Grid container spacing={2}>
                {currentShapeColor.options.map((option, index) => (
                  <Grid item xs={4} key={index}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleAnswer(option)}
                      sx={{
                        backgroundColor: blue[400],
                        '&:hover': {
                          backgroundColor: blue[600],
                        },
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: 'white',
                        boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                      }}
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          <Typography variant="h6" sx={{ mt: 2, color: green[600] }}>
            {message}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, color: blue[900] }}>
            Pontuação: {score} | Questão: {questionCount}/15
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, color: red[700] }}>
            Erros: {errors}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h5" sx={{ color: green[600] }}>
            Jogo finalizado! 🎉
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, color: blue[900] }}>
            Pontuação final: {score}/15
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, color: blue[900] }}>
            Tempo total: {elapsedTime} s
          </Typography>
          <Typography> {feedback}</Typography>
          
        </>
      )}
    </Box>
  );
};

export default ShapeColorGame;
