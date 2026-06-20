import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { GameHeader } from '../components/GameBoard/GameHeader';
import { StationCard } from '../components/GameBoard/StationCard';
import { TaskQueue } from '../components/GameBoard/TaskQueue';
import { AssistantCard } from '../components/GameBoard/AssistantCard';
import { EventContainer } from '../components/GameBoard/EventPopup';
import { useGameStore } from '../store/useGameStore';
import { useGameEngine } from '../hooks/useGameEngine';
import { getLevelById } from '../data/levels';

export const GamePage = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { gameState, startGame, pauseGame, resumeGame } = useGameStore();
  
  useGameEngine();

  useEffect(() => {
    if (levelId) {
      const level = getLevelById(parseInt(levelId));
      if (!level) {
        navigate('/');
        return;
      }
      startGame(parseInt(levelId));
    }
  }, [levelId, startGame, navigate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (gameState.gameStatus === 'playing') {
        pauseGame();
      } else if (gameState.gameStatus === 'paused') {
        resumeGame();
      }
    }
    if (e.code === 'Escape') {
      navigate('/');
    }
  }, [gameState.gameStatus, pauseGame, resumeGame, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState.gameStatus === 'completed' && levelId) {
      navigate(`/result/${levelId}`);
    }
  }, [gameState.gameStatus, levelId, navigate]);

  if (!gameState.currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🪵</div>
          <p className="text-amber-800 text-xl">加载中...</p>
        </div>
      </div>
    );
  }

  const { stations, assistants } = gameState;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 p-6">
      <div className="max-w-7xl mx-auto">
        <GameHeader />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-200 mb-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                助理团队
              </h2>
              <div className="space-y-4">
                {assistants.map((assistant) => (
                  <AssistantCard key={assistant.id} assistant={assistant} />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-200 mb-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4">🪑 工位状态</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stations.map((station) => (
                  <StationCard key={station.id} station={station} />
                ))}
              </div>
            </div>

            <TaskQueue />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-200">
              <h2 className="text-xl font-bold text-amber-900 mb-4">📊 实时统计</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-amber-600 mb-1">工位恢复率</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {gameState.totalStationsUsed > 0
                      ? Math.round(
                          (gameState.totalStationsCleaned / gameState.totalStationsUsed) * 100
                        )
                      : 100}
                    %
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-amber-600 mb-1">待处理事件</p>
                  <p className="text-2xl font-bold text-red-600">
                    {gameState.activeEvents.length}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-amber-600 mb-1">已处理事件</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {gameState.eventLog.filter((e) => e.handled).length}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-amber-600 mb-1">空闲助理</p>
                  <p className="text-2xl font-bold text-sky-600">
                    {assistants.filter((a) => a.status === 'idle').length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <EventContainer />
    </div>
  );
};
