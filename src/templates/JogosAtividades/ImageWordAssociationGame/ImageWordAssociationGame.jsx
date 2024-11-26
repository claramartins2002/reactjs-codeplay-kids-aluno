import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

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
    const [isGameOver, setIsGameOver] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        setShuffledLetters(getShuffledLetters(currentPair.correctWord));
        setSelectedLetters([]);
    }, [currentPair]);

    useEffect(() => {
        // Inicia o cronômetro no início do jogo
        if (currentIndex === 0 && !startTime) {
            setStartTime(Date.now());
        }
    }, [currentIndex, startTime]);

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
            setIsGameOver(true); // Jogo terminou quando todos os pares são usados
            setEndTime(Date.now()); // Finaliza o cronômetro
        }
    };

    const getElapsedTime = () => {
        if (startTime && endTime) {
            const elapsed = Math.floor((endTime - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            return `${minutes}m ${seconds}s`;
        }
        return 'Calculando...';
    };

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
            {isGameOver ? (
                <>
                    <Typography variant="h5" sx={{ mt: 2, color: '#38aa38' }}>
                        Fim do Jogo! 🎉
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, color: '#587ee6' }}>
                        Pontuação final: {score}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, color: '#587ee6' }}>
                        Tempo total: {getElapsedTime()}
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
