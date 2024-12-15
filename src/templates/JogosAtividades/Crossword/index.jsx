import { useState, useEffect, useRef, useContext } from 'react';
import { CrosswordProvider, CrosswordGrid, DirectionClues, ThemeProvider } from '@jaredreisinger/react-crossword';
import './CrosswordComponent.css';
import { gerarLayoutCrossword } from './utils';
import { Button, Typography, Box } from '@mui/material';
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const theme = {
  gridBackground: '#8BC34A',
  cellBackground: '#ffffff',
  cellBorder: '#66B2B2',
  textColor: '#333',
  numberColor: '#333',
  focusBackground: '#FFC107',
  highlightBackground: '#A5D6A7',
};

export default function CrosswordComponent() {
  const crosswordRef = useRef(null);
  const [isSolved, setIsSolved] = useState(false);
  const [crosswordData, setCrosswordData] = useState({ across: {}, down: {} });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { studentId} = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const activityId = searchParams.get('id'); // Captura o 'id' da atividade
    const [feedback, setFeedback] = useState('');
    const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend

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

  const mockDataJungle = [
    { palavra: 'tigre', url: 'https://cdn-icons-png.freepik.com/256/6744/6744686.png' },
    { palavra: 'leao', url: 'https://cdn-icons-png.freepik.com/256/1998/1998713.png' },
    { palavra: 'macaco', url: 'https://cdn-icons-png.freepik.com/256/1998/1998721.png' },
    { palavra: 'girafa', url: 'https://cdn-icons-png.freepik.com/256/4215/4215152.png' },
    { palavra: 'elefante', url: 'https://cdn-icons-png.freepik.com/128/7743/7743300.png' },
    { palavra: 'formiga', url: 'https://cdn-icons-png.freepik.com/128/4982/4982408.png' },
    { palavra: 'cobra', url: 'https://cdn-icons-png.freepik.com/128/1447/1447876.png' },
  ];

  const allCategories = [mockData, mockDataFruits, mockDataJungle];

  useEffect(() => {
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    const crosswordLayout = gerarLayoutCrossword(randomCategory);
    const newCrosswordData = { across: {}, down: {} };

    crosswordLayout.result.forEach((item, index) => {
      const { startx, starty, answer, clue, orientation } = item;
      const direction = orientation === 'across' ? 'across' : 'down';

      newCrosswordData[direction][index + 1] = {
        clue: <img src={randomCategory[index].url} alt={clue} width="60px" length="60px" />,
        answer: answer.toUpperCase(),
        row: starty,
        col: startx,
      };
    });

    setCrosswordData(newCrosswordData);
  }, []);

 // Controle do cronômetro
 useEffect(() => {
  const timer = setInterval(() => {
      if (!gameOver) {
          setElapsedTime((prevTime) => prevTime + 1);
      }
  }, 1000);
  return () => clearInterval(timer);
}, [gameOver]);


  function checkIfSolved() {
    if (crosswordRef.current) {
      const isPuzzleSolved = crosswordRef.current.isCrosswordCorrect();
      setIsSolved(isPuzzleSolved);
      if (isPuzzleSolved) {
        setGameOver(true);
      }
    }
  }

  function restartGame() {
    setElapsedTime(0);
    setGameOver(false);
    setIsSolved(false);
    setCrosswordData({ across: {}, down: {} });

    setTimeout(() => {
      const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
      const crosswordLayout = gerarLayoutCrossword(randomCategory);
      const newCrosswordData = { across: {}, down: {} };

      crosswordLayout.result.forEach((item, index) => {
        const { startx, starty, answer, clue, orientation } = item;
        const direction = orientation === 'across' ? 'across' : 'down';

        newCrosswordData[direction][index + 1] = {
          clue: <img src={randomCategory[index].url} alt={clue} width="60px" length="60px" />,
          answer: answer.toUpperCase(),
          row: starty,
          col: startx,
        };
      });
      setCrosswordData(newCrosswordData);
    }, 100);
  }

  // Função para enviar os dados para o backend
  const saveGameReport = async () => {
    const relatorio = {
        aluno: {id: studentId}, // ID do aluno
        tipoAtividade: 'Palavras Cruzadas', // Tipo da atividade
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
    <div className="crossword-container">
      <header className="crossword-header">
        <h1>Palavras Cruzadas</h1>
        <h2>{gameOver ? 'Fim de Jogo' : 'Resolva as palavras'}</h2>
        <Typography color='white'>Atenção! Não precisa escrever as palavras com acentos ou ç!!</Typography>
      </header>

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

      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        {gameOver && (
          <Typography variant="h6" fontFamily="Irish Grover">
            Tempo gasto: {elapsedTime} s
          </Typography>
        )}
        {gameOver && (
          <Typography variant="h6" color="green" fontFamily="Irish Grover">
            Parabéns! Você completou o caça palavras!
          </Typography>
        )}
        <Typography> {feedback}</Typography>

        <Button variant="contained" color="primary" onClick={restartGame}>
          Jogar Novamente
        </Button>
      </Box>
    </div>
  );
}
