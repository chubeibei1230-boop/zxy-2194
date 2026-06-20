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
        {summaryItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className={`bg-${item.color}-50 rounded-xl p-4 border border-${item.color}-200`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 text-${item.color}-600`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className={`text-xl font-bold text-${item.color}-700`}>{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
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
