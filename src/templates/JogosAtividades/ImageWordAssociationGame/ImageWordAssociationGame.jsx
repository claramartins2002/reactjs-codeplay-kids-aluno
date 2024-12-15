import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

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
    const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
    const { studentId} = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const activityId = searchParams.get('id'); // Captura o 'id' da atividade
    const [feedback, setFeedback] = useState('');

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
            setScore(score + 1);
            setMessage('Acertou! 🎉');
            setTimeout(() => {
                setMessage('');
                goToNextPair();
            }, 1500);
        } else {
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
            <Typography variant="h4" sx={{ mb: 2, color: '#516ff5', fontWeight: 'bold', fontFamily: 'Irish Grover',
 }}>
                Que animal é esse?
            </Typography>
            {gameOver ? (
                <>
                    <Typography variant="h5" sx={{ mt: 2, color: '#38aa38' }}>
                        Fim do Jogo! 🎉
                    </Typography>
                    <Typography> {feedback}</Typography>
                    <Typography variant="h6" sx={{ mt: 2, color: '#587ee6' }}>
                        Pontuação final: {score}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, color: '#587ee6' }}>
                        Tempo total: {elapsedTime}s
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, color: '#e44d4d' }}>
                        Total de erros: {errors}
                    </Typography>
                </>
            ) : (
                <Card
                    sx={{
                        maxWidth: '50%',
                        backgroundColor: '#6fa3df',
                        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                        borderRadius: 3,
                        flexDirection: 'column',
                    }}
                >
                    <CardContent>
                        <img
                            src={currentPair.image}
                            alt="Imagem para associar"
                            width="100px"
                            height="100px"
                            style={{
                                objectFit: 'cover',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                display: 'flex',
                                margin: 'auto auto 15px auto',
                            }}
                        />
                        {/* Espaços para as letras */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mb: 2,
                                gap: 1,
                            }}
                        >
                            {Array.from(currentPair.correctWord).map((_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: '60px',
                                        height: '60px',
                                        backgroundColor: selectedLetters[index] ? '#F2C572' : '#F2E8B3',
                                        borderBottom: selectedLetters[index] ? '0.6rem solid #F28705' : '0.6rem solid #F2C84B',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '15px',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        fontFamily: 'Irish Grover',
                                    }}
                                >
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
                                        sx={{
                                            backgroundColor: '#ab77db',
                                            '&:hover': {
                                                backgroundColor: '#9952db',
                                            },
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            fontFamily: 'Irish Grover',
                                            color: '#FFF',
                                            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                                            border: '2px dashed #FFF',
                                            padding: '8px 16px',
                                            borderRadius: '10px',
                                            width: '60px',
                                            height: '60px',
                                        }}
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
            )}
            <Typography variant="h6" sx={{ mt: 2, color: '#4dad52fff' }}>
                {message}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, color: '#587ee6' }} fontFamily='Irish Grover'>
                Pontuação: {score}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, color: '#e44d4d' }} fontFamily='Irish Grover'>
                Erros: {errors}
            </Typography>
        </Box>
    );
};

export default ImageWordAssociationGame;
