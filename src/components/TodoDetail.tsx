"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Todo } from "@/app/interfaces";
import axios, { AxiosError } from "axios";
import Header from "./Header";
import Image from "next/image";

const TENANT_ID = "always";

export default function TodoDetail() {
  const { itemId } = useParams();
  const router = useRouter();

  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const [isEditing, setIsEditing] = useState(false);
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

  const handleUpdate = async () => {
    if (!todo) return;
    try {
      await axios.put(`/api/${TENANT_ID}/items/${todo.id}`, {
        name: editedName,
        memo: editedMemo,
        isCompleted: todo.isCompleted,
      });
      alert("수정 완료");
      router.refresh();
    } catch (err) {
      alert(`수정 실패 : ${err}`);
    }
  };

  const handleDelete = async () => {
    if (!todo) return;
    if (!confirm(`'${todo.name}'을(를) 삭제하시겠습니까?`)) return;

    try {
      await axios.delete(`/api/${TENANT_ID}/items/${todo.id}`);
      alert("삭제 완료");
      router.push("/");
    } catch (err) {
      alert(`삭제 실패 : ${err}`);
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
      <main className="relative w-[1200px] h-[1020px] mx-auto bg-white mt-[60px] shadow-lg rounded-md">
        {/* 제목 영역 */}
        <div className="absolute top-[84px] left-[102px] w-[996px] h-[64px] bg-gray-50 p-4 rounded shadow flex items-center">
          <Image
            src={
              todo.isCompleted
                ? "/todo-completed-check.png"
                : "/todo-default-check.png"
            }
            alt="체크 상태"
            width={32}
            height={32}
            className="mr-4"
          />
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="text-2xl font-semibold text-slate-400 bg-transparent w-full outline-none"
            placeholder="할 일 제목"
          />
        </div>

        {/* 이미지 / 내용 작성 영역 */}
        <div className="absolute top-[200px] left-[102px] flex gap-6">
          {/* 이미지 영역 */}
          <div className="w-[384px] h-[311px] bg-gray-100 border rounded flex items-center justify-center">
            <Image
              src="/todo-example-img.png" // 실제 이미지 파일로 교체
              alt="첨부 이미지"
              width={384}
              height={311}
              className="object-cover"
            />
          </div>

          {/* 내용 작성 영역 */}
          <div className="w-[588px] h-[311px] bg-[url('/bg-textarea.png')] bg-cover border rounded p-4">
            <textarea
              value={editedMemo ?? ""}
              onChange={(e) => setEditedMemo(e.target.value)}
              className="w-full h-full bg-transparent resize-none text-slate-400 outline-none"
              placeholder="할 일 내용을 입력하세요"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            수정 완료
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            삭제하기
          </button>
        </div>
      </main>
    </div>
  );
}
