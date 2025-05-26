"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Todo } from "@/app/interfaces";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Header from "@/components/Header";

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;

export default function TodoDetail() {
  const { itemId } = useParams();
  const router = useRouter();

  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editedName, setEditedName] = useState("");
  const [editedMemo, setEditedMemo] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodoDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          `https://assignment-todolist-api.vercel.app/api/${TENANT_ID}/items/${itemId}`
        );
        setTodo(data);
        setEditedName(data.name);
        setEditedMemo(data.memo);
      } catch (err) {
        console.error("Error fetching todo detail:", err);
        let errorMessage = "Todo 정보를 불러오는데 실패했습니다.";

        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<{ message?: string }>;
          errorMessage =
            axiosError.response?.data?.message ||
            axiosError.message ||
            errorMessage;
          if (axiosError.response?.status === 404) {
            errorMessage = "해당 Todo 항목을 찾을 수 없습니다.";
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (itemId) {
      fetchTodoDetail();
    } else {
      setIsLoading(false);
      setError("잘못된 접근입니다. 아이템 ID가 없습니다.");
    }
  }, [itemId]);
  // 업데이트 함수
  const handleUpdate = async () => {
    if (!todo) return;
    try {
      await axios.patch(
        `https://assignment-todolist-api.vercel.app/api/${TENANT_ID}/items/${todo.id}`,
        {
          name: editedName,
          memo: editedMemo ?? "",
          isCompleted: todo.isCompleted,
        }
      );
      alert("수정 완료");
      router.refresh();
      router.push("/");
    } catch (err) {
      alert(`수정 실패 : ${err}`);
    }
  };
  // 삭제 함수
  const handleDelete = async () => {
    if (!todo) return;
    if (!confirm(`'${todo.name}'을(를) 삭제하시겠습니까?`)) return;

    try {
      await axios.delete(
        `https://assignment-todolist-api.vercel.app/api/${TENANT_ID}/items/${todo.id}`
      );
      alert("삭제 완료");
      router.push("/");
    } catch (err) {
      alert(`삭제 실패 : ${err}`);
    }
  };
  // 이미지 추가 함수
  const handleAddImage = () => {
    // 이미지 추가 로직 구현
    alert("이미지 추가 기능은 아직 구현되지 않았습니다.");
  };
  // 할 일 토글 함수
  const handleToggleTodo = async () => {
    if (!todo) return;

    const previousTodo = { ...todo };
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };

    // 낙관적 업데이트
    setTodo(updatedTodo);

    try {
      await axios.patch(
        `https://assignment-todolist-api.vercel.app/api/${TENANT_ID}/items/${todo.id}`,
        { isCompleted: updatedTodo.isCompleted }
      );
    } catch (err) {
      setTodo(previousTodo);

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

  if (isLoading) return <p className="text-center mt-10">로딩 중...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">에러: {error}</p>;
  if (!todo)
    return <p className="text-center mt-10">Todo를 찾을 수 없습니다.</p>;

  return (
    <div>
      <Header />
      <main className="relative w-[1200px] h-[1020px] mx-auto bg-white shadow-lg rounded-md flex flex-col gap-[56px] pt-[40px] pl-[102px] pr-[102px]">
        <div
          className={`w-[996px] h-[64px] rounded-[24px] border-2 border-slate-900 ${
            todo.isCompleted ? "bg-violet-100" : "bg-white"
          } px-4 flex items-center justify-center gap-4`}
        >
          <div className="flex items-center justify-center gap-4 w-full ">
            <Image
              src={
                todo.isCompleted
                  ? "/todo-done-check.png"
                  : "/todo-default-check.png"
              }
              alt="체크 상태"
              className="cursor-pointer"
              width={32}
              height={32}
              onClick={handleToggleTodo}
            />
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-auto font-[NanumSquare] font-bold text-[20px] leading-[100%] tracking-[0%] underline decoration-solid decoration-1 bg-transparent outline-none"
              placeholder="할 일 제목"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* 이미지 첨부 */}
          <div className="relative w-[384px] h-[311px] rounded-[24px] bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center">
            <Image
              src="/img.png"
              alt="첨부 이미지"
              width={64}
              height={64}
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="absolute bottom-4 right-4 w-[64px] h-[64px] bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-transform duration-200"
            >
              <img
                src="/Type=Plus.png"
                alt="추가 버튼"
                className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-200"
              />
            </button>
          </div>

          {/* 메모 */}
          <div className="w-[588px] h-[311px] bg-[url('/memo.png')] bg-cover border rounded-[24px] p-4 relative">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 font-[NanumSquare] font-extrabold text-[16px] leading-[100%] text-amber-800 select-none pointer-events-none">
              memo
            </div>
            <textarea
              value={editedMemo ?? ""}
              onChange={(e) => setEditedMemo(e.target.value)}
              className="w-full h-full bg-transparent resize-none text-slate-800 outline-none pt-8"
              placeholder="할 일 내용을 입력하세요"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-4">
          <button onClick={handleUpdate} className="focus:outline-none p-0">
            <img
              src="/Edit-Large-Default-Btn.png"
              alt="수정 완료"
              className="cursor-pointer w-[168px] h-[56px]"
            />
          </button>
          <button onClick={handleDelete} className="focus:outline-none p-0">
            <img
              src="/Delete-Large-Btn.png"
              alt="삭제하기"
              className="cursor-pointer w-[168px] h-[56px]"
            />
          </button>
        </div>
      </main>
    </div>
  );
}
