import { useMutation, useQuery } from '@tanstack/react-query'
import { createTasks, getTasks, signin } from './endpoints'

// export const useGetTasks = queryOptions({
//   queryKey: ['tasks'],
//   queryFn: getTasks,
// })

// export const useLoginMutation = useMutation({
//   mutationFn: signin,
//   onSuccess: async () => {
//     console.log("I'm first!")
//   }
// })

// export const useGetTasks = () => ({
//   queryKey: ["tasks"],
//   queryFn: getTasks,
//   staleTime: 1000 * 60 * 5, // Optional
// });
export const useGetTasks = () => {
  return useQuery({
    queryKey: ['tasks'], // Query key
    queryFn: getTasks, // Fetching function
    staleTime: 1000 * 60 * 5, // Optional: Cache time (5 minutes)
  });
};

export const useSignin = () => {
  return useMutation({
    mutationFn: signin,
    onSuccess: () => {
      console.log("Signin successful!");
    },
    onError: (error) => {
      console.error("Signin failed:", error);
    },
  });
};

export const useCreateTask = () => {
  return useMutation({
    mutationFn: createTasks,
    onSuccess: () => {
      console.log("Task successfully created!");
    },
    onError: (error) => {
      console.error("task creation failed", error);
    },
  });
};