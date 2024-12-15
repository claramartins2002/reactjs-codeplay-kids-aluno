import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './styles.css';
import { AuthContext } from '../../AuthContext';

function Jogos() {
  const [jogosPendentes, setJogosPendentes] = useState([]);
  const { studentId, studentName} = useContext(AuthContext);

  useEffect(() => {
    const fetchJogosPendentes = async () => {
      try {
        const response = await fetch(`http://localhost:8080/atividade/getPendingByAluno/${studentId}`,
          { method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Jogos recebidos:', data); // Adicione este log
          setJogosPendentes(data);
        } else {
          console.error('Erro ao buscar jogos pendentes');
        }
      } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
      }
    };

    fetchJogosPendentes();
  }, []);

  const jogoRoutes = {
    'Quebra-Cabeça': '/jogos/quebra-cabeca',
    'Jogo da Memória': '/jogos/jogo-da-memoria',
    'Arraste e Solte': '/jogos/drag-n-drop',
    'Adição de Números': '/jogos/add-math-game',
    'Subtração de Números': '/jogos/subs-math-game',
    'Multiplicação de Números': '/jogos/mult-math-game',
    'Divisão de Números': '/jogos/div-math-game',
    'Palavras Cruzadas': '/jogos/crossword',
    'Caça Palavras': '/jogos/caca-palavras',
    'Formas Geométricas e Cores': '/jogos/shape-color',
    'Jogo das Imagens': '/jogos/imagem-palavra-associacao',
    'Jogo da Contagem': '/jogos/counting',
  };

  return (<>
        <h3 class="submenu">Olá {studentName}! Aqui estão suas atividades pendentes</h3>
    <div className="container-jogos">
      {jogosPendentes.map((jogo) => (
        <div key={jogo.id} className={`jogo-card ${jogo.cor || 'green'}`}>
   <NavLink className='is-active' to={`${jogoRoutes[jogo.nome]}?id=${jogo.id}`}>
      <center><img src={jogo.icone} alt='icon' width='100px' height='100px'/></center>
      <h2>{jogo.nome}</h2>
    </NavLink>
        </div>
      ))}
    </div>
    </>

  );
}

export default Jogos;
