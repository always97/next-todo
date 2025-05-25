import TodoItem from "./TodoItem";

interface TodoListProps {
  title: string;
}

export default function TodoList({ title }: TodoListProps) {
  return (
    <div className="w-[588px]">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <ul className="space-y-4">
        <TodoItem />
      </ul>
    </div>
  );
}
