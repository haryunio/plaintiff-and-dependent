import { useState, useEffect, useCallback } from 'react';
import cardsData from '../constants/cards.json';

export interface Card {
  id: string;
  name: string;
  type: 'attack' | 'defense';
  counters?: string[];
}

export const useGameLogic = () => {
  const [hp, setHp] = useState(5);
  const [turn, setTurn] = useState(1);
  const [hand, setHand] = useState<Card[]>([]);
  const [currentAttack, setCurrentAttack] = useState<Card | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const allCards = cardsData as Card[];
  const attackCards = allCards.filter((c) => c.type === 'attack');
  const defenseCards = allCards.filter((c) => c.type === 'defense');

  const drawHand = useCallback(() => {
    // 덱에서 무작위로 5장 드로우 (항변 카드 중심)
    const newHand: Card[] = [];
    for (let i = 0; i < 5; i++) {
      const randomIdx = Math.floor(Math.random() * defenseCards.length);
      newHand.push(defenseCards[randomIdx]);
    }
    setHand(newHand);
  }, [defenseCards]);

  const nextEnemyTurn = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * attackCards.length);
    setCurrentAttack(attackCards[randomIdx]);
  }, [attackCards]);

  const initGame = useCallback(() => {
    setHp(5);
    setTurn(1);
    setGameStatus('playing');
    drawHand();
    nextEnemyTurn();
  }, [drawHand, nextEnemyTurn]);

  useEffect(() => {
    initGame();
  }, []);

  const playCard = (card: Card) => {
    if (gameStatus !== 'playing' || !currentAttack) return;

    const isSuccess = card.counters?.includes(currentAttack.id);

    if (isSuccess) {
      if (turn >= 10) {
        setGameStatus('won');
      } else {
        setTurn((prev) => prev + 1);
        drawHand();
        nextEnemyTurn();
      }
    } else {
      const newHp = hp - 1;
      setHp(newHp);
      if (newHp <= 0) {
        setGameStatus('lost');
      } else {
        // 실패하더라도 다음 기회 제공 (또는 동일 턴 유지)
        // 여기서는 실패 시 HP만 깎고 같은 공격 유지하거나 다음 공격으로 넘김
        // 기획서상 "방어 실패 시 체력 -1"이므로 다음 공격으로 넘기겠습니다.
        drawHand();
        nextEnemyTurn();
      }
    }
  };

  return {
    hp,
    turn,
    hand,
    currentAttack,
    gameStatus,
    playCard,
    initGame
  };
};
