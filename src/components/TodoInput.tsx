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
      className="relative flex items-center gap-4 mt-12 w-full justify-center px-4 overflow-x-auto"
    >
      <div className="relative w-full max-w-[1016px] flex-shrink">
        <img
          src="/search.png"
          alt="할 일 입력창 배경"
          className="w-full h-[56px] object-cover rounded-md"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="할 일을 입력해주세요"
          className="absolute top-0 left-0 w-full h-[56px] px-6 py-2 text-lg bg-transparent text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        />
      </div>

      <div className="relative flex-shrink-0">
        {/* 데스크탑 */}
        <img
          src="/add-large-btn.png"
          alt="추가 버튼 배경"
          className="hidden sm:block w-[168px] h-[56px] object-cover"
        />

        {/* 모바일 */}
        <img
          src="/add-small-btn.png"
          alt="추가 버튼 배경 (작은화면)"
          className="block sm:hidden w-[56px] h-[56px] object-cover"
        />

        <button
          type="submit"
          className="absolute top-0 left-0 w-full h-full bg-transparent cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="할 일 추가"
        />
      </div>
    </form>
  );
}
