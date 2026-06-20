import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

interface SuggestionCardProps {
  suggestion: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  isChallengeMode?: boolean;
}

export const SuggestionCard = ({ suggestion, onPlayAgain, onBackToMenu, isChallengeMode = false }: SuggestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg border-2 border-amber-300"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
          <Lightbulb className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-amber-900 mb-2">💡 改进建议</h3>
          <p className="text-amber-800 leading-relaxed">{suggestion}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPlayAgain}
          className={`flex-1 text-white py-4 rounded-xl
                     font-bold text-lg flex items-center justify-center gap-2 shadow-lg
                     transition-all duration-300 transform hover:scale-105 ${
                       isChallengeMode
                         ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600'
                         : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'
                     }`}
        >
          {isChallengeMode ? <Sparkles className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          {isChallengeMode ? '再来一局挑战' : '再玩一次'}
        </button>
        <button
          onClick={onBackToMenu}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl
                     font-bold text-lg flex items-center justify-center gap-2 shadow-lg
                     hover:from-amber-600 hover:to-orange-600 transition-all duration-300
                     transform hover:scale-105"
        >
          返回主菜单
        </button>
      </div>
    </motion.div>
  );
};
