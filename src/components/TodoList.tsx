import { Todo } from "@/types/todo";
import TaskListSection from "./todo/TaskListSection";

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
}

export default function TodoList({ todos, onToggleTodo }: TodoListProps) {
  const todoTasks = todos.filter((todo) => !todo.isCompleted);
  const doneTasks = todos.filter((todo) => todo.isCompleted);

  return (
    <div className="mt-6 flex flex-col md:flex-row md:justify-between md:gap-8 w-full">
      <TaskListSection
        titleImageSrc="/todo.png"
        titleImageAlt="할 일 아이콘"
        tasks={todoTasks}
        emptyStateContent={{
          imageSrc: "/empty-Todo-Large.png",
          imageAlt: "비어 있음 안내 이미지",
          title: "할 일이 없어요.",
          description: "TODO를 새롭게 추가해주세요!",
        }}
        onToggleTodo={onToggleTodo}
      />
      <TaskListSection
        titleImageSrc="/done.png"
        titleImageAlt="완료 한 일 아이콘"
        tasks={doneTasks}
        emptyStateContent={{
          imageSrc: "/empty-Done-Large.png",
          imageAlt: "비어 있음 안내 이미지",
          title: "아직 다 한 일이 없어요.",
          description: "해야 할 일을 체크해보세요!",
        }}
        onToggleTodo={onToggleTodo}
      />
    </div>
  );
}
