import { motion } from 'framer-motion';
import { Trophy, Clock, Users, AlertTriangle, Target, TrendingUp } from 'lucide-react';
import { ScoreResult } from '../../types';
import { formatTime } from '../../utils/helpers';
import { getLevelById } from '../../data/levels';

interface ScorePanelProps {
  score: ScoreResult;
  highScore: ScoreResult | null;
  isNewHighScore: boolean;
  levelId?: number;
}

export const ScorePanel = ({ score, highScore, isNewHighScore, levelId }: ScorePanelProps) => {
  const gradeColors: Record<string, string> = {
    S: 'from-yellow-400 to-amber-500',
    A: 'from-emerald-400 to-green-500',
    B: 'from-sky-400 to-blue-500',
    C: 'from-orange-400 to-amber-500',
    D: 'from-red-400 to-rose-500',
  };

  const colorClasses: Record<string, { bg: string; text: string; gradient: string }> = {
    emerald: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
      gradient: 'from-emerald-400 to-emerald-600',
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      gradient: 'from-amber-400 to-amber-600',
    },
    sky: {
      bg: 'bg-sky-100',
      text: 'text-sky-600',
      gradient: 'from-sky-400 to-sky-600',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      gradient: 'from-red-400 to-red-600',
    },
    violet: {
      bg: 'bg-violet-100',
      text: 'text-violet-600',
      gradient: 'from-violet-400 to-violet-600',
    },
  };

  const calculateProgressWidth = (
    label: string,
    value: number,
    numericValue: number
  ): number => {
    switch (label) {
      case '工位恢复率':
        return value;
      case '平均入场延误': {
        const maxDelay = 20;
        const normalized = Math.max(0, Math.min(1, numericValue / maxDelay));
        return (1 - normalized) * 100;
      }
      case '助理空闲比例': {
        const deviation = Math.abs(numericValue - 30);
        const maxDeviation = 30;
        const normalized = Math.max(0, Math.min(1, deviation / maxDeviation));
        return (1 - normalized) * 100;
      }
      case '事件遗漏': {
        const maxMissed = 4;
        const normalized = Math.max(0, Math.min(1, numericValue / maxMissed));
        return (1 - normalized) * 100;
      }
      case '总耗时': {
        const level = levelId ? getLevelById(levelId) : null;
        const targetTime = level?.targetTime || 120;
        const maxTime = targetTime * 1.5;
        const normalized = Math.max(0, Math.min(1, numericValue / maxTime));
        return (1 - normalized) * 100;
      }
      default:
        return 50;
    }
  };

  const scoreItems = [
    {
      label: '工位恢复率',
      value: `${score.stationRecoveryRate}%`,
      numericValue: score.stationRecoveryRate,
      icon: Target,
      color: 'emerald',
      best: 100,
      highScoreValue: highScore ? `${highScore.stationRecoveryRate}%` : null,
    },
    {
      label: '平均入场延误',
      value: `${score.admissionDelay}秒`,
      numericValue: score.admissionDelay,
      icon: Clock,
      color: 'amber',
      best: 0,
      highScoreValue: highScore ? `${highScore.admissionDelay}秒` : null,
    },
    {
      label: '助理空闲比例',
      value: `${score.assistantIdleRatio}%`,
      numericValue: score.assistantIdleRatio,
      icon: Users,
      color: 'sky',
      best: 30,
      highScoreValue: highScore ? `${highScore.assistantIdleRatio}%` : null,
    },
    {
      label: '事件遗漏',
      value: `${score.missedEvents}个`,
      numericValue: score.missedEvents,
      icon: AlertTriangle,
      color: 'red',
      best: 0,
      highScoreValue: highScore ? `${highScore.missedEvents}个` : null,
    },
    {
      label: '总耗时',
      value: formatTime(score.totalTime),
      numericValue: score.totalTime,
      icon: TrendingUp,
      color: 'violet',
      best: 0,
      highScoreValue: highScore ? formatTime(highScore.totalTime) : null,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-2xl border-4 border-amber-200">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className={`inline-block w-32 h-32 bg-gradient-to-br ${gradeColors[score.grade]} rounded-full flex items-center justify-center shadow-2xl mb-4`}
        >
          <span className="text-6xl font-black text-white drop-shadow-lg">
            {score.grade}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-amber-900 mb-2"
        >
          {isNewHighScore ? '🎉 新纪录！' : '关卡完成！'}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span className="text-3xl font-bold text-amber-800">
              {score.totalScore}分
            </span>
          </div>
          {highScore && !isNewHighScore && (
            <span className="text-amber-600">
              历史最高: {highScore.totalScore}分
            </span>
          )}
        </motion.div>
      </div>

      <div className="space-y-4">
        {scoreItems.map((item, index) => {
          const colors = colorClasses[item.color];
          const progressWidth = calculateProgressWidth(item.label, item.numericValue, item.numericValue);
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-md border border-amber-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <span className="font-semibold text-amber-900">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${colors.text}`}>
                    {item.value}
                  </p>
                  {item.highScoreValue && (
                    <p className="text-xs text-amber-500">
                      纪录: {item.highScoreValue}
                    </p>
                  )}
                </div>
              </div>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.max(0, Math.min(100, progressWidth))}%`,
                  }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
