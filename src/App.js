import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Importa o contexto de autenticação
import Login from './templates/Login';
import MemoryCardGame from './templates/JogosAtividades/MemoryCardGame';
import PuzzleGame from './templates/JogosAtividades/QuebraCabeca';
import DragAndDropGame from './templates/JogosAtividades/DragAndDropGame';
import CacaPalavras from './templates/JogosAtividades/CacaPalavras';
import AddMathGame from './templates/JogosAtividades/AddMathGame/AddMathGame';
import ImageWordAssociationGame from './templates/JogosAtividades/ImageWordAssociationGame/ImageWordAssociationGame';
import ShapeColorGame from './templates/JogosAtividades/ShapeColorGame/ShapeColorGame';
import CountingGame from './templates/JogosAtividades/CountingGame/CountingGame';
import DrawingApp from './templates/JogosAtividades/Drawing/DrawingApp'
import CrosswordComponent from './templates/JogosAtividades/Crossword';
import StoreGame from './templates/JogosAtividades/StoreGame/components/StoreGame';
import Jogos from './templates/Jogos';
import SubsMathGame from './templates/JogosAtividades/SubsMathGame/SubsMathGame';
import MultMathGame from './templates/JogosAtividades/MultMathGame/MultMathGame';
import DivMathGame from './templates/JogosAtividades/DivMathGame/DivMathGame';
import Navbarmenu from './components/menu';
function App() {
  const { isAuthenticated, loading } = useContext(AuthContext); // Acessa o estado de autenticação e carregamento
  console.log(isAuthenticated);
  if (loading) {
    // Exibe uma tela de carregamento enquanto o estado de autenticação é verificado
    return <div>Carregando...</div>;
  }
  return (
<div>
    <Router>
    {isAuthenticated && <div><Navbarmenu /></div>} {/* Navbar só aparece se o usuário estiver logado */}

      <Routes>

        {/* Rotas Menu*/}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} /> {/* Impede de ir para login se já estiver autenticado */}

        <Route path="/" element={isAuthenticated ? <Jogos /> : <Navigate to="/login" />} />

        {/* Rotas Jogos*/}
        <Route path="/jogos/jogo-da-memoria" element={isAuthenticated ? <MemoryCardGame /> : <Navigate to="/login" />} />
        <Route path="/jogos/quebra-cabeca" element={isAuthenticated ? <PuzzleGame /> : <Navigate to="/login" />} />
        <Route path="/jogos/drag-n-drop" element={isAuthenticated ? <DragAndDropGame /> : <Navigate to="/login" />} />
        <Route path="/jogos/add-math-game" element={isAuthenticated ? <AddMathGame /> : <Navigate to="/login" />} />
        <Route path="/jogos/subs-math-game" element={isAuthenticated ? <SubsMathGame /> : <Navigate to="/login" />} />
        <Route path="/jogos/mult-math-game" element={isAuthenticated ? <MultMathGame /> : <Navigate to="/login" />} />
        <Route path="/jogos/div-math-game" element={isAuthenticated ? <DivMathGame /> : <Navigate to="/login" />} />
        <Route path="/jogos/crossword" element={isAuthenticated ? <CrosswordComponent /> : <Navigate to="/login" />} />
        <Route path="/jogos/caca-palavras" element={isAuthenticated ? <CacaPalavras /> : <Navigate to="/login" />} />
        <Route path="/jogos/imagem-palavra-associacao" element={isAuthenticated ? <ImageWordAssociationGame /> : <Navigate to="/login" />} />
        <Route path="/jogos/shape-color" element={isAuthenticated ? <ShapeColorGame /> : <Navigate to="/login" />} />
        <Route path="/jogos/counting" element={isAuthenticated ? <CountingGame /> : <Navigate to="/login" />} />
        <Route path="/jogos/drawing" element={isAuthenticated ? <DrawingApp /> : <Navigate to="/login" />} />
        <Route path="/jogos/store" element={isAuthenticated ? <StoreGame /> : <Navigate to="/login" />} />
      </Routes>
    </Router>

    </div> 
  );
}

export default App;
