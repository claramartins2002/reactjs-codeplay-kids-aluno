import React, { useState, useEffect, useContext, act } from 'react';
import { Button, Card, CardContent, Typography, Grid, Box, LinearProgress } from '@mui/material';
import { green, red, blue, yellow, grey } from '@mui/material/colors';
import axios from 'axios'; // Biblioteca para requisições HTTP
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import trilha from '../../../sound/trilha.mp3';
import acerto from '../../../sound/acerto.mp3';
import erro from '../../../sound/erro.mp3';
import ConfettiExplosion from 'react-confetti-explosion';

// Função para gerar questões de matemática
const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;
    const wrongAnswer1 = correctAnswer + Math.floor(Math.random() * 3) + 1;
    const wrongAnswer2 = correctAnswer - Math.floor(Math.random() * 3) - 1;

    const answers = [correctAnswer, wrongAnswer1, wrongAnswer2].sort(() => Math.random() - 0.5);

    return {
        question: `${num1} + ${num2} = ?`,
        correctAnswer,
        answers,
    };
};

const AddMathGame = () => {
    const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [message, setMessage] = useState('');
    const [questionCount, setQuestionCount] = useState(1); // Contador de operações
    const [elapsedTime, setElapsedTime] = useState(0); // Cronômetro
    const [gameOver, setGameOver] = useState(false); // Estado para finalizar o jogo
    const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
    const { studentId} = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const activityId = searchParams.get('id'); // Captura o 'id' da atividade
    const [feedback, setFeedback] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Importando sons
const correctSound = new Audio(acerto);
const wrongSound = new Audio(erro);
const ambientAudio = new Audio(trilha);


    // Controle do cronômetro
    useEffect(() => {
        const timer = setInterval(() => {
            if (!gameOver) {
                setElapsedTime((prevTime) => prevTime + 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [gameOver]);

    
// Garante que o áudio de fundo será configurado corretamente
useEffect(() => {
    ambientAudio.loop = true;
    ambientAudio.volume = 0.5;
    ambientAudio.play().catch((error) => {
      console.error('Erro ao reproduzir áudio:', error);
  });

    return () => {
        ambientAudio.pause();
        ambientAudio.currentTime = 0;
    };
}, []);

const startGame = () => {
    setGameStarted(true);
    ambientAudio.play().catch((error) => {
        console.error('Erro ao reproduzir áudio:', error);
    });
    setCurrentQuestion(generateQuestion());
};

    const handleAnswer = (answer) => {
        if (gameOver) return;

        setSelectedAnswer(answer); // Armazena a resposta selecionada

        if (answer === currentQuestion.correctAnswer) {
            correctSound.play();
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
            setScore(score + 1);
            setMessage('Acertou! 🎉');
        } else {
            wrongSound.play();
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
            padding: 1,
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(231,231,246,1) 35%, rgba(175,223,253,1) 100%)'

        }}
    >
        <Typography
            variant="h3"
            sx={{
                mb: 2,
                color: blue[700],
                fontWeight: 'bold',
                fontFamily: 'Irish Grover',
            }}
        >
            Jogo de Matemática 🎓
        </Typography>
        {!gameStarted ? (
            <Button
                variant="contained"
                onClick={startGame}
                sx={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    padding: '1%',
                    fontFamily: 'Irish Grover',
                    backgroundColor: blue[500],
                    color: 'white',
                    '&:hover': {
                        backgroundColor: blue[500],
                    },
                }}
            >
                Iniciar Jogo
            </Button>
        ) : gameOver ? (
            <Box textAlign="center" fontFamily="Irish Grover" backgroundColor="#91ddcf">
                <Typography
                    variant="h5"
                    sx={{ mb: 2, color: blue[700], fontWeight: 'bold', fontFamily: 'Irish Grover',
                    }}
                >
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
                    sx={{
                        mt: 3,
                        backgroundColor: blue[500],
                        '&:hover': { backgroundColor: blue[700] },
                        fontSize: '1rem',
                        color: 'white',
                        fontFamily: 'Irish Grover'
                    }}
                >
                    Jogar Novamente
                </Button>
            </Box>
        ) : (
            <>
                <Card
                    sx={{
                        minWidth: 800,
                        backgroundColor: '#91ddcf',
                        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                        borderRadius: 3,
                        fontFamily: 'Irish Grover',
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 3,
                                color: 'white',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontFamily: 'Irish Grover',
                                fontSize: '5rem'
                            }}
                        >
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
                                            fontSize: '4rem',
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
                                            fontWeight: 'bold',
                                            color: 'white',
                                            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                                            fontFamily: 'Irish Grover',

                                        }}
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
                    sx={{
                        mt: 2,
                        height: 50,
                        borderRadius: 5,
                        backgroundColor: grey[300],
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: blue[500],
                        },
                    }}
                />
                {showConfetti && <ConfettiExplosion />}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        mt: 2,
                        px: 2,

                    }}
                >
                    <Typography variant="h6" sx={{ color: blue[900],fontFamily: 'Irish Grover',
 }}>
                        Pontuação: {score}
                    </Typography>
                    <Typography variant="h6" sx={{ color: red[700],fontFamily: 'Irish Grover',
 }}>
                        Erros: {errors}
                    </Typography>
                    <Typography variant="h6" sx={{ color: blue[900], fontFamily: 'Irish Grover',
 }}>
                        Pergunta {questionCount} de 15
                    </Typography>
                </Box>
            </>
        )}
    </Box>
    );
};

export default AddMathGame;
