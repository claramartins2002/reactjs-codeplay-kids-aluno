import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Container } from "./components/Container";
import './styles.css';
function DragAndDropGame() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Container/>
    </DndProvider>
  )
}

export default DragAndDropGame;