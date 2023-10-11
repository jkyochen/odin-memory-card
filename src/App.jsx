import { useEffect, useState } from 'react'
import styles from './App.module.css'

const GAME_STATUS = {
  NEW: "new",
  STARTING: "starting",
  WIN: "win",
  LOSE: "lose",
}

const CARD_COUNT = 5;

function randomNum() {
  return Math.ceil(Math.random() * 1017);
}

function randomByCount() {
  return Array.from({ length: CARD_COUNT }).map(() => randomNum());
}

function randomSort(arr) {
  return arr.reverse().sort(() => Math.random() - 0.5);
}

function App() {
  const [highestScore, setHighestScore] = useState(0);
  const [status, setStatus] = useState(GAME_STATUS.NEW);
  const [ids, setIds] = useState(randomByCount());
  const [cards, setCards] = useState([]);
  const [selCards, setSelCards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const newCards = await Promise.all(ids.map(async id => {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const res = await resp.json();
        return {
          id,
          url: res.sprites.front_default,
        }
      }));
      setCards(newCards);
    }
    fetchData();
  }, [ids]);

  const handleSelectCard = (id) => {
    if (selCards.includes(id)) {
      setStatus(GAME_STATUS.LOSE);
      return;
    }
    const newSelCards = selCards.concat(id);
    setSelCards(newSelCards);
    if (newSelCards.length > highestScore) {
      setHighestScore(newSelCards.length);
    }
    if (newSelCards.length === ids.length) {
      setStatus(GAME_STATUS.WIN);
      return;
    }
    setCards(randomSort(cards));
  }

  const handleRestart = () => {
    setCards([]);
    setSelCards([]);
    setIds(randomByCount());
    setStatus(GAME_STATUS.STARTING)
  }

  return (
    <div className={styles.container}>
      <div>
        <p>Curren Score: {selCards.length}</p>
        <p>Highest Score: {highestScore}</p>
      </div>

      {status === GAME_STATUS.NEW && <div>
        <button onClick={() => setStatus(GAME_STATUS.STARTING)}>Start</button>
      </div>}

      {status === GAME_STATUS.STARTING && <div>
        <div className={styles.cards}>
          {cards.map((card, i) => <button key={i} onClick={() => handleSelectCard(card.id)}><img src={card.url} /></button>)}
        </div>
      </div>}

      {status === GAME_STATUS.WIN && <div>
        <p>You are Win.</p>
        <button onClick={handleRestart}>Restart</button>
      </div>}

      {status === GAME_STATUS.LOSE && <div>
        <p>You are Lose.</p>
        <button onClick={handleRestart}>Restart</button>
      </div>}
    </div>
  )
}

export default App
