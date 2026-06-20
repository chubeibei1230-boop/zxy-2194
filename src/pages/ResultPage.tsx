import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScorePanel } from '../components/Result/ScorePanel';
import { GameSummary } from '../components/Result/GameSummary';
import { SuggestionCard } from '../components/Result/SuggestionCard';
import { useGameStore } from '../store/useGameStore';
import { getHighScore } from '../utils/storage';
import { getLevelById } from '../data/levels';

export const ResultPage = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { gameState, lastScore, isNewHighScore, getSuggestion, startGame, highScores } = useGameStore();

  useEffect(() => {
    if (!lastScore && levelId) {
      const level = getLevelById(parseInt(levelId));
      if (level && gameState.gameStatus !== 'completed') {
        navigate(`/game/${levelId}`);
      }
    }
  }, [lastScore, levelId, gameState.gameStatus, navigate]);

  if (!lastScore || !levelId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🏆</div>
          <p className="text-amber-800 text-xl">加载结算数据...</p>
        </div>
      </div>
    );
  }

  const level = getLevelById(parseInt(levelId));
  const highScore = getHighScore(parseInt(levelId));
  const suggestion = getSuggestion();

  const handlePlayAgain = () => {
    startGame(parseInt(levelId));
    navigate(`/game/${levelId}`);
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            {level?.name} - 结算
          </h1>
          <p className="text-amber-600">第{level?.id}关</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScorePanel
            score={lastScore}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            levelId={parseInt(levelId)}
          />

          <div className="space-y-6">
            <GameSummary gameState={gameState} />
            <SuggestionCard
              suggestion={suggestion}
              onPlayAgain={handlePlayAgain}
              onBackToMenu={handleBackToMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
