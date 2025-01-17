"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { inserttaskSchema, TaskInsert } from "@/app/dashboard/tasks/data/schema";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { createTasks, updateTask } from "@/src/api/endpoints";
import { useRouter } from "next/navigation";
import { getQueryClient } from "@/app/get-query-client";
import { useTask } from "@/hooks/task-context";
import { useEffect } from "react";

const TaskForm = () => {
  const router = useRouter();
  const queryClient = getQueryClient();
  const { task, setTask, clearTask } = useTask();

  // Cleanup logic: clear task when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearTask(); // Call clearTask when navigation occurs
    };

    // Listen for beforeunload or popstate events (navigation-related)
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBeforeUnload);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBeforeUnload);
    };
  }, [clearTask]);
  
  const createMutation = useMutation({
    mutationFn: createTasks,
    onSuccess: async (data) => {
      console.log('success');
      clearTask();
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      router.push("/dashboard/tasks");
    },
    onError: (error) => {
      console.error("Request failed:", error);
    },
  });

  // Mutation for updating a task
  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: async () => {
      console.log("Task updated successfully");
      clearTask();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      router.push("/dashboard/tasks");
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });

  function onSubmit(values: TaskInsert) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // mutation.mutate(values)
    task?.id 
      ? updateMutation.mutate({ id: task.id, data: values })
      : createMutation.mutate(values); 
  }

  const taskForm = useForm<z.infer<typeof inserttaskSchema>>({
    resolver: zodResolver(inserttaskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: (task?.status as "TODO" | "PENDING" | "INREVIEW" | "COMPLETED") || "TODO",
      priority: (task?.priority as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM",
      deadline: task?.deadline ? new Date(task.deadline) : new Date(),
    },
  });
  return (
    <>
      <Form {...taskForm}>
        <form
          onSubmit={taskForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>
                Update the details of your task here. Click save when you're finished.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <FormField
                  control={taskForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="title please" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={taskForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TODO">TODO</SelectItem>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                          <SelectItem value="INREVIEW">INREVIEW</SelectItem>
                          <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-1">
                <FormField
                  control={taskForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LOW">LOW</SelectItem>
                          <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                          <SelectItem value="HIGH">HIGH</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={taskForm.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() ||
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={taskForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your description here."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your description will permit us to understand the point better.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};

export default TaskForm;
