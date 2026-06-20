import { motion } from 'framer-motion';
import { User, Coffee } from 'lucide-react';
import { Assistant } from '../../types';

interface AssistantCardProps {
  assistant: Assistant;
}

export const AssistantCard = ({ assistant }: AssistantCardProps) => {
  const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
    idle: {
      label: '空闲',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100 border-emerald-300',
      icon: '✅',
    },
    busy: {
      label: '忙碌',
      color: 'text-amber-700',
      bgColor: 'bg-amber-100 border-amber-300',
      icon: '⚡',
    },
    away: {
      label: '离开',
      color: 'text-red-700',
      bgColor: 'bg-red-100 border-red-300',
      icon: '🚶',
    },
  };

  const config = statusConfig[assistant.status];
  const isDraggable = assistant.status === 'idle';

  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => {
        if (isDraggable) {
          e.dataTransfer.setData('assistantId', assistant.id);
          e.dataTransfer.effectAllowed = 'move';
        }
      }}
      className={`relative ${config.bgColor} border-2 rounded-xl p-4 shadow-md transition-all duration-300 ${
        isDraggable ? 'cursor-grab active:cursor-grabbing hover:shadow-lg hover:-translate-y-1' : ''
      }`}
    >
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-900">{assistant.name}</h4>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-semibold ${config.color}`}>
                {config.icon} {config.label}
              </span>
            </div>
          </div>
        </div>

        {assistant.status === 'away' && assistant.awayTimeRemaining > 0 && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-600 flex items-center gap-1">
                <Coffee className="w-3 h-3" />
                返回倒计时
              </span>
              <span className="text-red-600 font-bold">
                {Math.ceil(assistant.awayTimeRemaining)}秒
              </span>
            </div>
            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${(assistant.awayTimeRemaining / 10) * 100}%` }}
                className="h-full bg-red-500 rounded-full"
              />
            </div>
          </div>
        )}

        {assistant.status === 'idle' && (
          <div className="mt-2 text-center">
            <span className="text-xs text-emerald-600 font-medium">👆 拖拽分配任务</span>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-amber-200/50 grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <p className="text-amber-500">空闲时间</p>
            <p className="font-bold text-amber-800">
              {Math.round(assistant.totalIdleTime)}秒
            </p>
          </div>
          <div className="text-center">
            <p className="text-amber-500">工作时间</p>
            <p className="font-bold text-amber-800">
              {Math.round(assistant.totalBusyTime)}秒
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
