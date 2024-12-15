import update from 'immutability-helper';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Dustbin } from './Dustbin';
import { Box } from './Box';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../../../AuthContext';
import { Typography } from '@mui/material';
import axios from 'axios';

const response = [
  { name: 'Maçã', type: 'Maçã', urlFront: 'https://cdn-icons-png.freepik.com/128/1038/1038574.png', urlShadow: 'https://cdn-icons-png.freepik.com/128/1038/1038625.png' },
  { name: 'Banana', type: 'Banana', urlFront: 'https://cdn-icons-png.freepik.com/128/3373/3373057.png', urlShadow: 'https://cdn-icons-png.freepik.com/128/3373/3373054.png' },
  { name: 'Uva', type: 'Uva', urlFront: 'https://cdn-icons-png.freepik.com/128/8719/8719094.png', urlShadow: 'https://cdn-icons-png.freepik.com/128/8719/8719095.png' },
  { name: 'Melancia', type: 'Melancia', urlFront: 'https://cdn-icons-png.freepik.com/128/522/522666.png', urlShadow: 'https://cdn-icons-png.freepik.com/128/522/522768.png' }
];

// Função para embaralhar a lista de boxes
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export const Container = memo(function Container() {
  const initialDustbins = response.map(item => ({
    accepts: [item.type],
    lastDroppedItem: null
  }));

  const [dustbins, setDustbins] = useState(initialDustbins);
  const [boxes, setBoxes] = useState(() => shuffleArray(response.map(item => ({
    name: item.name,
    type: item.type,
    url: item.urlFront
  }))));
  const [droppedBoxNames, setDroppedBoxNames] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // Cronômetro
  const { width, height } = useWindowSize();
  const { studentId} = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id'); // Captura o 'id' da atividade
  const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
  const [feedback, setFeedback] = useState('');

  const allDustbinsFilled = useCallback(() => {
    return dustbins.every(dustbin => dustbin.lastDroppedItem !== null);
  }, [dustbins]);

  useEffect(() => {
    if (allDustbinsFilled()) {
      setGameCompleted(true);
      saveGameReport();
    }
  }, [dustbins, allDustbinsFilled]);

  // Controle do cronômetro
 useEffect(() => {
  const timer = setInterval(() => {
    if (!gameCompleted) {
      setElapsedTime((prevTime) => prevTime + 1);
    }
  }, 1000);
  return () => clearInterval(timer);
}, [gameCompleted]);

  const handleDrop = useCallback(
    (index, item) => {
      const { name } = item;

      setDroppedBoxNames(
        update(droppedBoxNames, name ? { $push: [name] } : { $push: [] })
      );

      setDustbins(
        update(dustbins, {
          [index]: {
            lastDroppedItem: { $set: item }
          }
        })
      );
    },
    [droppedBoxNames, dustbins]
  );

  const startNewGame = () => {
    setBoxes(shuffleArray(response.map(item => ({
      name: item.name,
      type: item.type,
      url: item.urlFront
    }))));
    setDustbins(initialDustbins);
    setDroppedBoxNames([]);
    setGameCompleted(false);
    setGameStarted(true);
    setElapsedTime(0);
  };

  // Função para enviar os dados para o backend
  const saveGameReport = async () => {
    console.log(activityId);
    const relatorio = {
        aluno: {id: studentId}, // ID do aluno
        tipoAtividade: 'Arraste e Solte', // Tipo da atividade
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

  return (
    <div className="game-dnd-container">
      {!gameStarted && (<>
        <h3>Arraste as frutas para sua sombra! 🍇🍌🍉🍎</h3>
        <button onClick={startNewGame} style={{ padding: '1.5%', fontSize: '1.3rem', fontFamily: 'Irish Grover'}}>
          Iniciar Jogo
        </button>

        </>
      )}
      {gameStarted && (
        <>
        <div className="dustbins-boxes-container">
            {dustbins.map(({ accepts, lastDroppedItem }, index) => (
              <Dustbin
                className="dustbin"
                accept={accepts}
                lastDroppedItem={lastDroppedItem}
                onDrop={(item) => handleDrop(index, item)}
                key={index}
                item={response.find(item => item.type === accepts[0])}
              />
            ))}
</div>
        <div className="dustbins-boxes-container">

            {boxes.map(({ name, type, url }, index) => (
              <Box
                className="box"
                name={name}
                type={type}
                isDropped={droppedBoxNames.includes(name)}
                key={index}
                srcImage={url}
              />
            ))}
          </div>
        </>
      )}
      {gameCompleted && (
        <>
          <div style={{fontSize: '1.3rem', fontFamily: 'Irish Grover', padding: '1%'}}>
            <h2>Parabéns! Você completou o jogo!</h2>
            <p>Tempo gasto: { elapsedTime } segundos</p>
            <p> {feedback}</p>
            <center><button onClick={startNewGame} style={{ padding: '1.5%', fontSize: '1.3rem', fontFamily: 'Irish Grover'}}>
              Jogar Novamente
            </button></center>
          </div>
          <Confetti width={width} height={height} />
        </>
      )}
    </div>
  );
});
