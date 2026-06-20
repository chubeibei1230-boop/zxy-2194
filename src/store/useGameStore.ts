import { create } from 'zustand';
import {
  GameState,
  ScoreResult,
  LevelConfig,
  Station,
  Assistant,
  Task,
  GameEvent,
} from '../types';
import { getLevelById } from '../data/levels';
import { ASSISTANT_NAMES } from '../data/constants';
import { generateId } from '../utils/helpers';
import { loadHighScores, saveHighScore } from '../utils/storage';
import { generateBatchTasks, isTaskBlocked } from '../systems/taskSystem';
import {
  shouldTriggerEvent,
  generateRandomEvent,
  applyEventEffect,
  revertEventEffect,
} from '../systems/eventSystem';
import { calculateScore, getImprovementSuggestion } from '../systems/scoringSystem';

interface GameStore {
  gameState: GameState;
  highScores: Record<number, ScoreResult>;
  lastScore: ScoreResult | null;
  lastEventTime: number;
  isNewHighScore: boolean;

  startGame: (levelId: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  completeGame: () => void;

  reorderTasks: (taskIds: string[]) => void;
  assignAssistant: (taskId: string, assistantId: string) => void;
  unassignAssistant: (taskId: string) => void;

  handleEvent: (eventId: string) => void;

  tick: (deltaTime: number) => void;

  calculateFinalScore: () => ScoreResult;
  getSuggestion: () => string;
}

const createInitialState = (level: LevelConfig): GameState => {
  const stations: Station[] = Array.from({ length: level.stations }, (_, i) => ({
    id: generateId(),
    number: i + 1,
    status: 'idle',
    cleanupProgress: 100,
  }));

  const assistants: Assistant[] = Array.from({ length: level.assistants }, (_, i) => ({
    id: generateId(),
    name: ASSISTANT_NAMES[i] || `助理${i + 1}`,
    status: 'idle',
    awayTimeRemaining: 0,
    totalIdleTime: 0,
    totalBusyTime: 0,
  }));

  const initialTasks = generateBatchTasks(1, stations.filter(s => s.status === 'needs-cleaning'), level.stations);

  return {
    currentLevel: level,
    gameStatus: 'playing',
    currentBatch: 1,
    totalBatches: level.batches,
    elapsedTime: 0,
    stations,
    assistants,
    taskQueue: initialTasks,
    activeEvents: [],
    eventLog: [],
    admissionTimes: [],
    totalStationsUsed: 0,
    totalStationsCleaned: 0,
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: {
    currentLevel: null,
    gameStatus: 'idle',
    currentBatch: 0,
    totalBatches: 0,
    elapsedTime: 0,
    stations: [],
    assistants: [],
    taskQueue: [],
    activeEvents: [],
    eventLog: [],
    admissionTimes: [],
    totalStationsUsed: 0,
    totalStationsCleaned: 0,
  },
  highScores: loadHighScores(),
  lastScore: null,
  lastEventTime: 0,
  isNewHighScore: false,

  startGame: (levelId: number) => {
    const level = getLevelById(levelId);
    if (!level) return;

    set({
      gameState: createInitialState(level),
      lastEventTime: 0,
      lastScore: null,
      isNewHighScore: false,
    });
  },

  pauseGame: () => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        gameStatus: 'paused',
      },
    }));
  },

  resumeGame: () => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        gameStatus: 'playing',
      },
    }));
  },

  restartGame: () => {
    const { gameState } = get();
    if (gameState.currentLevel) {
      get().startGame(gameState.currentLevel.id);
    }
  },

  completeGame: () => {
    const { gameState } = get();
    const score = calculateScore(gameState);
    const isNew = saveHighScore(gameState.currentLevel!.id, score);

    set((state) => ({
      gameState: {
        ...state.gameState,
        gameStatus: 'completed',
      },
      lastScore: score,
      isNewHighScore: isNew,
      highScores: loadHighScores(),
    }));
  },

  reorderTasks: (taskIds: string[]) => {
    set((state) => {
      const newQueue = taskIds
        .map((id) => state.gameState.taskQueue.find((t) => t.id === id))
        .filter((t): t is Task => t !== undefined);
      return {
        gameState: {
          ...state.gameState,
          taskQueue: newQueue,
        },
      };
    });
  },

  assignAssistant: (taskId: string, assistantId: string) => {
    set((state) => {
      const { taskQueue, assistants } = state.gameState;
      const taskIndex = taskQueue.findIndex((t) => t.id === taskId);
      const assistantIndex = assistants.findIndex((a) => a.id === assistantId);

      if (taskIndex === -1 || assistantIndex === -1) return state;

      const task = taskQueue[taskIndex];
      const assistant = assistants[assistantIndex];

      if (task.status !== 'pending' || assistant.status !== 'idle') return state;

      const newTasks = [...taskQueue];
      const newAssistants = [...assistants];

      newTasks[taskIndex] = {
        ...task,
        assignedAssistantId: assistantId,
        status: 'in-progress',
      };

      newAssistants[assistantIndex] = {
        ...assistant,
        status: 'busy',
        currentTaskId: taskId,
      };

      return {
        gameState: {
          ...state.gameState,
          taskQueue: newTasks,
          assistants: newAssistants,
        },
      };
    });
  },

  unassignAssistant: (taskId: string) => {
    set((state) => {
      const { taskQueue, assistants } = state.gameState;
      const taskIndex = taskQueue.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) return state;

      const task = taskQueue[taskIndex];
      const assistantId = task.assignedAssistantId;

      if (!assistantId) return state;

      const assistantIndex = assistants.findIndex((a) => a.id === assistantId);
      const newTasks = [...taskQueue];
      const newAssistants = [...assistants];

      newTasks[taskIndex] = {
        ...task,
        assignedAssistantId: undefined,
        status: 'pending',
      };

      if (assistantIndex !== -1) {
        newAssistants[assistantIndex] = {
          ...newAssistants[assistantIndex],
          status: 'idle',
          currentTaskId: undefined,
        };
      }

      return {
        gameState: {
          ...state.gameState,
          taskQueue: newTasks,
          assistants: newAssistants,
        },
      };
    });
  },

  handleEvent: (eventId: string) => {
    set((state) => {
      const { activeEvents, taskQueue, stations, assistants, eventLog, elapsedTime } =
        state.gameState;
      const eventIndex = activeEvents.findIndex((e) => e.id === eventId);

      if (eventIndex === -1) return state;

      const event = activeEvents[eventIndex];

      const { tasks, stations: newStations, assistants: newAssistants } = revertEventEffect(
        event,
        taskQueue,
        stations,
        assistants
      );

      const handledEvent = { ...event, handled: true };
      const newActiveEvents = activeEvents.filter((_, i) => i !== eventIndex);
      const newEventLog = [
        ...eventLog,
        { event: handledEvent, handled: true, time: elapsedTime },
      ];

      return {
        gameState: {
          ...state.gameState,
          taskQueue: tasks,
          stations: newStations,
          assistants: newAssistants,
          activeEvents: newActiveEvents,
          eventLog: newEventLog,
        },
      };
    });
  },

  tick: (deltaTime: number) => {
    set((state) => {
      const { gameState, lastEventTime } = state;
      if (gameState.gameStatus !== 'playing') return state;

      let {
        elapsedTime,
        taskQueue,
        stations,
        assistants,
        activeEvents,
        eventLog,
        admissionTimes,
        currentBatch,
        totalBatches,
        totalStationsUsed,
        totalStationsCleaned,
        currentLevel,
      } = gameState;

      elapsedTime += deltaTime;

      let newAssistants = assistants.map((a) => {
        if (a.status === 'away') {
          const newAwayTime = a.awayTimeRemaining - deltaTime;
          if (newAwayTime <= 0) {
            return { ...a, status: 'idle' as const, awayTimeRemaining: 0 };
          }
          return { ...a, awayTimeRemaining: newAwayTime };
        }
        if (a.status === 'idle') {
          return { ...a, totalIdleTime: a.totalIdleTime + deltaTime };
        }
        if (a.status === 'busy') {
          return { ...a, totalBusyTime: a.totalBusyTime + deltaTime };
        }
        return a;
      });

      let newTasks = [...taskQueue];
      let newStations = [...stations];
      let completedAdmission = false;

      for (let i = 0; i < newTasks.length; i++) {
        const task = newTasks[i];
        if (task.status !== 'in-progress') continue;

        const blocked = isTaskBlocked(task, newTasks);
        if (blocked) continue;

        const newRemaining = task.remainingTime - deltaTime;

        if (newRemaining <= 0) {
          newTasks[i] = { ...task, remainingTime: 0, status: 'completed' };

          const assistantIndex = newAssistants.findIndex(
            (a) => a.id === task.assignedAssistantId
          );
          if (assistantIndex !== -1) {
            newAssistants[assistantIndex] = {
              ...newAssistants[assistantIndex],
              status: 'idle',
              currentTaskId: undefined,
            };
          }

          if (task.type === 'cleanup' && task.stationId) {
            const stationIndex = newStations.findIndex((s) => s.id === task.stationId);
            if (stationIndex !== -1) {
              newStations[stationIndex] = {
                ...newStations[stationIndex],
                status: 'idle',
                cleanupProgress: 100,
              };
              totalStationsCleaned++;
            }
          }

          if (task.type === 'admission') {
            completedAdmission = true;
            admissionTimes = [
              ...admissionTimes,
              {
                planned: currentLevel ? (currentLevel.targetTime / totalBatches) * currentBatch : 0,
                actual: elapsedTime,
              },
            ];
          }
        } else {
          newTasks[i] = { ...task, remainingTime: newRemaining };

          if (task.type === 'cleanup' && task.stationId) {
            const stationIndex = newStations.findIndex((s) => s.id === task.stationId);
            if (stationIndex !== -1) {
              const progress =
                ((task.estimatedTime - newRemaining) / task.estimatedTime) * 100;
              newStations[stationIndex] = {
                ...newStations[stationIndex],
                status: 'cleaning',
                cleanupProgress: Math.min(100, progress),
              };
            }
          }
        }
      }

      if (completedAdmission) {
        const usedStations = newStations.filter((s) => s.status === 'idle' && s.cleanupProgress === 100);
        usedStations.forEach((s, idx) => {
          if (idx < Math.min(currentBatch, newStations.length)) {
            const stationIndex = newStations.findIndex((st) => st.id === s.id);
            if (stationIndex !== -1) {
              newStations[stationIndex] = {
                ...newStations[stationIndex],
                status: 'in-use',
                cleanupProgress: 0,
              };
              totalStationsUsed++;
            }
          }
        });

        if (currentBatch < totalBatches) {
          const stationsNeedingCleanup = newStations.filter((s) => s.status === 'in-use');
          stationsNeedingCleanup.forEach((s) => {
            const idx = newStations.findIndex((st) => st.id === s.id);
            if (idx !== -1) {
              newStations[idx] = { ...s, status: 'needs-cleaning' };
            }
          });

          currentBatch++;
          const newBatchTasks = generateBatchTasks(
            currentBatch,
            newStations.filter((s) => s.status === 'needs-cleaning'),
            newStations.length
          );
          newTasks = [...newTasks, ...newBatchTasks];
        }
      }

      const newActiveEvents = activeEvents
        .map((e) => ({ ...e, timeRemaining: e.timeRemaining - deltaTime }))
        .filter((e) => {
          if (e.timeRemaining <= 0) {
            eventLog = [...eventLog, { event: e, handled: false, time: elapsedTime }];
            return false;
          }
          return true;
        });

      if (
        currentLevel &&
        shouldTriggerEvent(currentLevel.eventFrequency, elapsedTime, lastEventTime)
      ) {
        const newEvent = generateRandomEvent(newTasks, newStations, newAssistants);
        if (newEvent) {
          const { tasks, stations, assistants: updatedAssistants } = applyEventEffect(
            newEvent,
            newTasks,
            newStations,
            newAssistants
          );
          newTasks = tasks;
          newStations = stations;
          newAssistants = updatedAssistants;
          newActiveEvents.push(newEvent);
          state.lastEventTime = elapsedTime;
        }
      }

      const allDone =
        currentBatch >= totalBatches &&
        newTasks.every((t) => t.status === 'completed');

      if (allDone) {
        const score = calculateScore({
          ...gameState,
          elapsedTime,
          stations: newStations,
          assistants: newAssistants,
          taskQueue: newTasks,
          eventLog,
          admissionTimes,
          totalStationsUsed,
          totalStationsCleaned,
          currentBatch,
        });
        const isNew = saveHighScore(currentLevel!.id, score);

        return {
          ...state,
          gameState: {
            ...gameState,
            gameStatus: 'completed',
            elapsedTime,
            stations: newStations,
            assistants: newAssistants,
            taskQueue: newTasks,
            activeEvents: newActiveEvents,
            eventLog,
            admissionTimes,
            totalStationsUsed,
            totalStationsCleaned,
            currentBatch,
          },
          lastScore: score,
          isNewHighScore: isNew,
          highScores: loadHighScores(),
          lastEventTime: state.lastEventTime,
        };
      }

      newTasks.sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        return a.priority - b.priority;
      });

      return {
        ...state,
        gameState: {
          ...gameState,
          elapsedTime,
          stations: newStations,
          assistants: newAssistants,
          taskQueue: newTasks,
          activeEvents: newActiveEvents,
          eventLog,
          admissionTimes,
          totalStationsUsed,
          totalStationsCleaned,
          currentBatch,
        },
        lastEventTime: state.lastEventTime,
      };
    });
  },

  calculateFinalScore: () => {
    const { gameState } = get();
    return calculateScore(gameState);
  },

  getSuggestion: () => {
    const { lastScore } = get();
    if (!lastScore) return '';
    return getImprovementSuggestion(lastScore);
  },
}));
