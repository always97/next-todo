import { Todo } from "@/types/todo";
import apiClient from "./apiClient";

interface UpdateTodoPayload {
  name?: string;
  memo?: string;
  imageUrl?: string;
  isCompleted?: boolean;
}

export const todoService = {
  fetchTodos: async (): Promise<Todo[]> => {
    const response = await apiClient.get<Todo[]>("/items");
    return response.data;
  },
  addTodo: async (name: string): Promise<Todo> => {
    const response = await apiClient.post<Todo>("/items", { name });
    return response.data;
  },
  updateTodo: async (id: number, payload: UpdateTodoPayload): Promise<Todo> => {
    const response = await apiClient.patch<Todo>(`/items/${id}`, payload);
    return response.data;
  },
  deleteTodo: async (id: number): Promise<void> => {
    await apiClient.delete(`/items/${id}`);
  },

  // 상세페이지용 api
  fetchTodoById: async (id: string | number): Promise<Todo> => {
    const response = await apiClient.get<Todo>(`/items/${id}`);
    return response.data;
  },
  updateTodoDetail: async (
    id: number,
    payload: UpdateTodoPayload
  ): Promise<Todo> => {
    const response = await apiClient.patch<Todo>(`/items/${id}`, payload);
    return response.data;
  },
};
