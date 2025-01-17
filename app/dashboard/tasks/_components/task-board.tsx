"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTasks, updateTaskStatus } from "@/src/api/endpoints";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";
import { Button } from "@/components/ui/button"; // Assuming you have Button component
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have Checkbox component
import { Task } from "../data/schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getQueryClient } from "@/app/get-query-client";

const statusOptions = ["TODO", "PENDING", "INREVIEW", "COMPLETED"]; // The four drop zones

export default function TasksBoard() {
  const queryClient = getQueryClient();
  const { data } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });
  const tasks = data || [];

  const mutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      console.log("Task status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: (error) => {
      console.error("Error updating task status:", error);
    },
  });

  const handleStatusUpdate = (id: number, completed: boolean) => {
    const status = completed ? 'COMPLETED' : 'PENDING';
    mutation.mutate({ taskId: id, status })
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-4">
  <div className="space-y-2">
    {tasks.map((task) => (
      <div
        key={task.id}
        className="flex items-start justify-between gap-4 p-2 border rounded-md"
      >
        {/* Checkbox and Task Title */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={task.status === 'COMPLETED'}
            onCheckedChange={(checked) =>
              handleStatusUpdate(task.id, Boolean(checked))
            }
            className="w-4 h-4"
          />
          <span
            className={
              task.status === 'COMPLETED'
                ? 'line-through text-gray-500'
                : ''
            }
          >
            {task.title}
          </span>
        </div>

        {/* Accordion Trigger */}
        <Accordion type="single" collapsible>
          <AccordionItem value={task.title}>
            <AccordionTrigger className="text-sm text-blue-500">
              Details
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-gray-700">{task.description}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ))}
  </div>
</div>

    // <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-4">
    //   <Accordion type="multiple" className="space-y-2">
    //     {tasks.map((task) => (
    //       <AccordionItem key={task.id} value={task.title}>
    //         <AccordionTrigger>
    //           <div className="flex items-center gap-2">
    //             <Checkbox
    //               checked={task.status == 'COMPLETED'}
    //               onCheckedChange={(checked) => handleStatusUpdate(task.id, Boolean(checked))}
    //               className="w-4 h-4"
    //             />
    //             <span className={task.status == 'COMPLETED' ? "line-through text-gray-500" : ""}>
    //               {task.title}
    //             </span>
    //           </div>
    //         </AccordionTrigger>
    //         <AccordionContent>
    //           <p className="text-sm text-gray-700">{task.description}</p>
    //         </AccordionContent>
    //       </AccordionItem>
    //     ))}
    //   </Accordion>
    // </div>
  );
};
