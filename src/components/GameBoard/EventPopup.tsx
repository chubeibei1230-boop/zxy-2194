import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, X } from 'lucide-react';
import { GameEvent } from '../../types';
import { useGameStore } from '../../store/useGameStore';

interface EventPopupProps {
  event: GameEvent;
}

export const EventPopup = ({ event }: EventPopupProps) => {
  const { handleEvent } = useGameStore();

  const eventIcons: Record<string, string> = {
    'cleanup-difficulty': '🧹',
    'material-delay': '📦',
    'early-arrival': '👥',
    'assistant-leave': '🚶',
  };

  const urgencyColor = event.timeRemaining <= 3 
    ? 'from-red-500 to-rose-600' 
    : event.timeRemaining <= 5 
    ? 'from-orange-500 to-amber-600' 
    : 'from-amber-500 to-orange-600';

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="bg-white rounded-2xl shadow-2xl border-2 border-red-200 overflow-hidden max-w-sm"
    >
      <div className={`bg-gradient-to-r ${urgencyColor} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{eventIcons[event.type]}</span>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {event.title}
              </h3>
              <p className="text-white/80 text-sm">突发事件！</p>
            </div>
          </div>
          <div className="text-center">
            <Clock className="w-6 h-6 mx-auto mb-1" />
            <span className={`text-2xl font-bold ${
              event.timeRemaining <= 3 ? 'animate-pulse' : ''
            }`}>
              {Math.ceil(event.timeRemaining)}
            </span>
            <p className="text-xs">秒</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-amber-800 mb-4 leading-relaxed">{event.description}</p>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(event.timeRemaining / event.timeLimit) * 100}%` }}
            className={`h-full rounded-full bg-gradient-to-r ${urgencyColor}`}
          />
        </div>

        <button
          onClick={() => handleEvent(event.id)}
          className={`w-full bg-gradient-to-r ${urgencyColor} text-white py-3 rounded-xl
                     font-bold flex items-center justify-center gap-2 shadow-lg
                     hover:brightness-110 transition-all duration-300 transform hover:scale-105`}
        >
          <span className="text-xl">⚡</span>
          立即处理
        </button>
      </div>
    </motion.div>
  );
};

export const EventContainer = () => {
  const { gameState } = useGameStore();
  const { activeEvents } = gameState;

  return (
    <div className="fixed top-24 right-4 z-40 space-y-4 max-w-sm">
      <AnimatePresence>
        {activeEvents.map((event) => (
          <EventPopup key={event.id} event={event} />
        ))}
      </AnimatePresence>
    </div>
  );
};
