import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { getQueryClient } from "@/app/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { deleteTasks } from "@/src/api/endpoints";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit: (value: TData) => void;
  onDelete: (value: TData) => void;
}

const DataTableRowActions = <TData,>({ row, onEdit, onDelete }: DataTableRowActionsProps<TData>) => {
  // const task = row.original
  // const id: number = row.getValue("id")

  // const router = useRouter()
  // const queryClient = getQueryClient();

  // const mutation = useMutation({
  //   mutationFn: deleteTasks,
  //   onSuccess: async (data) => {
  //     console.log('success deleting');
  //     queryClient.invalidateQueries({ queryKey: ["tasks"] })
  //     // router.push("/dashboard/tasks");
  //   },
  //   onError: (error) => {
  //     console.error("Request failed:", error);
  //   },
  // });

  // // Function to handle logout
  // const handleDelete = (id: number) => {
  //   console.log('delete id: ', id);
    
  //   // mutation.mutate(values)

  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onEdit(row.original)}>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(row.original)}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DataTableRowActions;
