"use client";

import { DataTable } from "@/components/ui/datatable/data-table";
import { tableAddBtn } from "@/components/utils/ui-utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTasks, getTasks } from "@/src/api/endpoints";
import { columns } from "./columns";
import { useCallback, useMemo } from "react";
import { Task } from "../data/schema";
import { useRouter } from "next/navigation";
import { useTask } from "@/hooks/task-context";

export default function TasksTable() {
  const router = useRouter();
  const { setTask } = useTask();

  // Fetch data using React Query
  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  // Ensure tasks is always an array
  const tasks = data || [];

  const queryClient = useQueryClient();

  // Mutation for deleting tasks
  const deleteMutation = useMutation({
    mutationFn: deleteTasks,
    onSuccess: async () => {
      console.log("Task deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Failed to delete task:", error);
    },
  });

  // Handlers for delete and edit actions
  const onDelete = useCallback((task: Task) => {
    deleteMutation.mutate(task.id, {
      onSuccess: () => console.log("Task was deleted successfully"),
      onError: () => console.error("Error deleting task"),
    });
  }, []);

  const onEdit = useCallback((task: Task) => {
    setTask(task);
    router.push("/dashboard/tasks/add");
  }, []);

  // Memoize columns for performance
  const taskColumns = useMemo(() => columns({ onEdit, onDelete }), []);

  // Render loader or data table
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">.</span>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      columns={taskColumns}
      data={tasks}
      searchColumn="title"
      searchPlaceholder="Search tasks"
      createBtn={tableAddBtn("tasks/add")}
    />
  );
}
