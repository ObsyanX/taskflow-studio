import { Task } from '@/types/task';

export const sampleTasks: Task[] = [
  {
    id: "t-1",
    title: "Finish React To-Do UI",
    desc: "Add animations, hover effects, and theme",
    due: "2025-12-10",
    priority: "High",
    done: false,
    createdAt: "2025-12-01T10:00:00Z",
    reminder: "15min",
    recurrence: "none",
    categoryId: "work"
  },
  {
    id: "t-2",
    title: "Refactor useTasks hook",
    desc: "Extract localStorage layer",
    due: "2025-12-02",
    priority: "Medium",
    done: true,
    createdAt: "2025-12-01T09:00:00Z",
    reminder: "none",
    recurrence: "none",
    categoryId: "work"
  },
  {
    id: "t-3",
    title: "Implement inline edit",
    desc: "",
    due: null,
    priority: "Low",
    done: false,
    createdAt: "2025-12-01T08:00:00Z",
    reminder: "none",
    recurrence: "none"
  },
  {
    id: "t-4",
    title: "Add keyboard shortcuts",
    desc: "n for new, / for search",
    due: null,
    priority: "Low",
    done: false,
    createdAt: "2025-12-01T07:00:00Z",
    reminder: "none",
    recurrence: "none",
    categoryId: "personal"
  },
  {
    id: "t-5",
    title: "Write README & demo GIF",
    desc: "",
    due: "2025-12-05",
    priority: "Medium",
    done: false,
    createdAt: "2025-12-01T06:00:00Z",
    reminder: "1hour",
    recurrence: "none",
    categoryId: "work"
  },
  {
    id: "t-6",
    title: "Accessibility pass",
    desc: "Run axe and fix issues",
    due: "2025-12-07",
    priority: "High",
    done: false,
    createdAt: "2025-12-01T05:00:00Z",
    reminder: "30min",
    recurrence: "weekly",
    categoryId: "health"
  }
];
