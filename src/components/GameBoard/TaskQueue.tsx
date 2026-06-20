import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { useGameStore } from '../../store/useGameStore';

export const TaskQueue = () => {
  const { gameState, reorderTasks } = useGameStore();
  const { taskQueue, assistants } = gameState;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = taskQueue.findIndex((t) => t.id === active.id);
      const newIndex = taskQueue.findIndex((t) => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newQueue = arrayMove(taskQueue, oldIndex, newIndex);
        reorderTasks(newQueue.map((t) => t.id));
      }
    }
  };

  const pendingTasks = taskQueue.filter((t) => t.status !== 'completed');
  const completedTasks = taskQueue.filter((t) => t.status === 'completed');

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
          <ListTodo className="w-6 h-6" />
          任务队列
        </h2>
        <div className="flex gap-2">
          <span className="bg-amber-200 text-amber-800 text-sm px-3 py-1 rounded-full font-medium">
            待处理: {pendingTasks.length}
          </span>
          <span className="bg-emerald-200 text-emerald-800 text-sm px-3 py-1 rounded-full font-medium">
            已完成: {completedTasks.length}
          </span>
        </div>
      </div>

      <p className="text-amber-600 text-sm mb-4">
        💡 拖拽任务调整顺序，将左侧助理拖拽到任务上开始执行
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={taskQueue.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            <AnimatePresence>
              {taskQueue.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  assistants={assistants}
                  allTasks={taskQueue}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {taskQueue.length === 0 && (
        <div className="text-center py-12 text-amber-400">
          <ListTodo className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">暂无任务</p>
        </div>
      )}
    </div>
  );
};
