import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { GameState } from '../../types';
import { formatTime } from '../../utils/helpers';

interface GameSummaryProps {
  gameState: GameState;
}

export const GameSummary = ({ gameState }: GameSummaryProps) => {
  const { eventLog, admissionTimes, totalStationsUsed, totalStationsCleaned, elapsedTime, currentBatch, totalBatches } = gameState;

  const handledEvents = eventLog.filter((e) => e.handled).length;
  const missedEvents = eventLog.filter((e) => !e.handled).length;

  const colorClasses: Record<string, { card: string; iconBg: string; iconText: string; valueText: string }> = {
    emerald: {
      card: 'bg-emerald-50 border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      valueText: 'text-emerald-700',
    },
    sky: {
      card: 'bg-sky-50 border-sky-200',
      iconBg: 'bg-sky-100',
      iconText: 'text-sky-600',
      valueText: 'text-sky-700',
    },
    amber: {
      card: 'bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      valueText: 'text-amber-700',
    },
    violet: {
      card: 'bg-violet-50 border-violet-200',
      iconBg: 'bg-violet-100',
      iconText: 'text-violet-600',
      valueText: 'text-violet-700',
    },
  };

  const summaryItems = [
    {
      label: '完成批次',
      value: `${currentBatch} / ${totalBatches}`,
      icon: Users,
      color: 'emerald',
    },
    {
      label: '使用工位',
      value: `${totalStationsCleaned} / ${totalStationsUsed}`,
      icon: CheckCircle,
      color: 'sky',
    },
    {
      label: '处理事件',
      value: `${handledEvents} / ${eventLog.length}`,
      icon: handledEvents === eventLog.length ? CheckCircle : XCircle,
      color: handledEvents === eventLog.length ? 'emerald' : 'amber',
    },
    {
      label: '总用时',
      value: formatTime(elapsedTime),
      icon: Clock,
      color: 'violet',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-200"
    >
      <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
        <FileText className="w-6 h-6" />
        本局过程摘要
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {summaryItems.map((item, index) => {
          const colors = colorClasses[item.color];

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`${colors.card} rounded-xl p-4 border`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${colors.iconText}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className={`text-xl font-bold ${colors.valueText}`}>{item.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {eventLog.length > 0 && (
        <div>
          <h4 className="font-semibold text-amber-800 mb-3">事件记录</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {eventLog.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.handled ? 'bg-emerald-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {entry.handled ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">{entry.event.title}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTime(entry.time)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
