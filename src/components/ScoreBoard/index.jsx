import React from 'react';
import { Box, Typography } from '@mui/material';
import { styles } from '../../utils/styles';

const ScoreBoard = ({ score, errors, questionCount, totalQuestions = 15 }) => {
    return (
        <Box sx={styles.scoreBoard}>
            <Typography variant="h6" sx={styles.score}>
                Pontuação: {score}
            </Typography>
            <Typography variant="h6" sx={styles.errors}>
                Erros: {errors}
            </Typography>
            <Typography variant="h6" sx={styles.questionCounter}>
                Pergunta {questionCount} de {totalQuestions}
            </Typography>
        </Box>
    );
};

export default ScoreBoard; 