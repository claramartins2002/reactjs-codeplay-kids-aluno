import React, { Component } from "react";
import './styles.css';

export default class Clock extends Component {
  constructor(props) {
    super(props);

    // Gera um horário fixo aleatório
    const randomHour = Math.floor(Math.random() * 12) + 1; // 1 a 12
    const randomMinute = Math.floor(Math.random() * 6) * 10; // Apenas múltiplos de 10 (0, 10, 20, ..., 50)

    this.state = {
      time: new Date(0, 0, 0, randomHour, randomMinute), // Data fictícia com horário fixo
      inputHour: "",
      inputMinute: "",
      message: "",
      correctGuesses: 0,
      incorrectGuesses: 0
    };
  }

  generateNewTime = () => {
    const randomHour = Math.floor(Math.random() * 12) + 1; // 1 a 12
    const randomMinute = Math.floor(Math.random() * 6) * 10; // Apenas múltiplos de 10
    this.setState({
      time: new Date(0, 0, 0, randomHour, randomMinute),
      inputHour: "",
      inputMinute: "",
      message: ""
    });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    const { inputHour, inputMinute, time, correctGuesses, incorrectGuesses } = this.state;
    const userHour = parseInt(inputHour, 10);
    const userMinute = parseInt(inputMinute, 10);

    if (userHour === time.getHours() && userMinute === time.getMinutes()) {
      console.log("Acerto! Total de acertos: ", correctGuesses + 1);
      this.setState({ 
        message: "Você acertou o horário!",
        correctGuesses: correctGuesses + 1 
      }, this.generateNewTime);
    } else {
      console.log("Erro! Total de erros: ", incorrectGuesses + 1);
      this.setState({ 
        message: "Horário incorreto. Tente novamente.",
        incorrectGuesses: incorrectGuesses + 1 
      }, this.generateNewTime);
    }
  };

  render() {
    const { time, inputHour, inputMinute, message } = this.state;

    return (
      <div className="app-container">
        <div className="clock">
            {/* Ponteiro das horas */}
            <div
              className="hour_hand"
              style={{
                transform: `rotateZ(${time.getHours() * 30}deg)` // 30 graus por hora
              }}
            />

            {/* Ponteiro dos minutos */}
            <div
              className="min_hand"
              style={{
                transform: `rotateZ(${time.getMinutes() * 6}deg)` // 6 graus por minuto
              }}
            />

            {/* Números do relógio */}
            <span className="clock-number twelve">12</span>
            <span className="clock-number one">1</span>
            <span className="clock-number two">2</span>
            <span className="clock-number three">3</span>
            <span className="clock-number four">4</span>
            <span className="clock-number five">5</span>
            <span className="clock-number six">6</span>
            <span className="clock-number seven">7</span>
            <span className="clock-number eight">8</span>
            <span className="clock-number nine">9</span>
            <span className="clock-number ten">10</span>
            <span className="clock-number eleven">11</span>
        </div>

        <div className="input-container">
          <input
            type="number"
            className="input-hour"
            name="inputHour"
            value={inputHour}
            onChange={this.handleInputChange}
            min="1"
            max="12"
          />
          <span className="time-separator">:</span>
          <input
            type="number"
            className="input-min"
            name="inputMinute"
            value={inputMinute}
            onChange={this.handleInputChange}
            min="0"
            max="59"
            step="10"
          />
          <button onClick={this.handleSubmit} className="clock-game-button">OK</button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    );
  }
}
