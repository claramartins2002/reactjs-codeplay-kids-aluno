import { memo } from "react"
import { useDrop } from "react-dnd"
export const Dustbin = memo(function Dustbin({ accept, lastDroppedItem, onDrop, item }) {
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = isOver && canDrop;
  let dustbinClass = 'dustbin-default';

  // if (isActive) {
  //   dustbinClass = 'dustbin-active';
  // } else if (canDrop) {
  //   dustbinClass = 'dustbin-can-drop';
  // }

  return (
    <div ref={drop} className={`dustbin ${dustbinClass}`} data-testid="dustbin">
      <img
        className='dustbin-img'
        src={
          isActive
            ? item.urlShadow || ''
            : lastDroppedItem
            ? item.urlFront
            : item.urlShadow || ''
        }
        alt={item.name}
      />
    </div>
  );
})