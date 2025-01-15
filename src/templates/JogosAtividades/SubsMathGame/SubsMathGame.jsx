import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import trilha from '../../../sound/trilha.mp3';
import acerto from '../../../sound/acerto.mp3';
import erro from '../../../sound/erro.mp3';
import AudioManager from '../../../utils/audioManager';
import { styles } from '../../../utils/styles';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../../AuthContext';
import { generateSubtractionQuestion } from '../../../utils/mathGameUtils';
import GameHeader from '../../../components/GameHeader';
import GameOver from '../../../components/GameOver';
import QuestionCard from '../../../components/QuestionCard';
import GameProgress from '../../../components/GameProgress';
import ScoreBoard from '../../../components/ScoreBoard';

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
      document.title = "Divisão de Números";
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
      {!gameStarted ? (
        <GameHeader 
          gameStarted={gameStarted} 
          onStartGame={startGame}
          game="Subtração de Números"
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
            />
          ) : (
            <>
              <QuestionCard 
                question={currentQuestion.question}
                answers={currentQuestion.answers}
                onAnswerClick={handleAnswer}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentQuestion.correctAnswer}
                game="Subtração de Números"
              />

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

export default SubsMathGame;
