import { getQueryClient } from "@/app/get-query-client";
import { useGetTasks } from "@/src/api/queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TasksTable from "./_components/task-table";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { getTasks } from "@/src/api/endpoints";
import TasksBoard from "./_components/task-board";

export default async function Page() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  return (
    <div className="container mx-auto py-10">
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* <TasksTable /> */}
        <Tabs defaultValue="table" className="">
          <TabsList className="inline-flex h-10 items-center w-full justify-start rounded-lg p-1 text-muted-foreground border-none gap-4">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <TasksTable />
          </TabsContent>
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  View and update your tasks here. Mark tasks as completed or pending.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <TasksBoard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </HydrationBoundary>
    </div>
  );
}
