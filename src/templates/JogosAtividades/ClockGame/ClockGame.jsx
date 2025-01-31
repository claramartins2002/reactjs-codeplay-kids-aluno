import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import trilha from '../../../sound/trilha3.mp3';
import acerto from '../../../sound/acerto.mp3';
import erro from '../../../sound/erro.mp3';
import AudioManager from '../../../utils/audioManager';
import { styles } from '../../../utils/styles';
import GameHeader from '../../../components/GameHeader';
import GameOver from '../../../components/GameOver';
import GameProgress from '../../../components/GameProgress';
import ScoreBoard from '../../../components/ScoreBoard';
import './styles.css';

const ClockGame = () => {
  const [time, setTime] = useState(generateRandomTime());
  const [inputHour, setInputHour] = useState("");
  const [inputMinute, setInputMinute] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [messageType, setMessageType] = useState(null);

  const { studentId } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');
  const API_URL = 'http://localhost:8080/relatorio';

  // Inicialização dos sons
  const [ambientSound] = useState(new AudioManager(trilha, { loop: true, volume: 0.3 }));
  const [correctSound] = useState(new AudioManager(acerto, { allowMultiplePlays: true }));
  const [wrongSound] = useState(new AudioManager(erro, { allowMultiplePlays: true }));

  function generateRandomTime() {
    const randomHour = Math.floor(Math.random() * 12) + 1;
    const randomMinute = Math.floor(Math.random() * 6) * 10;
    return new Date(0, 0, 0, randomHour, randomMinute);
  }

  // Limpeza do áudio
  useEffect(() => {
    return () => {
      document.title = "Jogo do Relógio";

      ambientSound.stop();
      correctSound.stop();
      wrongSound.stop();
    };
  }, []);

  // Controle do cronômetro
  useEffect(() => {
    const timer = setInterval(() => {
      if (gameStarted && !gameOver) {
        setElapsedTime((prevTime) => prevTime + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    ambientSound.play();
    setTime(generateRandomTime());
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'inputHour') {
      setInputHour(value);
    } else {
      setInputMinute(value);
    }
  };

  const handleSubmit = () => {
    if (gameOver) return;

    const userHour = parseInt(inputHour, 10);
    const userMinute = parseInt(inputMinute, 10);
    const isCorrect = userHour === time.getHours() && userMinute === time.getMinutes();

    if (isCorrect) {
      correctSound.play();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setScore(score + 1);
      setMessage('Acertou! 🎉');
      setMessageType('success');
    } else {
      wrongSound.play();
      setErrors(errors + 1);
      setMessage('Horário incorreto. Tente novamente! 😕');
      setMessageType('error');
    }

    if (questionCount < 10) {
      setTimeout(() => {
        setMessage('');
        setMessageType(null);
        setInputHour('');
        setInputMinute('');
        setTime(generateRandomTime());
        setQuestionCount(questionCount + 1);
      }, 1500);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setScore(0);
    setErrors(0);
    setQuestionCount(1);
    setTime(generateRandomTime());
    setGameOver(false);
    setInputHour('');
    setInputMinute('');
    setMessage('');
    setElapsedTime(0);
    setMessageType(null);
  };

  const saveGameReport = async () => {
    const relatorio = {
      aluno: { id: studentId },
      tipoAtividade: 'Relógio',
      pontuacao: score,
      erros: errors,
      acertos: score,
      tentativas: questionCount,
      tempoGasto: elapsedTime,
      atividade: { id: activityId }
    };

    try {
      const response = await axios.post(API_URL, relatorio);
      console.log('Relatório salvo com sucesso:', response.data);
      setFeedback(response.data);
    } catch (error) {
      console.error('Erro ao salvar o relatório:', error);
    }
  };

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
          game="Que horas são ?"
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
              gameType='relogio'
            />
          ) : (
            <>
              <div className="clock">
                {/* Ponteiro das horas */}
                <div
                  className="hour_hand"
                  style={{
                    transform: `rotateZ(${time.getHours() * 30}deg)` // 30 graus por hora
                  }}
                />

                {/* Ponteiro dos minutos */}
                <div
                  className="min_hand"
                  style={{
                    transform: `rotateZ(${time.getMinutes() * 6}deg)` // 6 graus por minuto
                  }}
                />

                {/* Números do relógio */}
                <span className="clock-number twelve">12</span>
                <span className="clock-number one">1</span>
                <span className="clock-number two">2</span>
                <span className="clock-number three">3</span>
                <span className="clock-number four">4</span>
                <span className="clock-number five">5</span>
                <span className="clock-number six">6</span>
                <span className="clock-number seven">7</span>
                <span className="clock-number eight">8</span>
                <span className="clock-number nine">9</span>
                <span className="clock-number ten">10</span>
                <span className="clock-number eleven">11</span>
              </div>

              <div className={`input-container ${messageType}`}>
                <input
                  type="number"
                  className="input-hour"
                  name="inputHour"
                  value={inputHour}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                />
                <span className="time-separator">:</span>
                <input
                  type="number"
                  className="input-min"
                  name="inputMinute"
                  value={inputMinute}
                  onChange={handleInputChange}
                  min="0"
                  max="59"
                  step="10"
                />
                <button onClick={handleSubmit} className="clock-game-button">
                  OK
                </button>
              </div>

              <div className="score-board-container">
                <GameProgress 
                  message={message}
                  questionCount={questionCount}
                  showConfetti={showConfetti}
                  totalQuestions={10}
                />
                
                <ScoreBoard 
                  score={score}
                  errors={errors}
                  questionCount={questionCount}
                  totalQuestions={10}
                />
              </div>
            </>
          )
        )
      )}
    </Box>
  );
};

export default ClockGame;
