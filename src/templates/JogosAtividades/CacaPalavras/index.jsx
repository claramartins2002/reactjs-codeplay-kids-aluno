import React, { useState, useEffect, useContext } from "react";
import "./styles.css";
import { WordPuzzleComponent } from "./components/WordPuzzleComponent/WordPuzzleComponent";
import Timer from "../Timer";
import { AuthContext } from "../../../AuthContext";
import { useSearchParams } from "react-router-dom";
import trilha from '../../../sound/trilha2.mp3';
import axios from "axios";
import RelatorioFinal from "./components/RelatorioFinal/RelatorioFinal";
import AudioManager from "../../../utils/audioManager";
import GameHeader from "../../../components/GameHeader";

export const CacaPalavras = () => {
  const answerWords = [
    "gato", "macaco", "formiga", "cavalo", "vaca", "pato", "elefante", "girafa", "arara",
  ];

  // Inicialização dos sons
  const [ambientSound] = useState(new AudioManager(trilha, { loop: true, volume: 0.3 }))
  
  // Limpeza do áudio quando o componente for desmontado
  useEffect(() => {
    return () => {
      document.title = "Caça Palavras";

      ambientSound.stop();
    };
  }, []);

  const generateWordPuzzle = (words, rows = 10, columns = 10) => {
    const matrix = Array.from({ length: rows }, () => Array(columns).fill(""));
    const directions = [{ name: "horizontal", dx: 1, dy: 0 }, { name: "vertical", dx: 0, dy: 1 }];
    const canPlaceWord = (word, row, col, dx, dy) => {
      for (let i = 0; i < word.length; i++) {
        const newRow = row + i * dy;
        const newCol = col + i * dx;
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= columns || (matrix[newRow][newCol] !== "" && matrix[newRow][newCol] !== word[i])) {
          return false;
        }
      }
      return true;
    };
    const placeWord = (word) => {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * columns);
        const direction = directions[Math.floor(Math.random() * directions.length)];
        if (canPlaceWord(word, row, col, direction.dx, direction.dy)) {
          for (let i = 0; i < word.length; i++) {
            const newRow = row + i * direction.dy;
            const newCol = col + i * direction.dx;
            matrix[newRow][newCol] = word[i];
          }
          placed = true;
        }
      }
    };
    words.forEach((word) => placeWord(word));
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (matrix[row][col] === "") {
          matrix[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26)).toLowerCase();
        }
      }
    }
    return matrix;
  };

  const [found, setFound] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [markedLetters, setMarkedLetters] = useState([]);
  const [paths] = useState(["left2right", "top2bottom", "right2left", "bottom2top"]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [foundWordsTimes, setFoundWordsTimes] = useState([]);
  const [lastWordFoundTime, setLastWordFoundTime] = useState(0);
  const API_URL = 'http://localhost:8080/relatorio'; // Atualize com a URL do seu backend
  const { studentId} = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id'); // Captura o 'id' da atividade
  const [feedback, setFeedback] = useState('');
  const [matrix, setMatrix] = useState(generateWordPuzzle(answerWords));
  const [elapsedTime, setElapsedTime] = useState(0); // Cronômetro


  useEffect(() => {
    if (!isSelecting && selectedLetters.length > 0) {
      const selectedWord = selectedLetters.map((x) => x.letter).join("");
      addToFound(selectedWord);
    }
    if (found.length === answerWords.length) {
      stopGame();
      saveGameReport();
      setDialogOpen(true);
    }
  }, [isSelecting, found]);

  const isInList = (searched, arr) => arr.includes(searched);

  const addToFound = (founded) => {
    if (isInList(founded, answerWords) && !isInList(founded, found)) {
      const currentTime = Math.floor(Date.now() / 1000);
      setFoundWordsTimes([...foundWordsTimes, { word: founded }]);
      setFound([...found, founded]);
      setLastWordFoundTime(currentTime); // Atualiza o tempo da última palavra encontrada
    }
  };

  const handleRestartGame = () => {
    setIsGameActive(false);
    setFound([]);
    setSelectedLetters([]);
    setMarkedLetters([]);
    setFoundWordsTimes([]);
    setDialogOpen(false);
    setElapsedTime(0);
    setMatrix(generateWordPuzzle(answerWords))
    startGame();
  };

  const handleEndGame = () => {
    setDialogOpen(false);
    stopGame();
  };

  const startGame = () => {
    ambientSound.play();
    setIsGameActive(true);
    setFound([]);
    setFoundWordsTimes([]);
    setLastWordFoundTime(0);
  };

  const stopGame = () => {
    setIsGameActive(false);
  };

 
    // Controle do cronômetro
    useEffect(() => {
      const timer = setInterval(() => {
          if (!dialogOpen) {
              setElapsedTime((prevTime) => prevTime + 1);
          }
      }, 1000);
      return () => clearInterval(timer);
  }, [dialogOpen]);

   // Função para enviar os dados para o backend
   const saveGameReport = async () => {
    console.log(activityId);
    const relatorio = {
        aluno: {id: studentId}, // ID do aluno
        tipoAtividade: 'Caça Palavras', // Tipo da atividade
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
    <div className='cacapalavras-game-container'>
      {!isGameActive ? (
        <GameHeader 
          gameStarted={isGameActive} 
          onStartGame={startGame}
          game="Caça Palavras"
        />
      ): (
        <>
          <div className={`answer-words-container ${isGameActive ? "active" : "inactive"}`}>
        {answerWords.map((element) => (
          <span key={element} className="answer-word">
            <h2 className={`answer-text ${isInList(element, found) ? "line-through" : ""}`}>
              {element}
            </h2>
          </span>
        ))}
      </div>
      <div className={`word-puzzle-wrapper ${isGameActive ? "active" : "inactive"}`}>
        <WordPuzzleComponent
          design={{
            markedBackgroundColor: "#00C3FF",
            selectedBackgroundColor: "white",
            hoveredBackgroundColor: "#00da91",
            backgroundColor: "rgb(1, 146, 98)",
            fontFamily: "Irish Grover",
            fontSize: "2.5rem",
            markedForeColor: "white",
            selectedForeColor: "rgb(1, 146, 98)",
            hoveredForeColor: "white",
            foreColor: "white",
          }}
          options={{
            answerWords,
            matrix,
            isGameActive,
            isSelecting,
            selectedLetters,
            setSelectedLetters,
            markedLetters,
            setMarkedLetters,
            setIsSelecting,
            availablePaths: paths,
          }}
        />
      </div>
        </>
      )}
      
      <RelatorioFinal 
        dialogOpen={dialogOpen} 
        handleEndGame={handleEndGame} 
        feedback={feedback} 
        handleRestartGame={handleRestartGame} 
        elapsedTime={elapsedTime}
      />
    </div>
  );
};

export default CacaPalavras;
