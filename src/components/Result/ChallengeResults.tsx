import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Sparkles, Gift, Star } from 'lucide-react';
import { ChallengeResult } from '../../types';
import { getChallengeRating, calculateChallengeBonus } from '../../systems/challengeSystem';

interface ChallengeResultsProps {
  results: ChallengeResult[];
  challengeBonus: number;
}

export const ChallengeResults = ({ results, challengeBonus }: ChallengeResultsProps) => {
  if (results.length === 0) return null;

  const rating = getChallengeRating(results, results.length);
  const achievedCount = results.filter((r) => r.achieved).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border-4 border-amber-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full mb-3 shadow-lg">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold">经营委托结算</span>
          <Sparkles className="w-5 h-5" />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-7xl mb-2"
        >
          {rating.icon}
        </motion.div>
        <h2 className="text-3xl font-black text-amber-900 mb-1">{rating.label}</h2>
        <p className="text-amber-600 mb-4">
          完成委托 <span className="font-bold text-emerald-600">{achievedCount}</span> / {results.length}
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-amber-100 px-6 py-3 rounded-2xl border-2 border-yellow-300 shadow-md"
        >
          <Gift className="w-6 h-6 text-amber-600" />
          <span className="text-amber-700 font-semibold">委托奖励</span>
          <span className="text-3xl font-black text-amber-900">+{challengeBonus}</span>
          <span className="text-amber-700 font-semibold">分</span>
          {rating.bonusMultiplier > 1 && (
            <span className="text-xs bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-2 py-1 rounded-full font-bold flex items-center gap-1">
              <Star className="w-3 h-3" />
              {rating.bonusMultiplier}×加成
            </span>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {results.map((result, index) => (
          <ResultCard
            key={result.challenge.id}
            result={result}
            index={index}
            variants={itemVariants}
          />
        ))}
      </motion.div>
    </div>
  );
};

interface ResultCardProps {
  result: ChallengeResult;
  index: number;
  variants: any;
}

const ResultCard = ({ result, index, variants }: ResultCardProps) => {
  const { challenge, achieved, finalValue } = result;

  return (
    <motion.div
      variants={variants}
      className={`rounded-2xl p-4 border-2 transition-all ${
        achieved
          ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
          : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
            achieved ? 'bg-emerald-100' : 'bg-red-100'
          }`}
        >
          {achieved ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          ) : (
            <XCircle className="w-7 h-7 text-red-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`font-bold text-base ${
                achieved ? 'text-emerald-800' : 'text-red-800'
              }`}
            >
              委托 #{index + 1} · {challenge.icon} {challenge.title}
            </h3>
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full flex-shrink-0 ml-2 ${
                achieved
                  ? 'bg-emerald-200 text-emerald-700'
                  : 'bg-red-200 text-red-700'
              }`}
            >
              {achieved ? `+${challenge.bonusScore}分` : '未达成'}
            </span>
          </div>

          <p className={`text-sm mb-2 ${achieved ? 'text-emerald-700' : 'text-red-700'}`}>
            {challenge.description}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <span className={achieved ? 'text-emerald-600' : 'text-red-600'}>
              📊 最终: <span className="font-bold">{finalValue}{challenge.unit}</span>
              <span className="mx-1">/</span>
              目标: <span className="font-bold">{challenge.targetValue}{challenge.unit}</span>
            </span>
            {achieved && (
              <span className="text-emerald-600 flex items-center gap-1">
                <Star className="w-4 h-4" />
                {challenge.rewardText}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
