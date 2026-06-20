import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, AlertTriangle, Award } from 'lucide-react';

interface TutorialContentProps {
  onClose: () => void;
}

export const TutorialContent = ({ onClose }: TutorialContentProps) => {
  const steps = [
    {
      icon: '📋',
      title: '任务管理',
      description: '游戏中有四种任务：砂纸发放、工位清理、上油等待和下一批入场。拖拽任务可以调整顺序，将助理拖拽到任务上即可开始执行。',
      color: 'from-amber-400 to-orange-500',
    },
    {
      icon: '🧹',
      title: '工位清理',
      description: '每批参与者使用完工位后需要清理。优先清理工位可以让后续批次更快入场。清理中的工位会显示进度条。',
      color: 'from-emerald-400 to-green-500',
    },
    {
      icon: '⚡',
      title: '突发事件',
      description: '游戏中会随机触发事件：工位清理困难、材料包延迟、参与者提前到达、助理临时离开。点击事件卡片及时处理！',
      color: 'from-red-400 to-rose-500',
    },
    {
      icon: '⏱️',
      title: '时间管理',
      description: '合理分配助理，避免任务堆积。入场任务需要该批次其他任务完成后才能执行。上油等待可以和清理任务并行。',
      color: 'from-sky-400 to-blue-500',
    },
    {
      icon: '🏆',
      title: '评分规则',
      description: '评分包括：工位恢复率、入场延误、助理空闲比例（30%最佳）、事件遗漏和总耗时。目标是获得S级评价！',
      color: 'from-violet-400 to-purple-500',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-amber-200"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-2">🎮 游戏教程</h2>
          <p className="text-amber-700">欢迎来到木作工坊！学习如何高效管理体验区</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-amber-100 flex gap-4"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-3xl shadow-md flex-shrink-0`}
              >
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-amber-700 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-amber-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            小贴士
          </h3>
          <ul className="space-y-2 text-amber-800">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>按空格键可以快速暂停/继续游戏</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>助理空闲时会自动等待分配，及时将他们派往任务</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>事件有时间限制，超时会扣分并产生不良影响</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>上油等待不需要助理，可以和其他任务并行处理</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl
                     font-bold text-lg flex items-center justify-center gap-2 shadow-lg
                     hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
        >
          我知道了，开始游戏！
        </button>
      </motion.div>
    </div>
  );
};
