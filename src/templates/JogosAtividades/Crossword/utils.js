// utils.js
import { generateLayout } from 'crossword-layout-generator';

/**
 * Gera o layout para um jogo de palavras cruzadas.
 * @param {Array} palavras - Um array de objetos com as palavras e URLs das imagens para cada palavra.
 * @returns {Object} - Um objeto contendo o layout do jogo, incluindo colunas, linhas e coordenadas para cada palavra.
 */
export function gerarLayoutCrossword(palavras) {
  // Formata as palavras e dicas para a entrada do layout
  const formattedWords = palavras.map((item) => ({
    clue: item.palavra,
    answer: item.palavra.toUpperCase(), // Converte a resposta para maiúsculas, se necessário
  }));

  // Gera o layout usando a biblioteca crosspalavra-layout-generator
  const layout = generateLayout(formattedWords);

  // Retorna o layout formatado conforme necessário para o crosspalavra
  return {
    cols: layout.cols,
    rows: layout.rows,
    result: layout.result.map((palavra) => ({
      startx: palavra.startx - 1,  // Ajusta as coordenadas para base 0
      starty: palavra.starty - 1,  // Ajusta as coordenadas para base 0
      clue: palavra.clue,
      answer: palavra.answer,
      length: palavra.answer.length,
      orientation: palavra.orientation === 'across' ? 'across' : 'down',
    }))
  };
}
