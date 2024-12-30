import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { styles } from '../../utils/styles';

const QuestionCard = ({ question, answers, onAnswerClick, selectedAnswer, correctAnswer }) => {
  return (
    <Card sx={styles.gameCard}>
      <CardContent>
        <Typography variant="h5" sx={styles.question}>
            {question}
        </Typography>
        <Grid container spacing={2}>
          {answers.map((answer, index) => (
            <Grid item xs={4} key={index}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => onAnswerClick(answer)}
                sx={styles.answerButton(selectedAnswer, answer, correctAnswer)}
              >
                {answer}
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuestionCard; 