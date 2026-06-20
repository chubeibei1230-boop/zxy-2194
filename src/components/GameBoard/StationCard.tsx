import { motion } from 'framer-motion';
import { Station } from '../../types';

interface StationCardProps {
  station: Station;
}

export const StationCard = ({ station }: StationCardProps) => {
  const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
    idle: {
      label: '空闲',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100 border-emerald-300',
      icon: '✅',
    },
    'in-use': {
      label: '使用中',
      color: 'text-amber-700',
      bgColor: 'bg-amber-100 border-amber-300',
      icon: '🪚',
    },
    'needs-cleaning': {
      label: '待清理',
      color: 'text-red-700',
      bgColor: 'bg-red-100 border-red-300',
      icon: '🧹',
    },
    cleaning: {
      label: '清理中',
      color: 'text-sky-700',
      bgColor: 'bg-sky-100 border-sky-300',
      icon: '🫧',
    },
  };

  const config = statusConfig[station.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative ${config.bgColor} border-2 rounded-xl p-4 shadow-md transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <span className="font-bold text-lg text-amber-900">工位 {station.number}</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
          {config.label}
        </span>
      </div>

      {(station.status === 'cleaning' || station.status === 'needs-cleaning') && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={config.color}>清理进度</span>
            <span className={config.color}>{Math.round(station.cleanupProgress)}%</span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${station.cleanupProgress}%` }}
              className={`h-full rounded-full ${
                station.status === 'cleaning' ? 'bg-sky-500' : 'bg-red-400'
              }`}
            />
          </div>
        </div>
      )}

      {station.status === 'idle' && station.cleanupProgress === 100 && (
        <div className="text-center">
          <span className="text-emerald-600 text-sm font-medium">✨ 已准备就绪</span>
        </div>
      )}
    </motion.div>
  );
};
