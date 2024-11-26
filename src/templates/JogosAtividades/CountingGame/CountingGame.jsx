import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box, TextField } from '@mui/material';
import { green, red, blue, yellow, orange } from '@mui/material/colors';
import ConfettiExplosion from 'react-confetti-explosion';
import './CountingGame.css';

const getRandomCount = () => Math.floor(Math.random() * 5) + 1;

const FRUIT_TYPES = [
    { name: 'Apple', icon: <img src="https://cdn-icons-png.freepik.com/256/1449/1449726.png" alt="apple" width="80px" height="80px" className="fruit-img" /> },
    { name: 'Banana', icon: <img src="https://cdn-icons-png.freepik.com/256/11639/11639274.png" alt="banana" width="80px" height="80px" className="fruit-img" /> },
    { name: 'Pear', icon: <img src="https://cdn-icons-png.freepik.com/256/1680/1680474.png" alt="pear" width="80px" height="80px" className="fruit-img" /> },
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
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

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
        if (level === 0 && startTime === null) {
            setStartTime(Date.now()); // Registra o início do jogo
        }
    }, [level, startTime]);

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
            setLevel(level + 1);
            setTimeout(() => setShowConfetti(false), 2000);
        } else {
            setErrors(errors + 1);
            setMessage('Errou! 😞');
        }

        setTimeout(() => {
            setMessage('');
            setFruits(generateFruits(level + 1));
            setUserAnswers({ Apple: '', Banana: '', Pear: '' });
        }, 1500);

        if (level + 1 === 15) {
            setEndTime(Date.now()); // Registra o fim do jogo
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
                Jogo de Contagem de Frutas 🍎🍌🍐
            </Typography>
            {level >= 15 ? (
                <>
                    <Typography variant="h5" sx={{ color: green[700], mt: 2 }}>
                        Parabéns! Você completou o jogo! 🎉
                    </Typography>
                    <Typography variant="h6" sx={{ color: blue[900], mt: 2 }}>
                        Pontuação final: {score}
                    </Typography>
                    <Typography variant="h6" sx={{ color: red[700], mt: 1 }}>
                        Total de erros: {errors}
                    </Typography>
                    <Typography variant="h6" sx={{ color: blue[600], mt: 1 }}>
                        Tempo total: {getElapsedTime()}
                    </Typography>
                </>
            ) : (
                <Card
                    sx={{
                        maxWidth: 600,
                        backgroundColor: blue[100],
                        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                        borderRadius: 3,
                        padding: 2,
                    }}
                >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box
                            sx={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                margin: '10px',
                            }}
                        >
                            {fruits.map((fruit, index) => (
                                <span key={index}>{fruit.icon}</span>
                            ))}
                        </Box>
                        <div className="fruits-container">
                            {FRUIT_TYPES.map((fruit) => (
                                <Box key={fruit.name} sx={{ marginBottom: 2 }}>
                                    <Typography variant="h6" sx={{ color: orange[900] }}>
                                        Quantas {fruit.name === 'Apple' ? 'Maçãs' : fruit.name === 'Banana' ? 'Bananas' : 'Peras'}?
                                    </Typography>
                                    <TextField
                                        type="number"
                                        variant="outlined"
                                        value={userAnswers[fruit.name]}
                                        onChange={(e) => handleInputChange(fruit.name, e.target.value)}
                                        sx={{ width: '100%', backgroundColor: 'white' }}
                                    />
                                </Box>
                            ))}
                        </div>
                        <Button
                            variant="contained"
                            onClick={checkAnswers}
                            sx={{
                                backgroundColor: green[600],
                                color: 'white',
                                fontWeight: 'bold',
                                mt: 2,
                                '&:hover': { backgroundColor: green[800] },
                            }}
                        >
                            Verificar Respostas
                        </Button>
                    </CardContent>
                </Card>
            )}
            <Typography variant="h6" sx={{ mt: 2, color: green[600] }}>
                {message}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, color: blue[900] }}>
                Pontuação: {score}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, color: red[700] }}>
                Erros: {errors}
            </Typography>
            {showConfetti && <ConfettiExplosion />}
        </Box>
    );
};

export default CountingGame;
