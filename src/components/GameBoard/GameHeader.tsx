import { Pause, Play, RotateCcw, Home, Clock, Users } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { formatTime } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export const GameHeader = () => {
  const navigate = useNavigate();
  const { gameState, pauseGame, resumeGame, restartGame } = useGameStore();
  const { elapsedTime, currentBatch, totalBatches, currentLevel } = gameState;
  const isPaused = gameState.gameStatus === 'paused';

  return (
    <div className="bg-gradient-to-r from-amber-800 to-orange-800 text-white p-4 rounded-2xl shadow-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="返回主菜单"
          >
            <Home className="w-6 h-6" />
          </button>
          
          <div className="h-8 w-px bg-white/30" />
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪵</span>
            <div>
              <h1 className="font-bold text-lg">{currentLevel?.name}</h1>
              <p className="text-amber-200 text-sm">第{currentLevel?.id}关</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-300" />
            <div>
              <p className="text-2xl font-mono font-bold">{formatTime(elapsedTime)}</p>
              <p className="text-xs text-amber-200">已用时间</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-300" />
            <div>
              <p className="text-2xl font-bold">
                {currentBatch} / {totalBatches}
              </p>
              <p className="text-xs text-amber-200">当前批次</p>
            </div>
          </div>

          {currentLevel && (
            <div className="text-center">
              <p className="text-xl font-bold">
                ⏱️ {formatTime(currentLevel.targetTime)}
              </p>
              <p className="text-xs text-amber-200">目标时间</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={isPaused ? resumeGame : pauseGame}
            className={`p-3 rounded-xl transition-all duration-300 ${
              isPaused
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
            title={isPaused ? '继续' : '暂停'}
          >
            {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </button>
          
          <button
            onClick={restartGame}
            className="p-3 bg-orange-600 hover:bg-orange-700 rounded-xl transition-all duration-300"
            title="重新开始"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isPaused && (
        <div className="mt-4 bg-black/30 rounded-xl p-4 text-center">
          <p className="text-xl font-bold">⏸️ 游戏已暂停</p>
          <p className="text-amber-200 text-sm">按空格键或点击继续按钮恢复游戏</p>
        </div>
      )}
    </div>
  );
};
