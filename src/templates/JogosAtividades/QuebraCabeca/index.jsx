import React, { useContext, useEffect, useState } from 'react';
import { JigsawPuzzle } from "react-jigsaw-puzzle/lib";
import useWindowSize from 'react-use/lib/useWindowSize';
import trilha from '../../../sound/trilha3.mp3';
import acerto from '../../../sound/acerto.mp3';
import AudioManager from '../../../utils/audioManager';
import "react-jigsaw-puzzle/lib/jigsaw-puzzle.css";
import Confetti from 'react-confetti';
import './QuebraCabeca.css';
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';
import GameHeader from '../../../components/GameHeader';
import GameOver from '../../../components/GameOver';

function PuzzleGame() {
  const [isExploding, setIsExploding] = useState(false);
  const [isRunning, setIsRunning] = useState(false); // Controle do tempo
  const [isStarted, setIsStarted] = useState(false); // Controle do início do jogo
  const [isCompleted, setIsCompleted] = useState(false); // Controle da finalização do jogo
  const { studentId } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // Armazena a imagem escolhida
  const activityId = searchParams.get('id'); // Captura o 'id' da atividade
  const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
  const [feedback, setFeedback] = useState('');
  const { width, height } = useWindowSize();
  const [showGameOver, setShowGameOver] = useState(false);

  // Inicialização dos sons
  const [ambientSound] = useState(new AudioManager(trilha, { loop: true, volume: 0.3 }));
  const [correctSound] = useState(new AudioManager(acerto, { allowMultiplePlays: true }));

  // Limpeza do áudio quando o componente for desmontado
    useEffect(() => {
      return () => {
        ambientSound.stop();
        correctSound.stop();
      };
    }, []);

  const images = [
    'https://cdn.pixabay.com/photo/2023/09/21/11/30/cat-8266486_1280.jpg',
    'https://cdn.pixabay.com/photo/2024/05/24/18/14/astronaut-8785566_1280.png',
    'https://cdn.pixabay.com/photo/2023/09/16/20/14/ai-generated-8257503_1280.jpg',
    'https://cdn.pixabay.com/photo/2023/04/15/17/19/cat-7928232_1280.png',
    'https://cdn.pixabay.com/photo/2022/07/27/06/43/cat-7347316_1280.png'
  ];

  const startPuzzle = () => {
    setIsStarted(true);
    setIsRunning(true); // Inicia o timer
    ambientSound.play();
    setIsCompleted(false); // Reseta o estado de completado
    setShowGameOver(false);

    // Escolhe uma imagem aleatória no início do jogo
    setSelectedImage(images[Math.floor(Math.random() * images.length)]);
  };

  const onComplete = () => {
    setIsExploding(true);
    setIsRunning(false); // Para o cronômetro
    setIsCompleted(true); // Marca o jogo como completado
    console.log('Puzzle is completed!');

    // Reseta a explosão após 3 segundos
    setTimeout(() => {
      setIsExploding(false);
    }, 3000);
  };

  // Controle do cronômetro
  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(timer); // Limpa o timer ao desmontar ou parar
    }
  }, [isRunning]); // Dependente de isRunning

  // Função para enviar os dados para o backend
  const saveGameReport = async () => {
    const relatorio = {
      aluno: { id: studentId }, // ID do aluno
      tipoAtividade: 'Quebra-Cabeça', // Tipo da atividade
      tempoGasto: timeElapsed,
      atividade: { id: activityId }
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
    if (isCompleted) {
      correctSound.play()
      saveGameReport();
      const timer = setTimeout(() => {
        setShowGameOver(true); // Exibe o GameOver após 1 segundo
      }, 1000);
      return () => clearTimeout(timer); // Limpa o timer ao desmontar
    }
  }, [isCompleted]);

  return (
    <div className="puzzle-container">
      {!isStarted ? (
        <GameHeader 
          gameStarted={isStarted} 
          onStartGame={startPuzzle}
          game="Quebra Cabeça"
        />
      ) : isCompleted && showGameOver ? (
        <GameOver
          elapsedTime={timeElapsed}
          feedback={feedback}
          onRestart={() => {setIsStarted(false); setTimeElapsed(0)}}
        />
      ) : (
        <>
         <center> <Typography variant="h6" sx={{  fontFamily: 'Irish Grover'}}>Tempo decorrido: {timeElapsed}s</Typography></center>
          {/* {isCompleted && <Typography>Você completou o jogo em {timeElapsed} segundos!</Typography>} */}
          {selectedImage && (
            <div className="puzzle-game">
              <JigsawPuzzle
                imageSrc={selectedImage}
                rows={3}
                columns={3}
                onSolved={onComplete}
              />
            </div>
          )}
        </>
      )}
      {isExploding && 
        <Confetti 
          width={width}
          height={height}
          numberOfPieces={800}
          gravity={0.3}
          wind={0.01} 
          friction={0.99}
        />
      }
    </div>
  );
}

export default PuzzleGame;
