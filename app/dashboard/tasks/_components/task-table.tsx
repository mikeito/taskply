"use client";

import { DataTable } from "@/components/ui/datatable/data-table";
import { tableAddBtn } from "@/components/utils/ui-utils";
import { useGetTasks } from "@/src/api/queries";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { deleteTasks, getTasks } from "@/src/api/endpoints";
import { columns } from "./columns";
import { useCallback, useMemo } from "react";
import { Task } from "../data/schema";
import { useRouter } from "next/navigation";
import { useTask } from "@/hooks/task-context";

export default function TasksTable() {
  // const { data } = useSuspenseQuery(useGetTasks);
  const router = useRouter();
  const { task, setTask, clearTask } = useTask();
  const { data } = useQuery({ 
    queryKey: ['tasks'], 
    queryFn: getTasks 
  })
  // Ensure data is always an array, even if it's undefined
  const tasks = data || [];

  const queryClient = useQueryClient();
  // const { toast } = useToast();

  // const deleteMutation = useMutation({
  //   mutationFn: deleteTasks,
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries({ queryKey: queryKeys.fetchBankAccounts.all });
  //   },
  // });

  const deleteMutation = useMutation({
    mutationFn: deleteTasks,
    onSuccess: async (data) => {
      console.log('success deleting');
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      // router.push("/dashboard/tasks");
    },
    onError: (error) => {
      console.error("Request failed:", error);
    },
  });

  const onDelete = useCallback((task: Task) => {
    console.log('Deleting item: ', task.id);
    
    deleteMutation.mutate(task.id, {
      onSuccess: () => {
        console.log('Task was deleted successfully');
        
        // toast({ description: 'Task was deleted successfully.' });
      },
      onError: () => {
        console.error('Uh Oh! Something went wrong!');
        
        // toast({
        //   variant: 'destructive',
        //   title: 'Uh Oh! Something went wrong!',
        //   description: 'There was a problem with your request.',
        // });
      },
    });
  }, []);

  const onEdit = useCallback((task: Task) => {
    // setSelectedBankAccount(bankAccount);
    // setIsDialogOpen(true);
    console.log('Editing: ', task);
    setTask(task)

  // Navigate to the create page and pass the task as query parameters
  
  router.push("/dashboard/tasks/add");
    
  }, []);
  
  const taskColumns = useMemo(() => columns({ onEdit, onDelete }), []);
  return (
    // <DataTable columns={columns} data={clients} searchColumn="name" searchPlaceholder='search client' createBtn={tableAddBtn('clients/add')}/>
    <DataTable
      columns={taskColumns}
      data={tasks}
      searchColumn="title"
      searchPlaceholder="search task"
      createBtn={tableAddBtn("tasks/add")}
    />
  );
}
