"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import Image from "next/image";
import Header from "@/components/Header";
import { Todo } from "@/types/todo";
import { todoService } from "@/services/todoService";
import { uploadImage } from "@/services/imageService";
import IconButton from "@/components/ui/IconButton";
import ImageButton from "@/components/ui/ImageButton";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import StatusDisplay from "@/components/ui/StatusDisplay";

const handleApiError = (err: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(err)) {
    const serverMessage = (err.response?.data as { message?: string })?.message;
    if (err.response?.status === 404) {
      return "해당 항목을 찾을 수 없습니다.";
    }
    return serverMessage || err.message || defaultMessage;
  } else if (err instanceof Error) {
    return err.message;
  }
  return defaultMessage;
};

export default function TodoDetail() {
  const params = useParams();
  const itemId = params?.itemId as string;
  const router = useRouter();

  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editedName, setEditedName] = useState("");
  const [editedMemo, setEditedMemo] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) {
      setError("잘못된 접근입니다. 아이템 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    const fetchTodoDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTodo = await todoService.fetchTodoById(itemId);
        setTodo(fetchedTodo);
        setEditedName(fetchedTodo.name);
        setEditedMemo(fetchedTodo.memo ?? "");
        setEditedImageUrl(fetchedTodo.imageUrl ?? null);
      } catch (err) {
        setError(handleApiError(err, "Todo 정보를 불러오는데 실패했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodoDetail();
  }, [itemId]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleMemoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditedMemo(e.target.value);
  };

  // 업데이트 함수
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!todo || isUpdating || isToggling || isDeleting) return;

    setIsUpdating(true);
    setError(null);
    try {
      const trimmedMemo = (editedMemo ?? "").trim();
      const payload = {
        name: editedName.trim(),
        memo: trimmedMemo === "" ? undefined : trimmedMemo,
        isCompleted: todo.isCompleted,
        imageUrl: editedImageUrl === null ? undefined : editedImageUrl,
      };
      const updatedTodo = await todoService.updateTodoDetail(todo.id, payload);
      setTodo((prevTodo) =>
        prevTodo ? { ...prevTodo, ...updatedTodo } : null
      );
      alert("수정 완료");
      router.push("/");
    } catch (err) {
      setError(handleApiError(err, "수정 중 에러가 발생했습니다."));
    } finally {
      setIsUpdating(false);
    }
  };
  // 삭제 함수
  const handleDelete = async () => {
    if (!todo || isDeleting || isToggling || isUpdating) return;
    if (!confirm(`'${todo.name}' 항목을 삭제하시겠습니까?`)) return;

    setIsDeleting(true);
    setError(null);
    try {
      await todoService.deleteTodo(todo.id);
      alert("삭제 완료");
      router.push("/");
    } catch (err) {
      setError(handleApiError(err, "삭제 중 에러가 발생했습니다."));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!todo || isToggling || isUpdating || isDeleting) return; // 다른 작업 중이면 실행 방지

    setIsToggling(true);
    setError(null);

    const newCompletedState = !todo.isCompleted;

    try {
      setTodo((prevTodo) => {
        if (!prevTodo) return null;
        return { ...prevTodo, isCompleted: newCompletedState };
      });

      const updatedTodo = await todoService.updateTodoDetail(todo.id, {
        isCompleted: newCompletedState,
      });

      setTodo((prevTodo) =>
        prevTodo ? { ...prevTodo, ...updatedTodo } : null
      );
    } catch (err) {
      setTodo((prevTodo) => {
        if (!prevTodo) return null;
        return { ...prevTodo, isCompleted: !newCompletedState }; // 원래 상태로 복구
      });
      setError(handleApiError(err, "상태 업데이트 중 에러가 발생했습니다."));
    } finally {
      setIsToggling(false);
    }
  };

  const handleAddImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadedUrl = await uploadImage(file);
      setEditedImageUrl(uploadedUrl);
    } catch (err) {
      setError(handleApiError(err, "이미지 업로드 중 문제가 발생했습니다."));
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading)
    return (
      <p className="text-center mt-10">
        <StatusDisplay
          isLoading={isLoading}
          loadingText={"상세정보를 가져오는중입니다.."}
        />
      </p>
    );
  if (error)
    return <p className="text-center mt-10 text-red-500">에러: {error}</p>;
  if (!todo)
    return <p className="text-center mt-10">Todo를 찾을 수 없습니다.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto bg-white">
        <form
          onSubmit={handleUpdate}
          className="rounded-lg py-4 sm:py-6 md:py-8 px-6 sm:px-8 md:px-24 space-y-6 md:space-y-8"
        >
          {/* 제목 영역 */}
          <div
            className={`w-full max-w-full h-16 rounded-[24px] border-2 border-slate-900 ${
              todo.isCompleted ? "bg-violet-100" : "bg-white"
            } px-4 flex items-center justify-center mx-auto`}
          >
            <div className="inline-flex items-center gap-1">
              <IconButton
                src={
                  todo.isCompleted
                    ? "/todo-done-check.png"
                    : "/todo-default-check.png"
                }
                alt={todo.isCompleted ? "완료됨" : "미완료"}
                onClick={handleToggleComplete}
                disabled={isToggling || isUpdating || isDeleting}
                aria-label={todo.isCompleted ? "미완료로 변경" : "완료로 변경"}
                className={`flex-shrink-0 transition-opacity ${
                  isToggling || isUpdating || isDeleting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
                size={32}
              />
              <input
                type="text"
                value={editedName}
                onChange={handleNameChange}
                className="font-title bg-transparent"
                placeholder="할 일 제목"
                disabled={isUpdating || isDeleting || isToggling}
                size={10}
              />
            </div>
          </div>
          {/* 이미지 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center">
              {editedImageUrl || todo.imageUrl ? (
                // 업로드된 이미지
                <div className="relative w-3/4 h-3/4">
                  <Image
                    src={editedImageUrl ?? todo.imageUrl!}
                    alt="첨부 이미지"
                    fill
                    sizes="100%"
                    className="object-contain rounded-xl"
                  />
                </div>
              ) : (
                // 기본 이미지
                <Image
                  src="/img.png"
                  alt="기본 이미지"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              )}

              {/* 업로딩 표시 */}
              {isUploading && (
                <LoadingOverlay
                  show={isUploading}
                  message="이미지 업로드 중..."
                  size={40}
                />
              )}

              <input
                type="file"
                accept="image/*"
                id="fileInput"
                className="hidden"
                onChange={handleAddImage}
              />
              <ImageButton
                src="/Type=Plus.png"
                alt="추가 버튼"
                onClick={() => document.getElementById("fileInput")?.click()}
                className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-transform duration-200"
              />
            </div>

            {/* 메모 */}
            <div className="w-full aspect-[4/3] bg-[url('/memo.png')] bg-cover border rounded-2xl p-4 relative">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 font-[NanumSquare] font-extrabold text-sm text-amber-800 select-none pointer-events-none">
                memo
              </div>
              <textarea
                value={editedMemo ?? ""}
                onChange={handleMemoChange}
                className="font-body w-full h-full bg-transparent resize-none outline-none pt-8"
                placeholder="할 일 내용을 입력하세요"
              />
            </div>
          </div>
          {error && !isLoading && !isToggling && !isUpdating && !isDeleting && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          {/* 버튼 영역 */}
          <div className="flex justify-center md:justify-end gap-4 flex-wrap">
            <ImageButton
              src={
                editedName.trim() !== todo.name ||
                (editedMemo ?? "") !== (todo.memo ?? "") ||
                (editedImageUrl ?? "") !== (todo.imageUrl ?? "")
                  ? "/Edit-Large-Active-Btn.png"
                  : "/Edit-Large-Default-Btn.png"
              }
              alt="수정 완료"
              onClick={handleUpdate}
              className="w-40 h-14"
            />

            <ImageButton
              src="/Delete-Large-Btn.png"
              alt="삭제하기"
              onClick={handleDelete}
              className="w-40 h-14"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
