import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import img1 from './images/img-1.png';
import img2 from './images/img-2.png';
import img3 from './images/img-3.png';
import img4 from './images/img-4.png';
import img5 from './images/img-5.png';
import img6 from './images/img-6.png';
import SingleCard from './components/SingleCard';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { AuthContext } from '../../../AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import GameOver from '../../../components/GameOver';

const cardImages = [
  { 'src': img1, matched: false },
  { 'src': img2, matched: false },
  { 'src': img3, matched: false },
  { 'src': img4, matched: false },
  { 'src': img5, matched: false },
  { 'src': img6, matched: false }
];

const MemoryCardGame = () => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false); // Controle do final do jogo
  const { width, height } = useWindowSize();
  const { studentId } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const activityId = searchParams.get('id'); // Captura o 'id' da atividade
  const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
  const [feedback, setFeedback] = useState('');

    // Controle do cronômetro
    useEffect(() => {
      const timer = setInterval(() => {
          if (!gameCompleted) {
              setTimeElapsed((prevTime) => prevTime + 1);
          }
      }, 1000);
      return () => clearInterval(timer);
  }, [gameCompleted]);

   // Função para enviar os dados para o backend
   const saveGameReport = async () => {
    const relatorio = {
        aluno: {id: studentId}, // ID do aluno
        tipoAtividade: 'Jogo da Memória', // Tipo da atividade
        tentativas: turns,
        tempoGasto: timeElapsed,
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


  // Shuffle cards
  const shuffleCards = () => {
    const shuffleCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffleCards);
    setTurns(0);
    setGameCompleted(false); // Reinicia o estado do jogo concluído
  };

  // Handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);

      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Check if the game is completed
  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every((card) => card.matched);
    if (allMatched) {
      setGameCompleted(true);
    }
  }, [cards]);

      // Salvar o relatório quando o jogo terminar
      useEffect(() => {
        if (gameCompleted) {
            saveGameReport();
        }
    }, [gameCompleted]);

  // Reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  // Start a new game automatically on load
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="memory-game">
      <div className="header">
        <h1>Jogo da Memória</h1>
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <center><h3>Tentativas: {turns}</h3></center>
      {gameCompleted && (
        // <div className="game-completed">
        //   <h3>Parabéns! Você completou o jogo!</h3>
        //   <Typography sx={{fontFamily: 'Irish Grover'}}> {feedback}</Typography>
        //   <button className="start-button" onClick={shuffleCards}>Jogar Novamente</button>
        // </div>
        <GameOver gameType='memory' feedback={feedback} onRestart={shuffleCards}/>
      )}
      {gameCompleted && (
        <Confetti 
          width={width}
          height={height}
          numberOfPieces={800}
          gravity={0.3}
          wind={0.01}
          friction={0.99}
        />
      )}
    </div>
  );
};

export default MemoryCardGame;
