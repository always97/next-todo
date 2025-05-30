import { Todo } from "@/types/todo";
import Link from "next/link";
import IconButton from "./ui/IconButton";

interface TodoItemProps {
  todo: Todo;
  onToggleTodo: (id: number) => void;
}

export default function TodoItem({ todo, onToggleTodo }: TodoItemProps) {
  const checkboxImageSrc = todo.isCompleted
    ? "/todo-done-check.png"
    : "/todo-default-check.png";

  return (
    <li
      className={`w-full max-w-full md:max-w-[588px] h-[50px] px-6 py-2 border-2 border-slate-900 rounded-[27px] 
              flex items-center justify-between 
              ${todo.isCompleted ? "bg-violet-100" : "bg-white"}`}
    >
      <div className="flex items-center">
        <IconButton
          src={checkboxImageSrc}
          alt="할 일 체크 아이콘"
          onClick={() => onToggleTodo(todo.id)}
        />
        <Link
          href={`/items/${todo.id}`}
          className="flex-grow cursor-pointer group"
        >
          <span
            className={`ml-2 text-lg font-medium group-hover:text-blue-600 transition-colors
                        ${
                          todo.isCompleted
                            ? "text-gray-500 line-through group-hover:text-blue-400"
                            : "text-slate-900"
                        }`}
          >
            {todo.name}
          </span>
        </Link>
      </div>
    </li>
  );
}
