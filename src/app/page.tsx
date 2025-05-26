"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";
import { Todo } from "@/app/interfaces";

// 추후 환경변수로 관리
const TENANT_ID = "always";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTodo = async (name: string) => {
    if (name.trim() === "") return;

    setIsLoading(true);

    const newTodoRequest = { name };

    try {
      // 추후 인스턴스로 관리
      const response = await axios.post<Todo>(
        `https://assignment-todolist-api.vercel.app/api/${TENANT_ID}/items`,
        newTodoRequest
      );

      const addedTodo: Todo = response.data;
      setTodos((prevTodos) => [...prevTodos, addedTodo]);
    } catch (err) {
      console.error("Error adding todo:", err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Failed to add item."
        );
      } else {
        setError("An unexpected error occurred while adding the item.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (id: number) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) return;

    const updatedTodo = {
      ...todoToUpdate,
      isCompleted: !todoToUpdate.isCompleted,
    };

    // UI 먼저
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );

    try {
      await axios.patch<Todo>(
        `https://assignment-todolist-api.vercel.app/api/${TENANT_ID}/items/${id}`,
        { isCompleted: updatedTodo.isCompleted }
      );
    } catch (err) {
      console.error("Error updating todo on server:", err);
      // 에러 발생 시 롤백
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? todoToUpdate : todo))
      );
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Failed to update item."
        );
      } else {
        setError("An unexpected error occurred while updating the item.");
      }
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://assignment-todolist-api.vercel.app/api/${TENANT_ID}/items`
        );
        setTodos(response.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<{ message?: string }>;
          setError(
            axiosError.response?.data?.message ||
              axiosError.message ||
              "Failed to load todos."
          );
        } else {
          setError("An unexpected error occurred while fetching todos.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center">
        <TodoInput onAddTodo={handleAddTodo} />
        {/* 로딩 에러 표시 (임시) */}
        {isLoading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
        <div className="mt-6 w-full flex justify-center gap-8">
          <TodoList
            title="TODO"
            todos={todos}
            onToggleTodo={handleToggleTodo}
          />
        </div>
      </main>
    </div>
  );
}
