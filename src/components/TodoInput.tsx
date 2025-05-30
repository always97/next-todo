"use client";

import { useState, FormEvent } from "react";

interface TodoInputProps {
  onAddTodo: (name: string) => void;
}

export default function TodoInput({ onAddTodo }: TodoInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 sm:gap-4 mt-12 w-full"
    >
      <div className="relative flex-grow max-w-[1016px]">
        <img
          src="/search.png"
          alt="할 일 입력창 배경"
          className="absolute inset-0 w-full h-full object-fill rounded-md pointer-events-none"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="할 일을 입력해주세요"
          className="relative w-full h-[56px] px-6 py-2 text-lg bg-transparent text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        />
      </div>

      <div className="relative flex-shrink-0 w-[56px] sm:w-[168px] h-[56px]">
        <img
          src="/add-large-btn.png"
          alt=""
          aria-hidden="true"
          className="hidden sm:block absolute inset-0 w-full h-full object-contain"
        />
        <img
          src="/add-small-btn.png"
          alt=""
          aria-hidden="true"
          className="block sm:hidden absolute inset-0 w-full h-full object-contain"
        />
        <button
          type="submit"
          className="absolute inset-0 w-full h-full bg-transparent cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="할 일 추가"
        />
      </div>
    </form>
  );
}
