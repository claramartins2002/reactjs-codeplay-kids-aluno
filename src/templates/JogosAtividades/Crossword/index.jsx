import { React, useState, useEffect, useRef, useContext } from 'react';
import { CrosswordProvider, CrosswordGrid, DirectionClues, ThemeProvider } from '@jaredreisinger/react-crossword';
import './CrosswordComponent.css';
import { gerarLayoutCrossword } from './utils';
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import trilha from '../../../sound/trilha4.mp3';
import AudioManager from '../../../utils/audioManager';
import axios from 'axios';
import GameHeader from '../../../components/GameHeader';
import GameOver from '../../../components/GameOver';
import { Box } from '@mui/material';
import { styles } from '../../../utils/styles';

const theme = {
  gridBackground: '#8BC34A',
  cellBackground: '#fff',
  cellBorder: '#66B2B2',
  textColor: '#333',
  numberColor: '#8BC34A',
  focusBackground: '#FFC107',
  highlightBackground: '#A5D6A7',
};

const mockData = [
  { palavra: 'gato', url: 'https://cdn-icons-png.freepik.com/128/8466/8466905.png' },
  { palavra: 'porco', url: 'https://cdn-icons-png.freepik.com/128/9466/9466821.png' },
  { palavra: 'cavalo', url: 'https://cdn-icons-png.freepik.com/128/8493/8493186.png' },
  { palavra: 'cobra', url: 'https://cdn-icons-png.freepik.com/128/8493/8493095.png' },
  { palavra: 'ovelha', url: 'https://cdn-icons-png.freepik.com/128/8493/8493053.png' },
  { palavra: 'galinha', url: 'https://cdn-icons-png.freepik.com/128/8493/8493102.png' },
  { palavra: 'vaca', url: 'https://cdn-icons-png.freepik.com/128/9466/9466826.png' },
  { palavra: 'pato', url: 'https://cdn-icons-png.freepik.com/128/1196/1196496.png' },
];

const mockDataFruits = [
  { palavra: 'banana', url: 'https://cdn-icons-png.freepik.com/128/9861/9861871.png' },
  { palavra: 'morango', url: 'https://cdn-icons-png.freepik.com/128/590/590685.png' },
  { palavra: 'coco', url: 'https://cdn-icons-png.freepik.com/128/7615/7615411.png' },
  { palavra: 'abacaxi', url: 'https://cdn-icons-png.freepik.com/128/8832/8832776.png' },
  { palavra: 'maca', url: 'https://cdn-icons-png.freepik.com/128/2106/2106176.png' },
  { palavra: 'laranja', url: 'https://cdn-icons-png.freepik.com/128/418/418239.png' },
  { palavra: 'melancia', url: 'https://cdn-icons-png.freepik.com/128/1054/1054114.png' },
];

// const mockDataJungle = [
//   { palavra: 'tigre', url: 'https://cdn-icons-png.freepik.com/256/6744/6744686.png' },
//   { palavra: 'leao', url: 'https://cdn-icons-png.freepik.com/256/1998/1998713.png' },
//   { palavra: 'macaco', url: 'https://cdn-icons-png.freepik.com/256/1998/1998721.png' },
//   { palavra: 'girafa', url: 'https://cdn-icons-png.freepik.com/256/4215/4215152.png' },
//   { palavra: 'elefante', url: 'https://cdn-icons-png.freepik.com/128/7743/7743300.png' },
//   { palavra: 'formiga', url: 'https://cdn-icons-png.freepik.com/128/4982/4982408.png' },
//   { palavra: 'cobra', url: 'https://cdn-icons-png.freepik.com/128/1447/1447876.png' },
// ];

export default function CrosswordComponent() {
  const crosswordRef = useRef(null);
  const [isSolved, setIsSolved] = useState(false);
  const [crosswordData, setCrosswordData] = useState({ across: {}, down: {} });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { studentId } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');
  const [feedback, setFeedback] = useState('');
  const API_URL = 'http://localhost:8080/relatorio';
  const allCategories = [mockData, mockDataFruits];

  const [ambientSound] = useState(new AudioManager(trilha, { loop: true, volume: 0.3 }));

  // Limpeza do áudio quando o componente for desmontado
  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, []);

  useEffect(() => {
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    const crosswordLayout = gerarLayoutCrossword(randomCategory);
    const newCrosswordData = { across: {}, down: {} };

    crosswordLayout.result.forEach((item, index) => {
      const { startx, starty, answer, clue, orientation } = item;
      const direction = orientation === 'across' ? 'across' : 'down';

      newCrosswordData[direction][index + 1] = {
        clue: <img src={randomCategory[index].url} alt={clue} width="70px" />,
        answer: answer.toUpperCase(),
        row: starty,
        col: startx,
      };
    });

    setCrosswordData(newCrosswordData);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameStarted && !gameOver) {
        setElapsedTime((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setElapsedTime(0);
    ambientSound.play();
  };

  const checkIfSolved = () => {
    if (crosswordRef.current?.isCrosswordCorrect()) {
      setIsSolved(true);
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setIsSolved(false);
    setGameOver(false);
    setGameStarted(true);
    setElapsedTime(0);
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    const crosswordLayout = gerarLayoutCrossword(randomCategory);
    const newCrosswordData = { across: {}, down: {} };

    crosswordLayout.result.forEach((item, index) => {
      const { startx, starty, answer, clue, orientation } = item;
      const direction = orientation === 'across' ? 'across' : 'down';

      newCrosswordData[direction][index + 1] = {
        clue: <img src={randomCategory[index].url} alt={clue} width="60px" />,
        answer: answer.toUpperCase(),
        row: starty,
        col: startx,
      };
    });
    setCrosswordData(newCrosswordData);
  };

  useEffect(() => {
    if (gameOver) {
      const relatorio = {
        aluno: { id: studentId },
        tipoAtividade: 'Palavras Cruzadas',
        tempoGasto: elapsedTime,
        atividade: { id: activityId },
      };

      axios.post(API_URL, relatorio).catch((err) => console.error(err));
    }
  }, [gameOver]);

  return (
    <Box sx={styles.container}>
      {!gameStarted && <GameHeader gameStarted={gameStarted} onStartGame={startGame} game="Palavras Cruzadas" />}
        {gameStarted && !gameOver && (
          <div className="crossword-game-container">
            <ThemeProvider theme={theme}>
              <CrosswordProvider
                data={crosswordData}
                ref={crosswordRef}
                onCrosswordCorrect={() => setTimeout(checkIfSolved, 0)}
              >
                <div className="crossword-content">
                  <DirectionClues direction="across" label="Vertical" />
                  <div className="crossword-grid">
                    <CrosswordGrid />
                  </div>
                  <DirectionClues direction="down" label="Horizontal" />
                </div>
              </CrosswordProvider>
            </ThemeProvider>
          </div>
        )}

        {gameOver && (
          <GameOver
            elapsedTime={elapsedTime}
            feedback={feedback}
            onRestart={restartGame}
            gameType="Palavras Cruzadas"
          />
        )}
    </Box>
  );
}