import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Challenge } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { getChallengeProgressText } from '../../systems/challengeSystem';

export const ChallengeTracker = () => {
  const { gameState } = useGameStore();
  const { gameMode } = gameState;
  const [isExpanded, setIsExpanded] = useState(true);

  if (!gameMode.challengeMode || gameMode.challenges.length === 0) return null;

  const challenges = gameMode.challenges;
  const completedCount = challenges.filter((c) => c.isCompleted).length;
  const totalCount = challenges.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg border-2 border-amber-200 overflow-hidden"
    >
      <div
        className="p-4 cursor-pointer select-none hover:bg-amber-100/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900">经营委托</h3>
              <p className="text-sm text-amber-600">
                已完成 <span className="font-bold text-emerald-600">{completedCount}</span> / {totalCount}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {challenges.map((c) =>
                c.isCompleted ? (
                  <CheckCircle2 key={c.id} className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle key={c.id} className="w-4 h-4 text-amber-300" />
                )
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-amber-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-amber-600" />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-amber-200"
          >
            <div className="p-4 space-y-3">
              {challenges.map((challenge) => (
                <ChallengeProgressItem key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface ChallengeProgressItemProps {
  challenge: Challenge;
}

const ChallengeProgressItem = ({ challenge }: ChallengeProgressItemProps) => {
  const progressText = getChallengeProgressText(challenge);
  const progress = calculateProgress(challenge);

  return (
    <motion.div
      layout
      className={`rounded-xl p-3 transition-all duration-300 ${
        challenge.isCompleted
          ? 'bg-emerald-50 border-2 border-emerald-200'
          : 'bg-white border-2 border-amber-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${
            challenge.isCompleted
              ? 'bg-emerald-100'
              : 'bg-amber-50'
          }`}
        >
          {challenge.isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </motion.div>
          ) : (
            <span>{challenge.icon}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p
              className={`font-semibold text-sm truncate ${
                challenge.isCompleted ? 'text-emerald-700 line-through' : 'text-amber-900'
              }`}
            >
              {challenge.title}
            </p>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                challenge.isCompleted
                  ? 'bg-emerald-200 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {challenge.isCompleted ? '已达成' : progressText}
            </span>
          </div>

          <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, progress)}%`,
              }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-full ${
                challenge.isCompleted
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500'
              }`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const calculateProgress = (challenge: Challenge): number => {
  switch (challenge.type) {
    case 'batch-admission-time': {
      if (challenge.currentValue === 0 || challenge.targetValue === 0) return 0;
      const ratio = challenge.currentValue / challenge.targetValue;
      if (challenge.currentValue <= challenge.targetValue) {
        return Math.min(100, 50 + (1 - ratio) * 50);
      }
      return Math.max(0, 50 - (ratio - 1) * 50);
    }
    case 'total-time-budget': {
      if (challenge.targetValue === 0) return 0;
      const ratio = challenge.currentValue / challenge.targetValue;
      if (ratio <= 1) {
        return Math.min(100, ratio * 80);
      }
      return Math.max(0, 80 - (ratio - 1) * 100);
    }
    case 'zero-admission-delay':
    case 'max-missed-events':
    case 'min-assistant-idle': {
      if (challenge.targetValue === 0) return 0;
      const ratio = challenge.currentValue / challenge.targetValue;
      if (challenge.currentValue <= challenge.targetValue) {
        return Math.min(100, (1 - ratio * 0.5) * 100);
      }
      return Math.max(0, 50 - (ratio - 1) * 100);
    }
    case 'station-recovery-rate': {
      if (challenge.currentValue === 0) return 0;
      return Math.min(100, (challenge.currentValue / challenge.targetValue) * 100);
    }
    case 'assistant-high-efficiency': {
      return Math.min(100, (challenge.currentValue / Math.max(1, challenge.targetValue)) * 100);
    }
    default:
      return 0;
  }
};
