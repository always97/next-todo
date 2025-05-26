import { Todo } from "@/app/interfaces";
import TodoItem from "./TodoItem";
import Image from "next/image";

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
}

export default function TodoList({ todos, onToggleTodo }: TodoListProps) {
  const todoTasks = todos.filter((todo) => !todo.isCompleted);
  const doneTasks = todos.filter((todo) => todo.isCompleted);

  return (
    <div className="flex flex-col md:flex-row justify-center gap-8 w-full flex-wrap">
      <section className="w-full max-w-[588px] flex-1 min-w-[300px]">
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
          <div className="flex flex-col items-center justify-center mt-8 space-y-2">
            <Image
              src="/empty-Todo-Large.png"
              alt="비어 있음 안내 이미지"
              width={240}
              height={240}
              className="object-contain"
            />
            <p className="text-[16px] font-bold text-center leading-[100%] text-slate-400 font-nanum">
              할 일이 없어요.
            </p>
            <p className="text-[16px] font-bold text-center leading-[100%] text-slate-400 font-nanum">
              TODO를 새롭게 추가해주세요!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {todoTasks.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggleTodo={onToggleTodo} />
            ))}
          </ul>
        )}
      </section>

      <section className="w-full max-w-[588px] flex-1 min-w-[300px]">
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
          <div className="flex flex-col items-center justify-center mt-8 space-y-2">
            <Image
              src="/empty-Done-Large.png"
              alt="비어 있음 안내 이미지"
              width={240}
              height={240}
              className="object-contain"
            />
            <p className="text-[16px] font-bold text-center leading-[100%] text-slate-400 font-nanum">
              아직 다 한 일이 없어요.
            </p>
            <p className="text-[16px] font-bold text-center leading-[100%] text-slate-400 font-nanum">
              해야 할 일을 체크해보세요!
            </p>
          </div>
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
