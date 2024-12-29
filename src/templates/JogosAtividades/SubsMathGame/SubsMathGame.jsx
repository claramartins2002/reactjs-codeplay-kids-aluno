import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardContent, Typography, Grid, Box, LinearProgress } from '@mui/material';
import { green, red, blue } from '@mui/material/colors';
import trilha from '../../../sound/trilha.mp3';
import acerto from '../../../sound/acerto.mp3';
import erro from '../../../sound/erro.mp3';
import ConfettiExplosion from 'react-confetti-explosion';
import AudioManager from '../../../utils/audioManager';
import { styles } from '../../../utils/styles';
import axios from 'axios'; // Biblioteca para requisições HTTP
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../../AuthContext';
import { generateSubtractionQuestion } from '../../../utils/mathGameUtils';

const SubsMathGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(generateSubtractionQuestion());
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [message, setMessage] = useState('');
  const [questionCount, setQuestionCount] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0); // Cronômetro
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
  const { studentId} = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id'); // Captura o 'id' da atividade

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
    setCurrentQuestion(generateSubtractionQuestion());
  };

  const handleAnswer = (answer) => {
    if (gameOver) return;

    setSelectedAnswer(answer); // Armazena a resposta selecionada

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setMessage('Acertou! 🎉');
      correctSound.play();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
    } else {
      wrongSound.play();
      setErrors(errors + 1);
      setMessage('Errou! 😞');
    }

    if (questionCount < 15) {
      setTimeout(() => {
        setMessage('');
        setSelectedAnswer(null);
        setCurrentQuestion(generateSubtractionQuestion());
        setQuestionCount(questionCount + 1); // Incrementa o número de questões
      }, 1000);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setScore(0);
    setErrors(0);
    setQuestionCount(1);
    setCurrentQuestion(generateSubtractionQuestion());
    setGameOver(false);
    setSelectedAnswer(null);
    setMessage('');
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
    <Box sx={styles.container}>
      <Typography variant="h3" sx={styles.title}>
        Jogo de Matemática 🎓
      </Typography>
      {!gameStarted ? (
        <Button
          variant="contained"
          onClick={startGame}
          sx={styles.startButton}
        >
          Iniciar Jogo
        </Button>
      ) : gameOver ? (
        <Box sx={styles.container}>
          <Typography variant="h5" sx={styles.gameOverTitle}>
            Fim do Jogo!
          </Typography>
          <Typography variant="h6" sx={{fontFamily: 'Irish Grover'}}>
              Tempo decorrido: {elapsedTime}s
          </Typography>
          <Typography variant="h6" sx={{ color: green[600], fontFamily: 'Irish Grover' }}>
              Pontuação Final: {score}
          </Typography>
          <Typography variant="h6" sx={{ color: red[700], fontFamily: 'Irish Grover' }}>
              Erros: {errors}
          </Typography>
          <Typography variant="h5" sx={{fontFamily: 'Irish Grover', color: blue[700]}} >
              {feedback}
          </Typography>
          <Button
            variant="contained"
            onClick={restartGame}
            sx={styles.restartButton}
          >
              Jogar Novamente
            </Button>
        </Box>
      ) : (
        <>
            <Card sx={styles.gameCard}>
              <CardContent>
                <Typography variant="h5" sx={styles.question}>
                  {currentQuestion.question}
                </Typography>
                <Grid container spacing={2}>
                  {currentQuestion.answers.map((answer, index) => (
                    <Grid item xs={4} key={index}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleAnswer(answer)}
                        sx={styles.answerButton(selectedAnswer, answer, currentQuestion.correctAnswer)}
                      >
                        {answer}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
            <Typography
                variant="h6"
                sx={{ mt: 2, color: green[600], fontStyle: 'italic' }}
            >
                {message}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(questionCount / 15) * 100}
              sx={styles.progressBar}
            />
            {showConfetti && <ConfettiExplosion />}

            <Box sx={styles.scoreBoard}>
              <Typography variant="h6" sx={styles.score}>
                Pontuação: {score}
              </Typography>
              <Typography variant="h6" sx={styles.errors}>
                Erros: {errors}
              </Typography>
              <Typography variant="h6" sx={styles.questionCounter}>
                Pergunta {questionCount} de 15
              </Typography>
            </Box>
        </>
      )}
  </Box>
  );
};

export default SubsMathGame;
