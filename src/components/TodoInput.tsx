"use client";

import { useState } from "react";

export default function TodoInput() {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    console.log("할 일 추가:", inputValue);
    setInputValue("");
  };

  return (
    <div className="relative flex justify-center items-center gap-4 mt-12">
      <div className="relative">
        <img src="/search.png" alt="할 일 입력창" width={1016} height={56} />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="할 일을 입력해주세요"
          className="absolute top-0 left-0 w-[1016px] h-[56px] px-4 bg-transparent text-slate-900 placeholder-slate-500 outline-none"
        />
      </div>

      <div className="relative">
        <img src="/add-large-btn.png" alt="추가 버튼" width={168} height={56} />
        <button
          onClick={handleAdd}
          className="absolute top-0 left-0 w-[168px] h-[56px] bg-transparent cursor-pointer"
          aria-label="할 일 추가"
        />
      </div>
    </div>
  );
}
