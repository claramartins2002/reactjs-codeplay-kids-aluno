import './SingleCard.css'
import cover from '../images/cover.png'

export default function SingleCard({ card, handleChoice, flipped, disabled }) {

  const handleClick = () => {
    if (!disabled) {
      handleChoice(card)
    }
  }

  return (
    <div className="card-game">
      <div className={flipped ? "flipped" : ""}>
        <img src={card.src} alt="card front" className="front" />
        <img 
          src={cover} 
          alt="card-game back" 
          className="back"
          onClick={handleClick}
        />
      </div>
    </div>
  )
}