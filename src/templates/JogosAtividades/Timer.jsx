// Timer.js
import React, { useState, useEffect } from 'react';

function Timer({ isRunning, onComplete }) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning && timeElapsed > 0) {
      onComplete(timeElapsed);
    }
  }, [isRunning, timeElapsed, onComplete]);

  return <h2>Tempo: {timeElapsed} segundos</h2>;
}

export default Timer;
