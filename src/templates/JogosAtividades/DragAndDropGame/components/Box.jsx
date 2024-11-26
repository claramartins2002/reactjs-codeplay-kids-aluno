import { memo } from 'react'
import { useDrag } from 'react-dnd'

export const Box = memo(function Box ({ name, type, isDropped, srcImage }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type, 
      item: { name },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type],
  );
  
  return (
    <div ref={drag} className="box" style={{ opacity }} data-testid="box">
      <img className="box-img" src={srcImage} alt="" />
    </div>
  )
})