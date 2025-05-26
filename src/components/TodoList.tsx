import { Todo } from "@/app/interfaces";
import TodoItem from "./TodoItem";
import Image from "next/image";

interface TodoListProps {
  title: string;
  todos: Todo[];
  onToggleTodo: (id: number) => void;
}

export default function TodoList({ todos, onToggleTodo }: TodoListProps) {
  const todoTasks = todos.filter((todo) => !todo.isCompleted);
  const doneTasks = todos.filter((todo) => todo.isCompleted);

  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">할 일이 없습니다! 🎉</p>
    );
  }

  return (
    <div className="flex justify-center gap-8 w-full">
      <section className="w-[588px]">
        <h2 className="mb-4">
          <Image
            src="/todo.png"
            alt="할 일 아이콘"
            width={101}
            height={36}
            className="w-[101px] h-[36px] rounded-[23px]"
          />
        </h2>
        {todoTasks.length === 0 ? (
          <p className="text-gray-500">모든 할 일을 완료했어요! 👍</p>
        ) : (
          <ul className="space-y-3">
            {todoTasks.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggleTodo={onToggleTodo} />
            ))}
          </ul>
        )}
      </section>

      <section className="w-[588px]">
        <h2 className="mb-4">
          <Image
            src="/done.png"
            alt="완료 한 일 아이콘"
            width={101}
            height={36}
            className="w-[101px] h-[36px] rounded-[23px]"
          />
        </h2>
        {doneTasks.length === 0 ? (
          <p className="text-gray-500">아직 완료한 일이 없어요.</p>
        ) : (
          <ul className="space-y-3">
            {doneTasks.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggleTodo={onToggleTodo} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
