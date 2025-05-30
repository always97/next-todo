import Image from "next/image";
import TodoItem from "../TodoItem";
import { Todo } from "@/types/todo";

interface EmptyStateProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

function EmptyState({
  imageSrc,
  imageAlt,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-8 space-y-2">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={240}
        height={240}
        className="object-contain"
      />
      <p className="text-[16px] font-bold text-center leading-[100%] text-slate-400 font-nanum">
        {title}
      </p>
      <p className="text-[16px] font-bold text-center leading-[100%] text-slate-400 font-nanum">
        {description}
      </p>
    </div>
  );
}

interface TaskListSectionProps {
  titleImageSrc: string;
  titleImageAlt: string;
  tasks: Todo[];
  emptyStateContent: EmptyStateProps;
  onToggleTodo: (id: number) => void;
}

export default function TaskListSection({
  titleImageSrc,
  titleImageAlt,
  tasks,
  emptyStateContent,
  onToggleTodo,
}: TaskListSectionProps) {
  return (
    <section className="w-full md:flex-grow-0 md:flex-shrink-0 md:basis-1/2 lg:basis-[calc(50%-1rem)] xl:basis-[calc(50%-2rem)] max-w-full md:max-w-[588px] min-w-[300px] p-2">
      <h2 className="mb-4">
        <Image
          src={titleImageSrc}
          alt={titleImageAlt}
          width={101}
          height={36}
          className="w-[101px] h-[36px] rounded-[23px]"
        />
      </h2>
      {tasks.length === 0 ? (
        <EmptyState {...emptyStateContent} />
      ) : (
        <ul className="w-full space-y-3">
          {tasks.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggleTodo={onToggleTodo} />
          ))}
        </ul>
      )}
    </section>
  );
}
