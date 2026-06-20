import { motion } from 'framer-motion';
import { Scroll, Sparkles, ArrowRight } from 'lucide-react';
import { Challenge } from '../../types';
import { useGameStore } from '../../store/useGameStore';

export const ChallengePreview = () => {
  const { gameState, dismissChallengePreview } = useGameStore();
  const { gameMode, currentLevel } = gameState;

  if (!gameMode.challengeMode || !gameMode.showChallengePreview) return null;

  const challenges = gameMode.challenges;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-4 border-amber-300"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">订单挑战模式</span>
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-black text-amber-900 mb-2">
            📋 本局经营委托
          </h2>
          <p className="text-amber-700">
            {currentLevel?.name} · 完成以下委托获得额外奖励分数！
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-8"
        >
          {challenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              index={index}
              variants={itemVariants}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-4 mb-6 border-2 border-amber-200"
        >
          <div className="flex items-center gap-3 text-amber-800">
            <Scroll className="w-6 h-6 text-amber-600" />
            <div>
              <p className="font-semibold">奖励说明</p>
              <p className="text-sm text-amber-600">
                完成委托可获得额外分数，完成全部委托还能获得加成倍数！
              </p>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={dismissChallengePreview}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 px-8 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
        >
          <span>开工！接受挑战</span>
          <ArrowRight className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </div>
  );
};

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
  variants: any;
}

const ChallengeCard = ({ challenge, index, variants }: ChallengeCardProps) => {
  return (
    <motion.div
      variants={variants}
      className="bg-white rounded-2xl p-5 shadow-md border-2 border-amber-100 hover:border-amber-300 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
          {challenge.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-amber-900">
              委托 #{index + 1} · {challenge.title}
            </h3>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              +{challenge.bonusScore}分
            </span>
          </div>
          <p className="text-amber-700 mb-3">{challenge.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-amber-600">
              🎯 目标: <span className="font-bold">{challenge.targetValue}{challenge.unit}</span>
            </span>
            <span className="text-amber-500">
              🏅 {challenge.rewardText}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
