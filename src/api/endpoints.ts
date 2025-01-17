import axios from "axios";
import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next';
import { Task, TaskInsert } from "@/app/dashboard/tasks/data/schema";
import { tasks } from "@/app/dashboard/tasks/data/tasks";
import { LoginType } from "@/app/login/schema";

const BASE_URL = "http://localhost:3001";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTasks = async () => {
  const result = (await axiosInstance.get<[Task]>(`/tasks`)).data;
  console.log('request result::: ', result);
  return result
  // return tasks;
};

export const showTasks = async (id: number) => {
  return (await axiosInstance.get<Task>(`/tasks/${id}`)).data;
};

export const createTasks = async (data: TaskInsert) => {
  const token = getCookie("token"); // Retrieve the token from cookies
  if (!token) {
    throw new Error("User is not authenticated");
  }

  console.log('found Token::: ', token);

  await axiosInstance.post("/tasks", data, {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    },
  });
};

export const updateTask = async ({ id, data }: { id: number, data: TaskInsert }) => {
  const token = getCookie("token"); // Retrieve the token from cookies
  if (!token) {
    throw new Error("User is not authenticated");
  }
  await axiosInstance.patch(`/tasks/${id}`, { ...data }, {
    headers: {
      Authorization: `Bearer ${token}`, // Add token in Authorization header
    }
  });
};

// export const updateTaskStatus  = async (data: TaskInsert) => {
//   await axiosInstance.put(`/tasks/${data.Taskscode}`, data);
// };

export const updateTaskStatus = async ({ taskId, status }: { taskId: number, status: string }) => {
  const token = getCookie("token"); // Retrieve the token from cookies
  if (!token) {
    throw new Error("User is not authenticated");
  }
  console.log('found Token::: ', token);

  const response = await axiosInstance.patch(`/tasks/${taskId}`,
    {
      status: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Add token in Authorization header
      }
    }
  );
  return response.data;
};

export const deleteTasks = async (id: number) => {
  console.log('delete func id called ', id);

  await axiosInstance.delete(`/tasks/${id}`);
};

export const signin = async (data: LoginType) => {
  console.log('Calling signin axios');

  try {
    console.log('before http');
    const response = await axiosInstance.post("/auth/login", data);
    console.log('after http ', response);
    return response.data;
  } catch (error) {
    console.error("Signin error:", error);
    throw error; // Ensure errors are properly propagated to React Query
  }
};
