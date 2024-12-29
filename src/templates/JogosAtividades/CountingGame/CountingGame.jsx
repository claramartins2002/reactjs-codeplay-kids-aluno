import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import { green, red, blue } from '@mui/material/colors';
import ConfettiExplosion from 'react-confetti-explosion';
import './CountingGame.css';
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ResultadoFinal from './components/ResultadoFinal/ResultadoFinal';
import JogoCompletado from './components/JogoCompletado/JogoCompletado';

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
  const [questionCount, setQuestionCount] = useState(1);
  const [feedback, setFeedback] = useState('');

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
      if (!gameOver) {
        setElapsedTime((prevTime) => prevTime + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

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
      setScore(score + 1);
      setMessage('Acertou! 🎉');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setErrors(errors + 1);
      setMessage('Errou! 😞');
    }

    if (questionCount < 5) {
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

  const saveGameReport = async () => {
    const relatorio = {
      aluno: { id: studentId },
      tipoAtividade: 'Operações Matemáticas',
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
    <Box
      sx={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 3,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, color: '#3c9fff', fontWeight: 'bold', fontFamily: 'Gorditas', }}>
        Quantas frutas têm ?
      </Typography>
          {gameOver ? (
            <ResultadoFinal score={score} feedback={feedback} errors={errors} elapsedTime={elapsedTime}/>
          ) : (
            <Card
              sx={{
                maxWidth: '40%',
                maxHeight: '50%',
                backgroundColor: '#e3f1ff',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'row-reverse', padding: '0 !important' }}>
                <Box
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    margin: '10px',
                    fontFamily: 'Irish Grover'
                  }}
                >
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
                      sx={{
                        background: '#4CAF50',
                        boxShadow: '0 5px #2e7d32',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        color: 'white',
                        width: '75%',
                        fontFamily: 'Gorditas',
                        mt: 2,
                        '&:hover': { background: '#4CAF50', boxShadow: '0 5px #2e7d32' },
                        '&:active': { transform: 'translateY(6px)', boxShadow: '0' }
                      }}
                    >
                      Responder
                    </Button>
                  </div>
                </CardContent>
            </Card>
          )}
        { !gameOver ? (
          <JogoCompletado score={score} message={message} errors={errors} />
        ) : (
          <>
          </>
        )}
        {showConfetti && <ConfettiExplosion />}
    </Box>
  );
};

export default CountingGame;
