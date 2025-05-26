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
      className="relative flex justify-center items-center gap-4 mt-12"
    >
      <div className="relative">
        <img
          src="/search.png"
          alt="할 일 입력창 배경"
          width={1016}
          height={56}
          className="block"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="할 일을 입력해주세요"
          className="absolute top-0 left-0 w-[1016px] h-[56px] px-6 py-2 text-lg bg-transparent text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        />
      </div>

      {/* 추가 버튼 부분 */}
      <div className="relative">
        <img
          src="/add-large-btn.png"
          alt="추가 버튼 배경"
          width={168}
          height={56}
          className="block"
        />
        <button
          type="submit"
          className="absolute top-0 left-0 w-full h-full bg-transparent cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" // w-[168px] h-[56px] 대신 w-full h-full 사용
          aria-label="할 일 추가"
        />
      </div>
    </form>
  );
}
