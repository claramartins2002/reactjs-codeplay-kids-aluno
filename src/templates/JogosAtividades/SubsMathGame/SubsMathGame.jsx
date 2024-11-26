import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { green, red, blue, yellow, grey } from '@mui/material/colors';

// Função para gerar questões de subtração
const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 20) + 1; // Primeiro número maior
    const num2 = Math.floor(Math.random() * num1) + 1; // Segundo número sempre menor ou igual ao primeiro
    const correctAnswer = num1 - num2;

    // Gera respostas erradas
    const wrongAnswer1 = correctAnswer + Math.floor(Math.random() * 3) + 1;
    const wrongAnswer2 = correctAnswer - Math.floor(Math.random() * 3) - 1;

    const answers = [correctAnswer, wrongAnswer1, wrongAnswer2].sort(() => Math.random() - 0.5);

    return {
        question: `${num1} - ${num2} = ?`,
        correctAnswer,
        answers,
    };
};

const SubsMathGame = () => {
    const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [message, setMessage] = useState('');
    const [questionCount, setQuestionCount] = useState(1);
    const [elapsedTime, setElapsedTime] = useState(0); // Cronômetro
    const [gameOver, setGameOver] = useState(false);

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

        setSelectedAnswer(answer); // Armazena a resposta selecionada

        if (answer === currentQuestion.correctAnswer) {
            setScore(score + 1);
            setMessage('Acertou! 🎉');
        } else {
            setErrors(errors + 1);
            setMessage('Errou! 😞');
        }

        if (questionCount < 15) {
            setTimeout(() => {
                setMessage('');
                setSelectedAnswer(null);
                setCurrentQuestion(generateQuestion());
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
        setCurrentQuestion(generateQuestion());
        setGameOver(false);
        setSelectedAnswer(null);
        setMessage('');
    };

    return (
        <Box
            sx={{
                backgroundColor: yellow[50],
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: 3,
            }}
        >
            <Typography variant="h4" sx={{ mb: 2, color: blue[700], fontWeight: 'bold' }}>
                Jogo de Subtração 🎓
            </Typography>
            {!gameOver ? (
                <>
                    <Card
                        sx={{
                            minWidth: 300,
                            backgroundColor: blue[100],
                            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                            borderRadius: 3,
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" sx={{ mb: 3, color: blue[900] }}>
                                {currentQuestion.question}
                            </Typography>
                            <Grid container spacing={2}>
                                {currentQuestion.answers.map((answer, index) => (
                                    <Grid item xs={4} key={index}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={() => handleAnswer(answer)}
                                            sx={{
                                                backgroundColor:
                                                    selectedAnswer === null
                                                        ? grey[400]
                                                        : answer === currentQuestion.correctAnswer
                                                        ? green[400]
                                                        : selectedAnswer === answer
                                                        ? red[400]
                                                        : grey[400],
                                                '&:hover': {
                                                    backgroundColor:
                                                        selectedAnswer === null
                                                            ? grey[600]
                                                            : answer === currentQuestion.correctAnswer
                                                            ? green[600]
                                                            : selectedAnswer === answer
                                                            ? red[600]
                                                            : grey[600],
                                                },
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                color: 'white',
                                                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                                            }}
                                        >
                                            {answer}
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
                        Pontuação: {score}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, color: red[700] }}>
                        Erros: {errors}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, color: blue[900] }}>
                        Pergunta {questionCount} de 15
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, color: red[700] }}>
                        Tempo decorrido: {elapsedTime}s
                    </Typography>
                </>
            ) : (
                <Box textAlign="center">
                    <Typography variant="h5" sx={{ mb: 2, color: blue[700] }}>
                        Fim do Jogo!
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2, color: green[600] }}>
                        Pontuação Final: {score}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2, color: red[700] }}>
                        Erros: {errors}
                    </Typography>
                    <Typography variant="h6">Tempo decorrido: {elapsedTime}s</Typography>
                    {gameOver && <Typography>Você completou o jogo em {elapsedTime} segundos!</Typography>}
                    <Button
                        variant="contained"
                        onClick={restartGame}
                        sx={{
                            backgroundColor: blue[500],
                            '&:hover': { backgroundColor: blue[700] },
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: 'white',
                        }}
                    >
                        Jogar Novamente
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default SubsMathGame;
