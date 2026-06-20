import { Play, Trophy, Lock } from 'lucide-react';
import { LevelConfig, ScoreResult } from '../../types';
import { formatTime } from '../../utils/helpers';

interface LevelCardProps {
  level: LevelConfig;
  highScore: ScoreResult | null;
  onClick: () => void;
}

export const LevelCard = ({ level, highScore, onClick }: LevelCardProps) => {
  const difficultyColors: Record<string, string> = {
    low: 'bg-emerald-500',
    medium: 'bg-amber-500',
    high: 'bg-orange-500',
    extreme: 'bg-red-500',
  };

  const difficultyLabels: Record<string, string> = {
    low: '简单',
    medium: '中等',
    high: '困难',
    extreme: '极难',
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg 
                 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-amber-200
                 hover:border-amber-400 transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="absolute top-4 right-4">
        <span
          className={`${difficultyColors[level.eventFrequency]} text-white text-xs px-3 py-1 rounded-full font-medium`}
        >
          {difficultyLabels[level.eventFrequency]}
        </span>
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
          <span className="text-3xl">🪵</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-amber-900 mb-1">
            第{level.id}关：{level.name}
          </h3>
          <p className="text-amber-700 text-sm">{level.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="bg-white/60 rounded-lg p-2">
          <span className="text-amber-600">👥 批次：</span>
          <span className="font-semibold text-amber-900">{level.batches}批</span>
        </div>
        <div className="bg-white/60 rounded-lg p-2">
          <span className="text-amber-600">🪑 工位：</span>
          <span className="font-semibold text-amber-900">{level.stations}个</span>
        </div>
        <div className="bg-white/60 rounded-lg p-2">
          <span className="text-amber-600">🧑‍🤝‍🧑 助理：</span>
          <span className="font-semibold text-amber-900">{level.assistants}名</span>
        </div>
        <div className="bg-white/60 rounded-lg p-2">
          <span className="text-amber-600">⏱️ 目标：</span>
          <span className="font-semibold text-amber-900">{formatTime(level.targetTime)}</span>
        </div>
      </div>

      {highScore && (
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-3 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="text-xs text-yellow-700">最高分</p>
            <p className="font-bold text-yellow-800">
              {highScore.totalScore}分 · {highScore.grade}级
            </p>
          </div>
        </div>
      )}

      <button
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl
                   font-semibold flex items-center justify-center gap-2 shadow-md
                   group-hover:from-amber-600 group-hover:to-orange-600 transition-all duration-300
                   group-hover:shadow-lg"
      >
        <Play className="w-5 h-5" />
        开始游戏
      </button>
    </div>
  );
};
