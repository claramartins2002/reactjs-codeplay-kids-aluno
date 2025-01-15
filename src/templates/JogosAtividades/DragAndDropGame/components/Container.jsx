import update from 'immutability-helper';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Dustbin } from './Dustbin';
import { Box } from './Box';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../../../AuthContext';
import axios from 'axios';
import trilha from '../../../../sound/trilha5.mp3';
import GameHeader from '../../../../components/GameHeader';
import AudioManager from '../../../../utils/audioManager';
import GameOver from '../../../../components/GameOver';

const response = [
  { name: 'Maçã', type: 'Maçã', urlFront: 'https://cdn-icons-png.freepik.com/128/1038/1038574.png', urlShadow: 'https://cdn-icons-png.freepik.com/128/1038/1038625.png' },
  { name: 'Banana', type: 'Banana', urlFront: 'https://cdn-icons-png.freepik.com/128/3373/3373057.png', urlShadow: 'https://cdn-icons-png.freepik.com/128/3373/3373054.png' },
  { name: 'Uva', type: 'Uva', urlFront: 'https://cdn-icons-png.freepik.com/128/8719/8719094.png', urlShadow: 'https://cdn-icons-png.freepik.com/128/8719/8719095.png' },
  { name: 'Melancia', type: 'Melancia', urlFront: 'https://cdn-icons-png.freepik.com/128/522/522666.png', urlShadow: 'https://cdn-icons-png.freepik.com/128/522/522768.png' },
  { name: 'Laranja', type: 'Laranja', urlFront: 'https://cdn-icons-png.freepik.com/128/4076/4076599.png', urlShadow: 'https://cdn-icons-png.freepik.com/128/4076/4076650.png' }
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
  const [boxes, setBoxes] = useState(() =>
    shuffleArray(
      response.map(item => ({
        name: item.name,
        type: item.type,
        url: item.urlFront
      }))
    )
  );
  const [droppedBoxNames, setDroppedBoxNames] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // Cronômetro
  const { width, height } = useWindowSize();
  const { studentId } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id'); // Captura o 'id' da atividade
  const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
  const [feedback, setFeedback] = useState('');

  const [ambientSound] = useState(
    new AudioManager(trilha, { loop: true, volume: 0.3 })
  );

  // Limpeza do áudio quando o componente for desmontado
  useEffect(() => {
    return () => {
      document.title = "Arrasta e Solta";
      ambientSound.stop();
    };
  }, []);

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
        setElapsedTime(prevTime => prevTime + 1);
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
    setBoxes(
      shuffleArray(
        response.map(item => ({
          name: item.name,
          type: item.type,
          url: item.urlFront
        }))
      )
    );
    setDustbins(initialDustbins);
    setDroppedBoxNames([]);
    setGameCompleted(false);
    setGameStarted(true);
    setElapsedTime(0);
    ambientSound.play();
  };

  // Função para enviar os dados para o backend
  const saveGameReport = async () => {
    const relatorio = {
      aluno: { id: studentId }, // ID do aluno
      tipoAtividade: 'Arraste e Solte', // Tipo da atividade
      tempoGasto: elapsedTime,
      atividade: { id: activityId }
    };

    try {
      const response = await axios.post(API_URL, relatorio);
      setFeedback(response.data);
    } catch (error) {
      console.error('Erro ao salvar o relatório:', error);
    }
  };

  if (gameCompleted) {
    return (
      <GameOver
        elapsedTime={elapsedTime}
        feedback={feedback}
        onRestart={startNewGame}
        gameType="Arrasta e Solta"
      />
    );
  }

  return (
    <div className="game-dnd-container">
      {!gameStarted && (
        <GameHeader
          gameStarted={gameStarted}
          onStartGame={startNewGame}
          game="Arrasta e Solta"
        />
      )}
      {gameStarted && (
        <>
          <div className="dnd-game-title">
            <h1>Arraste e Solte</h1>
            <span>Arraste e solte a fruta na sua sombra: </span>
          </div>
          <div className="dustbins-boxes-container">
            {dustbins.map(({ accepts, lastDroppedItem }, index) => (
              <Dustbin
                className="dustbin"
                accept={accepts}
                lastDroppedItem={lastDroppedItem}
                onDrop={item => handleDrop(index, item)}
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
    </div>
  );
});

