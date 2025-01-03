import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardContent, Box } from '@mui/material';
import './CountingGame.css';
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import trilha from '../../../sound/trilha3.mp3';
import acerto from '../../../sound/acerto.mp3';
import erro from '../../../sound/erro.mp3';
import AudioManager from '../../../utils/audioManager';
import { styles } from './styles';
import GameHeader from '../../../components/GameHeader';
import GameOver from '../../../components/GameOver';
import GameProgress from '../../../components/GameProgress';
import ScoreBoard from '../../../components/ScoreBoard';

const getRandomCount = () => Math.floor(Math.random() * 5) + 1;

const FRUIT_TYPES = [
    { name: 'Apple', icon: <img src="https://cdn-icons-png.freepik.com/256/1449/1449726.png" alt="apple" width="70px" height="70px" className="fruit-img" /> },
    { name: 'Banana', icon: <img src="https://cdn-icons-png.freepik.com/256/11639/11639274.png" alt="banana" width="70px" height="70px" className="fruit-img" /> },
    { name: 'Pear', icon: <img src="https://cdn-icons-png.freepik.com/256/1680/1680474.png" alt="pear" width="70px" height="70px" className="fruit-img" /> },
];

const generateFruits = (level) => {
  const fruits = [];
  for (let i = 0; i < level + 2; i++) {
    const count = getRandomCount();
    const fruitType = FRUIT_TYPES[i % FRUIT_TYPES.length];
    for (let j = 0; j < count; j++) {
      fruits.push(fruitType);
    }
  }
  return fruits;
};

const CountingGame = () => {
  const [fruits, setFruits] = useState(generateFruits(0));
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [message, setMessage] = useState('');
  const [userAnswers, setUserAnswers] = useState({ Apple: '', Banana: '', Pear: '' });
  const [showConfetti, setShowConfetti] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
  const { studentId } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id'); // Captura o 'id' da atividade
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [feedback, setFeedback] = useState('');

  // Inicialização dos sons
  const [ambientSound] = useState(new AudioManager(trilha, { loop: true, volume: 0.3 }));
  const [correctSound] = useState(new AudioManager(acerto, { allowMultiplePlays: true }));
  const [wrongSound] = useState(new AudioManager(erro, { allowMultiplePlays: true }));

  // Limpeza do áudio
    useEffect(() => {
      return () => {
        ambientSound.stop();
        correctSound.stop();
        wrongSound.stop();
      };
    }, []);

  const countFruitsByType = () => {
    return FRUIT_TYPES.map((fruit) => ({
      name: fruit.name,
      count: fruits.filter((f) => f.name === fruit.name).length,
    }));
  };

  const [fruitCounts, setFruitCounts] = useState(countFruitsByType());

  useEffect(() => {
      setFruitCounts(countFruitsByType());
  }, [fruits]);

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
  };

  const handleInputChange = (fruitName, value) => {
    setUserAnswers({ ...userAnswers, [fruitName]: value });
  };

  const checkAnswers = () => {
    let isCorrect = true;
    FRUIT_TYPES.forEach((fruit) => {
      const correctCount = fruitCounts.find((f) => f.name === fruit.name).count;
      if (parseInt(userAnswers[fruit.name] || '0') !== correctCount) {
        isCorrect = false;
      }
    });

    if (isCorrect) {
      correctSound.play();
      setScore(score + 1);
      setMessage('Acertou! 🎉');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      wrongSound.play();
      setErrors(errors + 1);
      setMessage('Errou! 😞');
    }

    if (questionCount < 7) {
      setTimeout(() => {
        setMessage('');
        setFruits(generateFruits(level + 1));
        setUserAnswers({ Apple: '', Banana: '', Pear: '' });
        setLevel(level + 1);
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
    setGameOver(false);
    setMessage('');
    setElapsedTime(0);
    setUserAnswers({ Apple: '', Banana: '', Pear: '' })
    setFruits(generateFruits(0));
  };

  const saveGameReport = async () => {
    const relatorio = {
      aluno: { id: studentId },
      tipoAtividade: 'Quantas frutas têm ?',
      pontuacao: score,
      erros: errors,
      acertos: score,
      tentativas: questionCount,
      tempoGasto: elapsedTime,
      atividade: { id: activityId },
    };

    try {
      const response = await axios.post(API_URL, relatorio);
      console.log('Relatório salvo com sucesso:', response.data);
      setFeedback(response.data);
    } catch (error) {
      console.log(relatorio)
      console.error('Erro ao salvar o relatório:', error);
    }
  };

  useEffect(() => {
    if (gameOver) {
      saveGameReport();
    }
  }, [gameOver]);

  return (
    <Box sx={styles.box} >
      <GameHeader 
        gameStarted={gameStarted} 
        onStartGame={startGame}
        game="Quantas frutas têm ?"
      />
      {gameStarted && (
        gameOver ? (
          <GameOver 
            score={score}
            errors={errors}
            elapsedTime={elapsedTime}
            feedback={feedback}
            onRestart={restartGame}
            gameType='Quantas frutas têm ?'
          />
        ) : (
          <Card sx={styles.card} >
            <CardContent sx={{ display: 'flex', flexDirection: 'row-reverse', padding: '0 !important', justifyContent: 'space-between' }}>
              <Box sx={styles.fruitsBox}>
                {fruits.map((fruit, index) => (
                    <span key={index}>{fruit.icon}</span>
                ))}
              </Box>
                <div className="fruits-container">
                  {FRUIT_TYPES.map((fruit) => (
                    <Box key={fruit.name} sx={{ margin: '0.5rem', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <span>{fruit.icon}</span>
                      <span className="separator-answer">=</span>
                      <input
                        type="number"
                        className="input-answer-fruits"
                        value={userAnswers[fruit.name]}
                        onChange={(e) => handleInputChange(fruit.name, e.target.value)}
                      />
                    </Box>
                  ))}
                  <Button
                    variant="contained"
                    onClick={checkAnswers}
                    sx={styles.button}
                  >
                    Responder
                  </Button>
                </div>

                <div className="score-board-container">
                  <GameProgress 
                    message={message}
                    questionCount={questionCount}
                    showConfetti={showConfetti}
                    totalQuestions={7}
                  />
                  
                  <ScoreBoard 
                    score={score}
                    errors={errors}
                    questionCount={questionCount}
                    totalQuestions={7}
                  />
                </div>
              </CardContent>
          </Card>
        )
      )}
    </Box>
  );
};

export default CountingGame;
