import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from './Card';
import './CardTable.css';

const BASE_URL = 'http://deckofcardsapi.com/api/deck';

const CardTable = () => {
  const [deck, setDeck] = useState(null);
  const [draw, setDraw] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function getDeck() {
      let res = await axios.get(`${BASE_URL}/new/shuffle`);
      setDeck(res.data);
    }
    getDeck();
  }, [setDeck]);

  useEffect(() => {
    async function drawCard() {
      let { deck_id } = deck;
      let drawRes = await axios.get(`${BASE_URL}/${deck_id}/draw/`);

      if (drawRes.data.remaining === 0) {
        setAutoDraw(false);
        alert('All Cards Played!');
      }
      const card = drawRes.data.cards[0];
      setDraw((d) => [
        ...d,
        {
          id: card.code,
          name: card.suit + '' + card.value,
          image: card.image,
        },
      ]);
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await drawCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]);

  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
  };

  const cards = draw.map((c) => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <>
      {deck ? (
        <button className="CardButton" onClick={toggleAutoDraw}>
          {autoDraw ? 'STOP' : 'KEEP'} Toggle Drawing
        </button>
      ) : null}
      <div>{cards}</div>
    </>
  );
};

export default CardTable;
