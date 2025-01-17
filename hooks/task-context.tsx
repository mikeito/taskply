"use client"

import { Task } from "@/app/dashboard/tasks/data/schema";
import { createContext, useContext, useState, ReactNode } from "react";

interface TaskContextType {
  task: Task | null;
  setTask: (task: Task | null) => void;
  clearTask: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [task, setTask] = useState<Task | null>(null);

  const clearTask = () => setTask(null);

  return (
    <TaskContext.Provider value={{ task, setTask, clearTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
