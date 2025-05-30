"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Todo } from "@/types/todo";
import { todoService } from "@/services/todoService";
import StatusDisplay from "@/components/ui/StatusDisplay";

import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiError = (err: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(err)) {
      const serverMessage = (err.response?.data as { message?: string })
        ?.message;
      setError(serverMessage || err.message || defaultMessage);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError(defaultMessage);
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTodos = await todoService.fetchTodos();
        setTodos(fetchedTodos);
      } catch (err) {
        handleApiError(err, "할 일 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleAddTodo = async (name: string) => {
    if (name.trim() === "") {
      setError("할 일 내용을 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const addedTodo = await todoService.addTodo(name);
      setTodos((prevTodos) => [...prevTodos, addedTodo]);
    } catch (err) {
      handleApiError(err, "할 일을 추가하는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (id: number) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) return;

    // 낙관적 업데이트
    const updatedTodo = {
      ...todoToUpdate,
      isCompleted: !todoToUpdate.isCompleted,
    };
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
    setError(null);

    try {
      await todoService.updateTodo(id, {
        isCompleted: updatedTodo.isCompleted,
      });
    } catch (err) {
      handleApiError(
        err,
        `할 일 (ID: ${id}) 상태를 업데이트하는데 실패했습니다.`
      );
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? todoToUpdate : todo))
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center pb-6 sm:pb-12">
      <Header />
      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 lg:px-12">
        <TodoInput onAddTodo={handleAddTodo} />
        <StatusDisplay
          isLoading={isLoading}
          loadingText={"할 일 목록을 로딩 중입니다.."}
          error={error}
        />
        {!isLoading && !error && (
          <div className="mt-6 w-full">
            <TodoList todos={todos} onToggleTodo={handleToggleTodo} />
          </div>
        )}
      </main>
    </div>
  );
}
