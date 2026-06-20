import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LevelCard } from '../components/MainMenu/LevelCard';
import { TutorialContent } from '../components/Tutorial/TutorialContent';
import { LEVELS } from '../data/levels';
import { useGameStore } from '../store/useGameStore';

export const MainMenuPage = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);
  const { highScores } = useGameStore();

  const handleLevelClick = (levelId: number) => {
    navigate(`/game/${levelId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-6">
            <span className="text-8xl">🪵</span>
          </div>
          <h1 className="text-5xl font-black text-amber-900 mb-4 tracking-tight">
            木作工坊
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            管理你的木作体验区，合理安排任务，处理突发事件，
            <br />
            让每一位参与者都能享受愉快的木作时光！
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          <button
            onClick={() => setShowTutorial(true)}
            className="bg-white px-6 py-3 rounded-xl shadow-md border-2 border-amber-200
                       flex items-center gap-2 text-amber-800 font-semibold
                       hover:bg-amber-50 hover:border-amber-400 transition-all duration-300
                       transform hover:-translate-y-1 hover:shadow-lg"
          >
            <BookOpen className="w-5 h-5" />
            游戏教程
          </button>
          <div className="bg-white px-6 py-3 rounded-xl shadow-md border-2 border-amber-200
                          flex items-center gap-2 text-amber-800 font-semibold">
            <Trophy className="w-5 h-5 text-yellow-500" />
            最高分记录
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {LEVELS.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <LevelCard
                level={level}
                highScore={highScores[level.id] || null}
                onClick={() => handleLevelClick(level.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-amber-600 text-sm"
        >
          <p>💡 提示：按空格键可以暂停/继续游戏</p>
        </motion.div>
      </div>

      {showTutorial && <TutorialContent onClose={() => setShowTutorial(false)} />}
    </div>
  );
};
