import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { X, Clock, User } from 'lucide-react';
import { Task, Assistant } from '../../types';
import { TASK_CONFIGS } from '../../data/constants';
import { useGameStore } from '../../store/useGameStore';
import { isTaskBlocked } from '../../systems/taskSystem';

interface TaskItemProps {
  task: Task;
  assistants: Assistant[];
  allTasks: Task[];
}

export const TaskItem = ({ task, assistants, allTasks }: TaskItemProps) => {
  const { unassignAssistant, assignAssistant } = useGameStore();
  const config = TASK_CONFIGS[task.type];
  const blocked = isTaskBlocked(task, allTasks);
  
  const assignedAssistant = assistants.find((a) => a.id === task.assignedAssistantId);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: task.status !== 'pending' || blocked,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `task-drop-${task.id}`,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const colorClasses: Record<string, string> = {
    amber: 'from-amber-400 to-orange-500 border-amber-300',
    emerald: 'from-emerald-400 to-green-500 border-emerald-300',
    sky: 'from-sky-400 to-blue-500 border-sky-300',
    violet: 'from-violet-400 to-purple-500 border-violet-300',
  };

  const bgColorClasses: Record<string, string> = {
    amber: 'bg-amber-50',
    emerald: 'bg-emerald-50',
    sky: 'bg-sky-50',
    violet: 'bg-violet-50',
  };

  const handleDrop = (assistantId: string) => {
    if (task.status === 'pending' && !blocked) {
      assignAssistant(task.id, assistantId);
    }
  };

  const progress = task.estimatedTime > 0 
    ? ((task.estimatedTime - task.remainingTime) / task.estimatedTime) * 100 
    : 0;

  return (
    <motion.div
      ref={(node) => {
        setNodeRef(node);
        setDropRef(node);
      }}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative ${bgColorClasses[config.color]} border-2 ${
        isOver ? 'border-emerald-400 ring-2 ring-emerald-400/50' : ''
      } ${
        task.status === 'completed'
          ? 'opacity-50 grayscale'
          : blocked
          ? 'opacity-60'
          : ''
      } rounded-xl p-4 shadow-md transition-all duration-300`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const assistantId = e.dataTransfer.getData('assistantId');
        if (assistantId) handleDrop(assistantId);
      }}
    >
      {task.status === 'completed' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
          <span className="text-4xl">✅</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${colorClasses[config.color]} rounded-xl flex items-center justify-center text-2xl shadow-md`}
          >
            {config.icon}
          </div>
          <div>
            <h4 className="font-bold text-amber-900">{config.name}</h4>
            <p className="text-xs text-amber-600">第 {task.batchNumber} 批</p>
          </div>
        </div>

        {task.status === 'in-progress' && assignedAssistant && (
          <button
            onClick={() => unassignAssistant(task.id)}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors text-red-500"
            title="取消分配"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <div className="flex items-center gap-1 text-amber-700">
          <Clock className="w-4 h-4" />
          <span>
            {task.status === 'in-progress'
              ? `${Math.ceil(task.remainingTime)}秒`
              : `${task.estimatedTime}秒`}
          </span>
        </div>

        {assignedAssistant && (
          <div className="flex items-center gap-1 text-amber-700">
            <User className="w-4 h-4" />
            <span>{assignedAssistant.name}</span>
          </div>
        )}
      </div>

      {task.status === 'in-progress' && (
        <div className="space-y-1">
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full bg-gradient-to-r ${colorClasses[config.color]} rounded-full`}
            />
          </div>
        </div>
      )}

      {blocked && task.status === 'pending' && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-2 py-1">
          ⚠️ 等待其他任务完成
        </div>
      )}

      {task.priority === -1 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          紧急！
        </div>
      )}
    </motion.div>
  );
};
