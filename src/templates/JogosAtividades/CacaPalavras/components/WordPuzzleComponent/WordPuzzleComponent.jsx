import React, { useEffect, useState } from "react";
import "./WordPuzzleComponent.css";

export const WordPuzzleComponent = (props) => {
  const {
    markedBackgroundColor,
    selectedBackgroundColor,
    hoveredBackgroundColor,
    backgroundColor,
    fontSize,
    markedForeColor,
    selectedForeColor,
    hoveredForeColor,
    foreColor,
  } = props.design;

  const {
    answerWords,
    matrix,
    isGameActive,
    isSelecting,
    setIsSelecting,
    availablePaths,
    selectedLetters,
    setSelectedLetters,
    markedLetters,
    setMarkedLetters,
  } = props.options;

  const [data, setData] = useState([]);
  const [path, setPath] = useState();
  const [hover, setHover] = useState();

  useEffect(() => {
    const tmp = matrix.map((row, i) => {
      return row.map((column, j) => {
        return {
          letter: column,
          row: i,
          column: j,
        };
      });
    });
    setData(tmp);
  }, []);

  useEffect(() => {
    if (isSelecting) {
    } else {
      const selectedWord = selectedLetters.map((x) => x.letter).join("");
      const result = isAnswer(selectedLetters);
      setPath();
      setSelectedLetters([]);
    }
  }, [isSelecting]);

  const addLetterToSelectedWords = (letter) => {
    if (isGameActive && isSelecting && !isSelected(letter)) {
      const lastSelected = selectedLetters.slice(-1)[0];
      if (isConnected(letter, lastSelected)) {
        setSelectedLetters([...selectedLetters, letter]);
      } else if (isBeforeSelect(letter, lastSelected)) {
        removeLetterFromList(lastSelected);
      }
    }
  };

  const isAnswer = (param) => {
    const selectedWord = param.map((x) => x.letter).join("");
    if (answerWords.includes(selectedWord)) {
      markLetters(param);
      return true;
    }
    return false;
  };

  const markLetters = (param) => {
    setMarkedLetters(unique([...markedLetters, ...param], ["row", "column"]));
  };

  const unique = (arr, keyProps) => {
    const kvArray = arr.map((entry) => {
      const key = keyProps.map((k) => entry[k]).join("|");
      return [key, entry];
    });
    const map = new Map(kvArray);
    return Array.from(map.values());
  };

  const removeLetterFromList = (letter) => {
    const tmp = selectedLetters.filter((element) => {
      return letter.row !== element.row || letter.column !== element.column;
    });
    setSelectedLetters(tmp);
  };

  const isBeforeSelect = (letter, before) => (
    (letter.column + 1 === before.column && letter.row === before.row) || // right
    (letter.column - 1 === before.column && letter.row === before.row) || // left
    (letter.row + 1 === before.row && letter.column === before.column) || // down
    (letter.row - 1 === before.row && letter.column === before.column)    // up
  );

  const isConnected = (letter, before) => {
    if (selectedLetters.length < 1) {
      return true;
    }
  
    if (selectedLetters.length === 1 && isBeforeSelect(letter, before)) {
      setPath(chosePath(letter));
      return true;
    }
  
    const directions = {
      "right2left": before.row === letter.row && before.column - 1 === letter.column,
      "left2right": before.row === letter.row && before.column + 1 === letter.column,
      "top2bottom": before.column === letter.column && before.row + 1 === letter.row,
      "bottom2top": before.column === letter.column && before.row - 1 === letter.row
    };
  
    if (directions[path] && isAvailablePath(path)) {
      return true;
    }
  
    setSelectedLetters([]);
    return false;
  };  

  const chosePath = (item) => {
    const lastLetter = selectedLetters.slice(-2)[0];
    const letter = item || selectedLetters.slice(-1)[0];
  
    if (lastLetter.row === letter.row) {
      return lastLetter.column > letter.column ? "right2left" : "left2right";
    } else {
      return lastLetter.row > letter.row ? "bottom2top" : "top2bottom";
    }
  };

  const addFirstLetter = (letter) => {
    if (isGameActive) {
      setSelectedLetters([letter]);
    }
  };

  const isSelected = (searched) => selectedLetters.some(element => 
    searched.row === element.row && searched.column === element.column
  );
  
  const isAvailablePath = (searched) => availablePaths.includes(searched);

  const isMarked = (searched) => markedLetters.some(element => 
    searched.row === element.row && searched.column === element.column
  );

  return (
    <div className="root">
      <table onMouseLeave={() => setIsSelecting(false)}>
        <tbody>
          {data.map((i, row) => (
              <tr>
                {i.map((j, column) => (
                    <td
                      onMouseLeave={() => setHover()}
                      onMouseEnter={() => {
                        if (isGameActive) addLetterToSelectedWords(j);
                        setHover(j);
                      }}
                      onMouseDown={() => {
                        if (isGameActive) addFirstLetter(j);
                        setIsSelecting(true);
                      }}
                      onMouseUp={() => setIsSelecting(false)}
                      className="letter-wrapper"
                      style={{
                        backgroundColor:
                          isMarked(j) === true
                            ? markedBackgroundColor
                            : isSelected(j) === true
                            ? selectedBackgroundColor
                            : j === hover
                            ? hoveredBackgroundColor
                            : backgroundColor,
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "monospace", //fontFamily,
                          fontSize: fontSize,
                          color:
                            isMarked(j) === true
                              ? markedForeColor
                              : isSelected(j) === true
                              ? selectedForeColor
                              : j === hover
                              ? hoveredForeColor
                              : foreColor,
                        }}
                      >
                        {j.letter}
                      </h3>
                    </td>
                ))}
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};