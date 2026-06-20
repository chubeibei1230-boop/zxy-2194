import { Task, Station, TaskType } from '../types';
import { TASK_CONFIGS } from '../data/constants';
import { generateId } from '../utils/helpers';

export const createTask = (
  type: TaskType,
  batchNumber: number,
  stationId?: string,
  priority: number = 0
): Task => {
  const config = TASK_CONFIGS[type];
  return {
    id: generateId(),
    type,
    stationId,
    estimatedTime: config.baseTime,
    remainingTime: config.baseTime,
    status: 'pending',
    priority,
    batchNumber,
  };
};

export const generateBatchTasks = (
  batchNumber: number,
  stationsNeedingCleanup: Station[],
  totalStations: number
): Task[] => {
  const tasks: Task[] = [];
  
  tasks.push(createTask('sandpaper', batchNumber, undefined, 1));
  
  stationsNeedingCleanup.forEach((station) => {
    tasks.push(createTask('cleanup', batchNumber, station.id, 2));
  });
  
  if (batchNumber > 1) {
    const stationsToOil = Math.min(batchNumber - 1, totalStations);
    for (let i = 0; i < stationsToOil; i++) {
      tasks.push(createTask('oiling', batchNumber, undefined, 3));
    }
  }
  
  tasks.push(createTask('admission', batchNumber, undefined, 4));
  
  return tasks.sort((a, b) => a.priority - b.priority);
};

export const getTaskDurationMultiplier = (type: TaskType): number => {
  return TASK_CONFIGS[type].baseTime;
};

export const canAssignAssistant = (task: Task): boolean => {
  return task.status === 'pending' && !task.assignedAssistantId;
};

export const isTaskBlocked = (task: Task, allTasks: Task[]): boolean => {
  if (task.type === 'admission') {
    const sameBatchTasks = allTasks.filter(
      (t) => t.batchNumber === task.batchNumber && t.id !== task.id
    );
    return sameBatchTasks.some((t) => t.status !== 'completed');
  }
  
  if (task.type === 'oiling') {
    const prevBatchCleanup = allTasks.filter(
      (t) => t.batchNumber === task.batchNumber && t.type === 'cleanup'
    );
    return prevBatchCleanup.some((t) => t.status !== 'completed');
  }
  
  return false;
};
