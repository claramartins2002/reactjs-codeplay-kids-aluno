import React, { createContext, useState, useEffect } from 'react';

// Cria o contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    return loggedIn === 'true'; // Inicializa como true apenas se o valor no localStorage for 'true'
  });
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado para capturar erros no login
  const [studentId, setStudentId] = useState(localStorage.getItem('studentId') || null); // Armazena o ID do aluno
  const [studentName, setStudentName] = useState(localStorage.getItem('studentName') || null); // Armazena o nome do aluno

  useEffect(() => {
    setLoading(false); // Define carregamento como concluído após verificação
  }, []);

  // Monitora mudanças no studentId e studentName para debug
  useEffect(() => {
    if (studentId) {
      console.log(`Student ID atualizado: ${studentId}`);
    }
    if (studentName) {
      console.log(`Student Name atualizado: ${studentName}`);
    }
    
  }, [studentId, studentName]);

  const login = async (email, senha) => {
    try {
      setLoading(true);
      setError(null);

      // Faz a requisição POST para o backend
      const response = await fetch(`http://localhost:8080/aluno/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error('Erro no login. Verifique suas credenciais.');
      }

      const data = await response.json();

      // Verifica se o login foi bem-sucedido
      if (data) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('studentId', data.id); // Armazena o ID do aluno no localStorage
        localStorage.setItem('studentName', data.nome); // Armazena o nome do aluno no localStorage
        setStudentId(data.id); // Atualiza o estado global com o ID do aluno
        setStudentName(data.nome); // Atualiza o estado global com o nome do aluno
        setIsAuthenticated(true);
      } else {
        throw new Error(data.message || 'Credenciais inválidas.');
      }
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Simula o logout
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('studentId'); // Remove o ID do aluno ao fazer logout
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentClass');
    setIsAuthenticated(false);
    setStudentId(null); // Reseta o estado global do ID do aluno
    setStudentName(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, error, studentId, studentName }}
    >
      {children}
    </AuthContext.Provider>
  );
};
