// Função para gerar questões de adição
export const generateAdditionQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;
    const wrongAnswer1 = correctAnswer + Math.floor(Math.random() * 3) + 1;
    const wrongAnswer2 = correctAnswer - Math.floor(Math.random() * 3) - 1;

    const answers = [correctAnswer, wrongAnswer1, wrongAnswer2].sort(() => Math.random() - 0.5);

    return {
        question: `${num1} + ${num2} = ?`,
        correctAnswer,
        answers,
    };
};

// Função para gerar questões de subtração
export const generateSubtractionQuestion = () => {
    const num1 = Math.floor(Math.random() * 20) + 1; // Primeiro número maior
    const num2 = Math.floor(Math.random() * num1) + 1; // Segundo número sempre menor ou igual ao primeiro
    const correctAnswer = num1 - num2;

    const wrongAnswer1 = correctAnswer + Math.floor(Math.random() * 3) + 1;
    const wrongAnswer2 = correctAnswer - Math.floor(Math.random() * 3) - 1;

    const answers = [correctAnswer, wrongAnswer1, wrongAnswer2].sort(() => Math.random() - 0.5);

    return {
        question: `${num1} - ${num2} = ?`,
        correctAnswer,
        answers,
    };
};

// Função para gerar questões de multiplicação
export const generateMultiplicationQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 * num2;

    const wrongAnswer1 = correctAnswer + Math.floor(Math.random() * 10) + 1;
    const wrongAnswer2 = correctAnswer - Math.floor(Math.random() * 10) - 1;

    const answers = [correctAnswer, wrongAnswer1, wrongAnswer2].sort(() => Math.random() - 0.5);

    return {
        question: `${num1} × ${num2} = ?`,
        correctAnswer,
        answers,
    };
};

// Função para gerar questões de divisão
export const generateDivisionQuestion = () => {
    const divisors = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const divisor = divisors[Math.floor(Math.random() * divisors.length)];
    const dividend = divisor * (Math.floor(Math.random() * 9) + 1);
    const correctAnswer = dividend / divisor;

    const wrongAnswer1 = correctAnswer + Math.floor(Math.random() * 3) + 1;
    const wrongAnswer2 = correctAnswer - Math.floor(Math.random() * 3) - 1;

    const answers = [correctAnswer, wrongAnswer1, wrongAnswer2].sort(() => Math.random() - 0.5);

    return {
        question: `${dividend} ÷ ${divisor} = ?`,
        correctAnswer,
        answers,
    };
}; 