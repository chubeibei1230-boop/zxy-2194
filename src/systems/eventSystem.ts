import { GameEvent, EventType, Task, Station, Assistant, EventFrequency } from '../types';
import { EVENT_CONFIGS, EVENT_FREQUENCY_MAP } from '../data/constants';
import { generateId, randomChoice, randomInt } from '../utils/helpers';

export const createEvent = (
  type: EventType,
  affectedTaskId?: string,
  affectedStationId?: string,
  affectedAssistantId?: string
): GameEvent => {
  const config = EVENT_CONFIGS[type];
  return {
    id: generateId(),
    type,
    title: config.title,
    description: config.description,
    timeLimit: config.timeLimit,
    timeRemaining: config.timeLimit,
    affectedTaskId,
    affectedStationId,
    affectedAssistantId,
    handled: false,
  };
};

export const shouldTriggerEvent = (
  frequency: EventFrequency,
  elapsedTime: number,
  lastEventTime: number
): boolean => {
  const interval = EVENT_FREQUENCY_MAP[frequency];
  return elapsedTime - lastEventTime >= interval && Math.random() < 0.7;
};

export const generateRandomEvent = (
  tasks: Task[],
  stations: Station[],
  assistants: Assistant[]
): GameEvent | null => {
  const eventTypes: EventType[] = ['cleanup-difficulty', 'material-delay', 'early-arrival', 'assistant-leave'];
  const availableTypes = eventTypes.filter((type) => {
    switch (type) {
      case 'cleanup-difficulty':
        return stations.some((s) => s.status === 'needs-cleaning' || s.status === 'cleaning');
      case 'material-delay':
        return tasks.some((t) => t.type === 'admission' && t.status === 'pending');
      case 'early-arrival':
        return tasks.some((t) => t.type === 'admission' && t.status === 'pending');
      case 'assistant-leave':
        return assistants.some((a) => a.status === 'idle' || a.status === 'busy');
      default:
        return false;
    }
  });

  if (availableTypes.length === 0) return null;

  const type = randomChoice(availableTypes);
  let affectedTaskId: string | undefined;
  let affectedStationId: string | undefined;
  let affectedAssistantId: string | undefined;

  switch (type) {
    case 'cleanup-difficulty': {
      const dirtyStations = stations.filter(
        (s) => s.status === 'needs-cleaning' || s.status === 'cleaning'
      );
      const station = randomChoice(dirtyStations);
      affectedStationId = station.id;
      const cleanupTask = tasks.find(
        (t) => t.type === 'cleanup' && t.stationId === station.id && t.status !== 'completed'
      );
      if (cleanupTask) affectedTaskId = cleanupTask.id;
      break;
    }
    case 'material-delay': {
      const admissionTasks = tasks.filter((t) => t.type === 'admission' && t.status === 'pending');
      if (admissionTasks.length > 0) {
        affectedTaskId = randomChoice(admissionTasks).id;
      }
      break;
    }
    case 'early-arrival': {
      const admissionTasks = tasks.filter((t) => t.type === 'admission' && t.status === 'pending');
      if (admissionTasks.length > 0) {
        affectedTaskId = randomChoice(admissionTasks).id;
      }
      break;
    }
    case 'assistant-leave': {
      const availableAssistants = assistants.filter((a) => a.status !== 'away');
      if (availableAssistants.length > 0) {
        affectedAssistantId = randomChoice(availableAssistants).id;
      }
      break;
    }
  }

  return createEvent(type, affectedTaskId, affectedStationId, affectedAssistantId);
};

export const applyEventEffect = (
  event: GameEvent,
  tasks: Task[],
  stations: Station[],
  assistants: Assistant[]
): { tasks: Task[]; stations: Station[]; assistants: Assistant[] } => {
  const updatedTasks = [...tasks];
  const updatedStations = [...stations];
  const updatedAssistants = [...assistants];

  switch (event.type) {
    case 'cleanup-difficulty': {
      const taskIndex = updatedTasks.findIndex((t) => t.id === event.affectedTaskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          estimatedTime: Math.ceil(updatedTasks[taskIndex].estimatedTime * 1.5),
          remainingTime: Math.ceil(updatedTasks[taskIndex].remainingTime * 1.5),
        };
      }
      break;
    }
    case 'material-delay': {
      const taskIndex = updatedTasks.findIndex((t) => t.id === event.affectedTaskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          estimatedTime: updatedTasks[taskIndex].estimatedTime + 10,
          remainingTime: updatedTasks[taskIndex].remainingTime + 10,
        };
      }
      break;
    }
    case 'early-arrival': {
      const taskIndex = updatedTasks.findIndex((t) => t.id === event.affectedTaskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          priority: -1,
        };
      }
      break;
    }
    case 'assistant-leave': {
      const assistantIndex = updatedAssistants.findIndex((a) => a.id === event.affectedAssistantId);
      if (assistantIndex !== -1) {
        const assistant = updatedAssistants[assistantIndex];
        updatedAssistants[assistantIndex] = {
          ...assistant,
          status: 'away',
          awayTimeRemaining: 10,
        };
        
        if (assistant.currentTaskId) {
          const taskIndex = updatedTasks.findIndex((t) => t.id === assistant.currentTaskId);
          if (taskIndex !== -1) {
            updatedTasks[taskIndex] = {
              ...updatedTasks[taskIndex],
              assignedAssistantId: undefined,
              status: 'pending',
            };
          }
        }
      }
      break;
    }
  }

  return { tasks: updatedTasks, stations: updatedStations, assistants: updatedAssistants };
};

export const revertEventEffect = (
  event: GameEvent,
  tasks: Task[],
  stations: Station[],
  assistants: Assistant[]
): { tasks: Task[]; stations: Station[]; assistants: Assistant[] } => {
  const updatedTasks = [...tasks];
  const updatedStations = [...stations];
  const updatedAssistants = [...assistants];

  switch (event.type) {
    case 'cleanup-difficulty': {
      const taskIndex = updatedTasks.findIndex((t) => t.id === event.affectedTaskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          estimatedTime: Math.ceil(updatedTasks[taskIndex].estimatedTime / 1.5),
          remainingTime: Math.ceil(updatedTasks[taskIndex].remainingTime / 1.5),
        };
      }
      break;
    }
    case 'material-delay': {
      const taskIndex = updatedTasks.findIndex((t) => t.id === event.affectedTaskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          estimatedTime: Math.max(1, updatedTasks[taskIndex].estimatedTime - 10),
          remainingTime: Math.max(1, updatedTasks[taskIndex].remainingTime - 10),
        };
      }
      break;
    }
    case 'early-arrival': {
      const taskIndex = updatedTasks.findIndex((t) => t.id === event.affectedTaskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          priority: 4,
        };
      }
      break;
    }
    case 'assistant-leave': {
      const assistantIndex = updatedAssistants.findIndex((a) => a.id === event.affectedAssistantId);
      if (assistantIndex !== -1) {
        updatedAssistants[assistantIndex] = {
          ...updatedAssistants[assistantIndex],
          status: 'idle',
          awayTimeRemaining: 0,
        };
      }
      break;
    }
  }

  return { tasks: updatedTasks, stations: updatedStations, assistants: updatedAssistants };
};
