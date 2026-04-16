import React from 'react';
import { useGameLogic, type Card } from './hooks/useGameLogic';

const App: React.FC = () => {
  const { hp, turn, hand, currentAttack, gameStatus, playCard, initGame } = useGameLogic();

  const renderHP = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-2xl ${i < hp ? 'text-red-500' : 'text-gray-300'}`}>
        ❤️
      </span>
    ));
  };

  if (gameStatus === 'won') {
    return (
      <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-green-700 mb-4">승소! 스테이지 클리어</h1>
        <p className="text-lg text-green-600 mb-8">모든 청구원인을 성공적으로 방어했습니다.</p>
        <button
          onClick={initGame}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
        >
          다시 시작하기
        </button>
      </div>
    );
  }

  if (gameStatus === 'lost') {
    return (
      <div className="min-h-screen bg-red-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-red-700 mb-4">패소... 게임 오버</h1>
        <p className="text-lg text-red-600 mb-8">체력이 모두 소진되었습니다.</p>
        <button
          onClick={initGame}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      {/* 상단: 상태 바 */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center space-x-1">
          {renderHP()}
        </div>
        <div className="text-xl font-bold text-gray-700">
          턴: <span className="text-blue-600">{turn}</span> / 10
        </div>
      </header>

      {/* 중앙: 상대방 공격 구역 */}
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-2xl">
        {currentAttack && (
          <div className="bg-red-50 border-4 border-red-500 rounded-2xl p-8 w-full text-center shadow-lg transform transition-all animate-pulse">
            <h2 className="text-red-600 font-bold mb-2 uppercase tracking-widest text-sm">원고의 청구</h2>
            <div className="text-3xl font-extrabold text-red-800 break-keep">
              {currentAttack.name}
            </div>
            <div className="mt-4 text-red-400 text-xs italic">
              ID: {currentAttack.id}
            </div>
          </div>
        )}
      </main>

      {/* 하단: 플레이어 손패 구역 */}
      <footer className="w-full max-w-4xl mt-12 overflow-x-auto pb-4">
        <h2 className="text-center text-gray-500 mb-4 font-semibold">피고의 항변 (제출할 카드를 선택하세요)</h2>
        <div className="flex justify-center space-x-4 min-w-max px-4">
          {hand.map((card, index) => (
            <button
              key={`${card.id}-${index}`}
              onClick={() => playCard(card)}
              className="w-48 h-64 bg-blue-600 text-white rounded-xl p-4 shadow-md hover:-translate-y-4 hover:bg-blue-700 hover:shadow-xl transition-all flex flex-col justify-between items-center text-center group"
            >
              <div className="text-blue-200 text-xs font-bold group-hover:text-blue-100 uppercase">항변 카드</div>
              <div className="text-lg font-bold break-keep leading-tight">{card.name}</div>
              <div className="bg-blue-500 w-full rounded-md py-1 text-xs opacity-70">
                선택하기
              </div>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default App;
